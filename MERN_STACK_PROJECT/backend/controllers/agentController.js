const Agent = require('../models/Agent');

/**
 * Add a new agent
 * POST /api/agents
 * Body: { name, email, mobile, password }
 */
exports.addAgent = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Validate input
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if agent already exists
    const exists = await Agent.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Agent already exists with this email" });
    }

    // Create new agent
    const agent = new Agent({
      name,
      email,
      mobile,
      password
    });

    await agent.save();

    // Return agent without password
    res.status(201).json({
      _id: agent._id,
      name: agent.name,
      email: agent.email,
      mobile: agent.mobile,
      message: "Agent added successfully"
    });
  } catch (err) {
    console.error('Add agent error:', err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all agents
 * GET /api/agents
 */
exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.find().select('-password');
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

    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      { tasks },
      { new: true }
    ).select('-password');

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json({ agent, message: "Tasks updated successfully" });
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
