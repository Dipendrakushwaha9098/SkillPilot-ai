const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/Users/lenovo/3D Objects/Web Development/projects/SkillPilot-ai/backend/.env' });
const User = require('../models/User');

async function verifyUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const result = await User.updateOne(
      { email: 'test_unique@example.com' },
      { $set: { isVerified: true } }
    );
    
    if (result.matchedCount > 0) {
      console.log('SUCCESS: User test_unique@example.com verified.');
    } else {
      console.log('FAILURE: User not found.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

verifyUser();
