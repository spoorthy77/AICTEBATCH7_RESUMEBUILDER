const mongoose = require('mongoose');
const Agent = require('./models/Agent');

async function testSaveAgent() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mern_stack_project'); // adjust connection string if needed
    console.log('Connected to MongoDB');

    const agent = new Agent({
      name: 'Test Agent',
      email: 'test@example.com',
      phone: '1234567890',
      password: 'password123',
      adminId: new mongoose.Types.ObjectId() // dummy adminId
    });

    await agent.save();
    console.log('Agent saved successfully!');
  } catch (error) {
    console.error('Error saving agent:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

testSaveAgent();