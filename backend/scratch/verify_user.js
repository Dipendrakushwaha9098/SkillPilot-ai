const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/Users/lenovo/3D Objects/Web Development/projects/SkillPilot-ai/backend/.env' });
const User = require('../models/User');

const emailToVerify = process.argv[2];

if (!emailToVerify) {
  console.log('Usage: node scratch/verify_user.js <email>');
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const result = await User.updateOne(
      { email: emailToVerify },
      { $set: { isVerified: true } }
    );

    if (result.matchedCount > 0) {
      console.log(`✅ User ${emailToVerify} is now verified!`);
    } else {
      console.log(`❌ User ${emailToVerify} not found.`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
