const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/Users/lenovo/3D Objects/Web Development/projects/SkillPilot-ai/backend/.env' });

console.log('Connecting to:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('SUCCESS: MongoDB connected');
    process.exit(0);
  })
  .catch(err => {
    console.error('FAILURE: MongoDB connection error');
    console.error(err);
    process.exit(1);
  });
