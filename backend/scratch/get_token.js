const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/Users/lenovo/3D Objects/Web Development/projects/SkillPilot-ai/backend/.env' });
const User = require('../models/User');

async function getVerificationToken() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ email: 'final_test@example.com' });
    if (user) {
      console.log(`TOKEN: ${user.verificationToken}`);
    } else {
      console.log('User not found');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

getVerificationToken();
