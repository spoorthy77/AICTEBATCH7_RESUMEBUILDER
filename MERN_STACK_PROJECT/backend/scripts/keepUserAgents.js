const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Agent = require('../models/Agent');

dotenv.config();

const keepUserAgents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Keep only user-added agents (the ones added through the UI)
    const userAgentEmails = ['spoorthi@gmail.com', 'moulya@gmail.com'];

    // Get all agents
    const allAgents = await Agent.find();

    let removedCount = 0;
    for (const agent of allAgents) {
      if (!userAgentEmails.includes(agent.email)) {
        await Agent.findByIdAndDelete(agent._id);
        console.log(`Removed: ${agent.name} (${agent.email})`);
        removedCount++;
      } else {
        console.log(`Kept: ${agent.name} (${agent.email})`);
      }
    }

    console.log(`\nRemoved ${removedCount} sample agents`);
    console.log(`Kept ${userAgentEmails.length} user-added agents`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

keepUserAgents();