/**
 * Seed Multiple Admin Users Script
 * Creates multiple admin users for the system
 * 
 * Usage: node scripts/seedMultipleAdmins.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

// Load environment variables
dotenv.config();

// List of admins to create (dummy/demo accounts only)
const admins = [
  {
    email: 'demo1@example.com',
    password: 'password123'
  },
  {
    email: 'demo2@example.com',
    password: 'password123'
  },
  {
    email: 'demo3@example.com',
    password: 'password123'
  },
  {
    email: 'demo4@example.com',
    password: 'password123'
  },
  {
    email: 'demo5@example.com',
    password: 'password123'
  }
];

const seedAdmins = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB\n');

    let created = 0;
    let existing = 0;

    // Create each admin
    for (const adminData of admins) {
      const existingAdmin = await Admin.findOne({ email: adminData.email });
      
      if (existingAdmin) {
        console.log(`⚠ Admin already exists: ${adminData.email}`);
        existing++;
        continue;
      }

      const admin = new Admin({
        email: adminData.email,
        password: adminData.password
      });

      await admin.save();
      console.log(`✓ Created admin: ${adminData.email}`);
      created++;
    }

    console.log('\n═══════════════════════════════════════');
    console.log(`Total Admins Created: ${created}`);
    console.log(`Already Existing: ${existing}`);
    console.log('═══════════════════════════════════════\n');

    if (created > 0) {
      console.log('Admin Credentials:');
      admins.forEach(admin => {
        console.log(`Email: ${admin.email} | Password: ${admin.password}`);
      });
    }

    console.log('\n⚠ Please change passwords after first login!\n');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding admins:', error.message);
    process.exit(1);
  }
};

// Run the seed function
seedAdmins();
