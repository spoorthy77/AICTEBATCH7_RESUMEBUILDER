const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Agent = require('../models/Agent');

dotenv.config();

const removeSampleAgents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const sampleEmails = ['john@example.com', 'jane@example.com', 'bob@example.com'];

    for (const email of sampleEmails) {
      const result = await Agent.findOneAndDelete({ email });
      if (result) {
        console.log(`Removed sample agent: ${result.name} (${email})`);
      } else {
        console.log(`Sample agent ${email} not found`);
      }
    }

    console.log('Sample agents removal complete');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

removeSampleAgents();