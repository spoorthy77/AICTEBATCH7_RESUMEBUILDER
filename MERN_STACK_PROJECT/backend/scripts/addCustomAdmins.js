const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

// ✏️ EDIT THIS ARRAY - Add as many demo/admins as you want!
const newAdmins = [
  { email: 'spoorthi@gmail.com', password: 'password' },
  { email: 'demo1@example.com', password: 'password123' },
  { email: 'demo2@example.com', password: 'password123' },
  { email: 'demo3@example.com', password: 'password123' },
  { email: 'demo-teamlead@example.com', password: 'password123' },
  { email: 'demo-supervisor@example.com', password: 'password123' }
];

const addAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB\n');

    let added = 0;
    let skipped = 0;
    let failed = 0;

    for (const adminData of newAdmins) {
      try {
        // Check if admin already exists
        const existing = await Admin.findOne({ email: adminData.email });
        
        if (existing) {
          console.log(`⏭️  Skipped: ${adminData.email} (already exists)`);
          skipped++;
        } else {
          // Create new admin
          const admin = new Admin({
            email: adminData.email,
            password: adminData.password
          });
          await admin.save();
          console.log(`✅ Added: ${adminData.email}`);
          added++;
        }
      } catch (err) {
        console.log(`❌ Failed: ${adminData.email} - ${err.message}`);
        failed++;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log(`📊 Summary:`);
    console.log(`   ✅ Successfully added: ${added}`);
    console.log(`   ⏭️  Skipped (already exist): ${skipped}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log('='.repeat(50));

    // Show all admins
    const totalAdmins = await Admin.countDocuments();
    console.log(`\n📈 Total admins in database: ${totalAdmins}\n`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

addAdmins();
