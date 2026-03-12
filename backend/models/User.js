const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  interests: [String],
  goals: String,
  dailyStudyTime: Number,
  assessmentCompleted: { type: Boolean, default: false },
  roadmap: { type: Object, default: {} },
  progress: {
    completedLessons: [String],
    quizResults: [{ topic: String, score: Number }],
    streak: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now }
  },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
