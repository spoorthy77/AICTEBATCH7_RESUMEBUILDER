const mongoose = require('mongoose');
const Agent = require('../models/Agent');

/**
 * Add a new agent
 * POST /api/agents
 * Body: { name, email, phone, password }
 */
exports.addAgent = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Trim inputs
    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim();
    const trimmedPhone = phone?.trim();
    const trimmedPassword = password?.trim();

    // Validate input: ensure all fields are present and not empty
    if (!trimmedName || !trimmedEmail || !trimmedPhone || !trimmedPassword) {
      return res.status(400).json({ message: "All fields are required and cannot be empty" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    // Validate phone format: simple length check
    if (trimmedPhone.length < 10) {
      return res.status(400).json({ message: "Phone number must be at least 10 digits" });
    }

    // Validate password length
    if (trimmedPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Check if agent already exists
    const exists = await Agent.findOne({ email: trimmedEmail.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: "Agent already exists with this email" });
    }

    // Validate adminId
    if (!req.adminId || !mongoose.Types.ObjectId.isValid(req.adminId)) {
      return res.status(400).json({ message: "Invalid admin ID" });
    }

    // Create new agent
    const agent = new Agent({
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      password: trimmedPassword,
      adminId: new mongoose.Types.ObjectId(req.adminId)
    });

    await agent.save();

    // Return agent without password
    res.status(201).json({
      _id: agent._id,
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      message: "Agent added successfully"
    });
  } catch (err) {
    console.error('Add agent error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: `Validation error: ${err.message}` });
    }
    if (err.code === 11000) {
      return res.status(400).json({ message: "Agent already exists with this email" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get all agents
 * GET /api/agents
 */
exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.find({ adminId: req.adminId }).select('-password').sort({ updatedAt: -1 });
    res.json(agents);
  } catch (err) {
    console.error('Get agents error:', err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get agent by ID
 * GET /api/agents/:id
 */
exports.getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).select('-password');
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    res.json(agent);
  } catch (err) {
    console.error('Get agent by ID error:', err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update agent (all fields except password)
 * PUT /api/agents/:id
 * Body: { name, email, phone, tasks }
 */
exports.updateAgent = async (req, res) => {
  try {
    const { name, email, phone, tasks } = req.body;

    // Build update object with only allowed fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (tasks !== undefined) updateData.tasks = tasks;

    // Check if email is being updated and if it already exists
    if (email !== undefined) {
      const existingAgent = await Agent.findOne({ email: email.toLowerCase(), _id: { $ne: req.params.id } });
      if (existingAgent) {
        return res.status(400).json({ message: "Email already exists for another agent" });
      }
    }

    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Update fields
    if (name !== undefined) agent.name = name;
    if (email !== undefined) agent.email = email;
    if (phone !== undefined) agent.phone = phone;
    if (tasks !== undefined) agent.tasks = tasks;

    // Save to trigger pre-save middleware for updatedAt
    await agent.save();

    res.json({ agent: { _id: agent._id, name: agent.name, email: agent.email, phone: agent.phone, tasks: agent.tasks, createdAt: agent.createdAt, updatedAt: agent.updatedAt }, message: "Agent updated successfully" });
  } catch (err) {
    console.error('Update agent error:', err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update agent tasks
 * PUT /api/agents/:id/tasks
 * Body: { tasks: [...] }
 */
exports.updateAgentTasks = async (req, res) => {
  try {
    const { tasks } = req.body;

    if (!Array.isArray(tasks)) {
      return res.status(400).json({ message: "Tasks must be an array" });
    }

    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    agent.tasks = tasks;
    await agent.save();

    res.json({ agent: { _id: agent._id, name: agent.name, email: agent.email, phone: agent.phone, tasks: agent.tasks, createdAt: agent.createdAt, updatedAt: agent.updatedAt }, message: "Tasks updated successfully" });
  } catch (err) {
    console.error('Update tasks error:', err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete agent
 * DELETE /api/agents/:id
 */
exports.deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);
    
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json({ message: "Agent deleted successfully", agentName: agent.name });
  } catch (err) {
    console.error('Delete agent error:', err);
    res.status(500).json({ message: "Server error" });
  }
};
