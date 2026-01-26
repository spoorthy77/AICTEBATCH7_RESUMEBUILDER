const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const addAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Check if demo admin exists
    const existing = await Admin.findOne({ email: 'demo-admin@example.com' });
    
    if (existing) {
      console.log('⚠️  Admin already exists: demo-admin@example.com');
      process.exit(0);
    }

    // Create new demo admin
    const admin = new Admin({
      email: 'demo-admin@example.com',
      password: 'password123'
    });
    
    await admin.save();
    
    console.log('\n✓ Admin created successfully!');
    console.log('═══════════════════════════════════════');
    console.log('Email:    demo-admin@example.com');
    console.log('Password: password123');
    console.log('═══════════════════════════════════════\n');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

addAdmin();
