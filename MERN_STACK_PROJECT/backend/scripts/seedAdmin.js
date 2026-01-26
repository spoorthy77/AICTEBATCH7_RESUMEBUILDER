/**
 * Seed Admin User Script
 * This script creates a default admin user for development and testing
 * 
 * Usage: node scripts/seedAdmin.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Check if admin already exists (use demo email for seeded account)
    const existingAdmin = await Admin.findOne({ email: 'demo1@example.com' });
    
    if (existingAdmin) {
      console.log('⚠ Admin user already exists!');
      console.log('Email: demo1@example.com');
      process.exit(0);
    }

    // Create new demo admin
    const admin = new Admin({
      email: 'demo1@example.com',
      password: 'password123'
    });

    await admin.save();

    console.log('\n✓ Admin user created successfully!');
    console.log('═══════════════════════════════════════');
    console.log('Email:    demo1@example.com');
    console.log('Password: password123');
    console.log('═══════════════════════════════════════');
    console.log('\n⚠ Please change the password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding admin:', error.message);
    process.exit(1);
  }
};

// Run the seed function
seedAdmin();
