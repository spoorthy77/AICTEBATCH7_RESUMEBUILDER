const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

dotenv.config();

const listAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const admins = await Admin.find().select('email createdAt');
    console.log(`\nFound ${admins.length} admins:`);
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.email} - Created: ${admin.createdAt}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

listAdmins();