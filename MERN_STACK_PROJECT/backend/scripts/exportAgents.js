const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Agent = require('../models/Agent');

dotenv.config();

async function exportAgentsToCSV() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const agents = await Agent.find().select('name email phone').sort({ createdAt: 1 });

    // Create CSV content
    let csvContent = 'Name,Email,Phone,Password\n';

    agents.forEach((agent, index) => {
      // Generate the same password that was used during creation
      // Note: Since passwords are hashed, we can't retrieve the original
      // But for demo purposes, we'll show that each has a unique password
      const password = `Password${index + 1}!`; // This is just for display
      csvContent += `"${agent.name}","${agent.email}","${agent.phone}","${password}"\n`;
    });

    // Write to file
    const filePath = path.join(__dirname, '../../data/dummy-agents.csv');
    fs.writeFileSync(filePath, csvContent);

    console.log(`✅ Exported ${agents.length} agents to: ${filePath}`);
    console.log('\n📄 CSV Format:');
    console.log('Name,Email,Phone,Password');
    console.log('Gregory Richardson,gregory.richardson@company.com,+1-179-275-9182,Password1!');
    console.log('Ryan Thompson,ryan.thompson@yahoo.com,+1-516-898-6142,Password2!');
    console.log('...');
    console.log('\n⚠ Note: Actual passwords in database are hashed and unique.');
    console.log('⚠ The passwords shown in CSV are for reference only.');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

exportAgentsToCSV();