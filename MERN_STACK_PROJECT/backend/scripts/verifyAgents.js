const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Agent = require('../models/Agent');

dotenv.config();

async function verifyAgents() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const count = await Agent.countDocuments();
    console.log(`Total agents in database: ${count}`);

    const agents = await Agent.find().limit(5).select('name email phone');
    console.log('\nFirst 5 agents:');
    agents.forEach((agent, i) => {
      console.log(`${i+1}. ${agent.name} - ${agent.email} - ${agent.phone}`);
    });

    // Check password uniqueness (hashed, so just check they exist)
    const agentsWithPasswords = await Agent.find().limit(10);
    console.log('\nPassword verification (first 10):');
    agentsWithPasswords.forEach((agent, i) => {
      console.log(`${i+1}. ${agent.name}: password exists - ${!!agent.password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

verifyAgents();