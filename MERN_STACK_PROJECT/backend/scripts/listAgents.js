const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Agent = require('../models/Agent');

dotenv.config();

const listAgents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const agents = await Agent.find().select('name email phone createdAt');
    console.log(`\nFound ${agents.length} agents:`);
    agents.forEach((agent, index) => {
      console.log(`${index + 1}. ${agent.name} (${agent.email}) - Created: ${agent.createdAt}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

listAgents();