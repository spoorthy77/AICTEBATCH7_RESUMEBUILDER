// Import required dependencies
const fs = require('fs');                    // File system operations
const path = require('path');                // Path utilities
const Agent = require('../models/Agent');    // Agent database model
const Distribution = require('../models/Distribution'); // Distribution database model
const { parseCSV, parseExcel, isValidFileFormat, validateDataStructure } = require('../utils/fileParser'); // File parsing utilities
const { distributeItems, validateAgentCount } = require('../utils/distribute');         // Distribution utilities

/**
 * Handle file upload and distribution
 * POST /api/upload
 * @param {Object} req - Express request object containing file data
 * @param {Object} res - Express response object for sending responses
 * @returns {JSON} Success message with distribution details or error message
 */
exports.uploadFile = async (req, res) => {
  let filePath = null; // Track uploaded file path for cleanup
  try {
    // Step 1: Check if a file was actually uploaded in the request
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Step 2: Extract file information from the uploaded file
    filePath = req.file.path;              // Full path to the uploaded file
    const fileName = req.file.originalname; // Original filename from client

    // Step 3: Validate that the file has an acceptable format (CSV, XLSX, XLS)
    if (!isValidFileFormat(fileName)) {
      fs.unlinkSync(filePath);             // Delete the invalid file
      return res.status(400).json({ 
        message: "Invalid file format. Please upload CSV, XLSX, or XLS file" 
      });
    }

    // Step 4: Parse the file content based on its extension
    let data = [];                          // Will store parsed file data
    const ext = path.extname(fileName).toLowerCase(); // Get file extension

    // Parse CSV files
    if (ext === '.csv') {
      data = await parseCSV(filePath);
    } 
    // Parse Excel files (XLSX or XLS)
    else if (ext === '.xlsx' || ext === '.xls') {
      data = await parseExcel(filePath);
    }

    // Step 5: Validate that parsed data has required fields and structure
    const validation = validateDataStructure(data);
    if (!validation.valid) {
      fs.unlinkSync(filePath);             // Delete the file if validation fails
      return res.status(400).json({ 
        message: "Invalid file structure",
        errors: validation.errors           // Return specific validation errors
      });
    }

    // Step 6: Retrieve all available agents from database for the current admin
    const agents = await Agent.find({ adminId: req.adminId }).select('_id name email'); // Fetch agent IDs, names, and emails

    // Step 7: Log file upload information for debugging/monitoring
    console.log(`\n📊 File Upload: ${fileName}`);
    console.log(`📝 Total rows in CSV: ${data.length}`);
    console.log(`👥 Available agents: ${agents.length || 0}`);

    // Step 8: Validate that at least one agent exists for distribution
    if (agents.length < 1) {
      fs.unlinkSync(filePath);             // Delete file if no agents available
      return res.status(400).json({ 
        message: "No agents found. Please add agents first." 
      });
    }

    // Step 9: Distribute the data items evenly among all available agents
    const distributions = distributeItems(data, agents); // Each agent gets assigned items

    // Step 10: Log distribution summary to console
    console.log(`\n📦 Distribution Summary:`);
    distributions.forEach(dist => {
      console.log(`   ${dist.agentName}: ${dist.itemCount} tasks`);
    });

    // Step 11: Update each agent's tasks in the database (REPLACES existing tasks)
    const updatePromises = distributions.map(dist => {
      return Agent.findByIdAndUpdate(
        dist.agentId,
        { tasks: dist.items },              // Sets new tasks (replaces old ones)
        { new: true }                        // Return updated document
      );
    });

    // Wait for all agent updates to complete
    await Promise.all(updatePromises);

    // Step 12: Log successful distribution completion
    console.log(`✅ Successfully distributed ${data.length} tasks to ${agents.length} agents\n`);

    // Step 13: Save the distribution record to database for audit trail
    const distribution = new Distribution({
      adminId: req.adminId,                // Associate with the admin who uploaded
      fileName,                             // Name of uploaded file
      distributions: distributions.map(d => ({
        agentId: d.agentId,                 // ID of agent
        agentName: d.agentName,             // Name of agent
        items: d.items                      // Items assigned to this agent
      })),
      totalItems: data.length               // Total items in file
    });

    await distribution.save();              // Persist to database

    // Step 14: Clean up the uploaded temporary file from server
    fs.unlinkSync(filePath);

    // Step 15: Send success response with distribution details to client
    res.json({
      message: "File uploaded and distributed successfully",
      totalItems: data.length,              // Total items processed
      agentsCount: agents.length,           // Number of agents who received items
      distributions: distributions.map(d => ({
        agentName: d.agentName,             // Agent name
        itemCount: d.itemCount              // Number of items assigned
      }))
    });

  } catch (err) {
    // Error handling: Clean up uploaded file if it exists
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);              // Remove temporary file
    }

    // Log error for debugging
    console.error('Upload error:', err);
    
    // Send error response to client
    res.status(500).json({ 
      message: "Error processing file", 
      error: err.message                    // Include error details
    });
  }
};

/**
 * Get all distributions from database
 * GET /api/upload/distributions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} Array of all distribution records, sorted by most recent first
 */
exports.getDistributions = async (req, res) => {
  try {
    // Fetch all distributions for the current admin and sort by upload date (newest first)
    const distributions = await Distribution.find({ adminId: req.adminId }).sort({ uploadedAt: -1 });
    res.json(distributions);
  } catch (err) {
    // Log error and return 500 status
    console.error('Get distributions error:', err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get a specific distribution by its ID
 * GET /api/upload/distributions/:id
 * @param {Object} req - Express request object (contains distribution ID in params)
 * @param {Object} res - Express response object
 * @returns {JSON} Specific distribution record or 404 error if not found
 */
exports.getDistributionById = async (req, res) => {
  try {
    // Fetch distribution by ID from database for the current admin
    const distribution = await Distribution.findOne({ _id: req.params.id, adminId: req.adminId });
    
    // Check if distribution exists
    if (!distribution) {
      return res.status(404).json({ message: "Distribution not found" });
    }
    
    // Return the found distribution
    res.json(distribution);
  } catch (err) {
    // Log error and return 500 status
    console.error('Get distribution error:', err);
    res.status(500).json({ message: "Server error" });
  }
};

// Legacy export for backwards compatibility with older code versions
exports.uploadAndDistribute = exports.uploadFile;
