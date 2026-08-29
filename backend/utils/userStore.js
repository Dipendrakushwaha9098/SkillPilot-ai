const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const FALLBACK_FILE = path.join(__dirname, '../scratch/users_fallback.json');

// In-memory fallback database with file persistence
const memoryStore = new Map();

// Helper to load persistent fallback users from disk on startup
function loadFallbackStore() {
  try {
    if (fs.existsSync(FALLBACK_FILE)) {
      const data = fs.readFileSync(FALLBACK_FILE, 'utf8');
      const parsed = JSON.parse(data);
      for (const [id, user] of Object.entries(parsed)) {
        memoryStore.set(id, user);
      }
      console.log(`[userStore] Loaded ${memoryStore.size} persistent fallback user(s) from disk.`);
    }
  } catch (err) {
    console.warn('[userStore] Could not load fallback store:', err.message);
  }
}

// Helper to save fallback users to disk
function saveFallbackStore() {
  try {
    const dir = path.dirname(FALLBACK_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const obj = {};
    for (const [id, user] of memoryStore.entries()) {
      obj[id] = user;
    }
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(obj, null, 2), 'utf8');
  } catch (err) {
    console.warn('[userStore] Could not save fallback store:', err.message);
  }
}

// Load on start
loadFallbackStore();

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

// Convert memory user to model-like object with save method
function formatMemoryUser(data) {
  if (!data) return null;

  const user = { ...data };
  user.save = async function() {
    memoryStore.set(String(this._id), { ...this });
    saveFallbackStore();
    return this;
  };
  user.comparePassword = async function(candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
  };

  return user;
}

async function findOne(query) {
  if (isMongoConnected()) {
    try {
      return await User.findOne(query);
    } catch (err) {
      console.warn('[Mongo Query Error, falling back to memory store]:', err.message);
    }
  }

  // Memory fallback
  for (const user of memoryStore.values()) {
    if (query.email && user.email?.toLowerCase() === query.email?.toLowerCase()) {
      return formatMemoryUser(user);
    }
    if (query.googleId && user.googleId === query.googleId) {
      return formatMemoryUser(user);
    }
    if (query.verificationToken && user.verificationToken === query.verificationToken) {
      if (query.verificationTokenExpires?.$gt && user.verificationTokenExpires <= Date.now()) {
        continue;
      }
      return formatMemoryUser(user);
    }
    if (query.$or) {
      for (const cond of query.$or) {
        if (cond.googleId && user.googleId === cond.googleId) return formatMemoryUser(user);
        if (cond.email && user.email?.toLowerCase() === cond.email?.toLowerCase()) return formatMemoryUser(user);
      }
    }
  }
  return null;
}

async function findById(id) {
  if (isMongoConnected()) {
    try {
      return await User.findById(id);
    } catch (err) {
      console.warn('[Mongo findById Error, falling back to memory store]:', err.message);
    }
  }

  const user = memoryStore.get(String(id));
  return formatMemoryUser(user);
}

async function createUser(userData) {
  if (isMongoConnected()) {
    try {
      return await User.create(userData);
    } catch (err) {
      console.warn('[Mongo create Error, falling back to memory store]:', err.message);
    }
  }

  // Memory fallback
  const id = userData._id || ('mem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
  let hashedPassword = userData.password;
  if (hashedPassword && !hashedPassword.startsWith('$2a$') && !hashedPassword.startsWith('$2b$')) {
    hashedPassword = await bcrypt.hash(hashedPassword, 10);
  }

  const newUser = {
    _id: id,
    name: userData.name || 'SkillPilot Learner',
    email: userData.email,
    password: hashedPassword,
    googleId: userData.googleId,
    avatarUrl: userData.avatarUrl,
    verificationToken: userData.verificationToken,
    verificationTokenExpires: userData.verificationTokenExpires,
    isVerified: userData.isVerified ?? true, // Auto-verify in memory mode
    skillLevel: userData.skillLevel || 'Beginner',
    interests: userData.interests || [],
    goals: userData.goals || '',
    dailyStudyTime: userData.dailyStudyTime || 2,
    assessmentCompleted: userData.assessmentCompleted || false,
    roadmap: userData.roadmap || {},
    progress: userData.progress || { completedLessons: [], quizResults: [], streak: 0, lastActive: new Date() },
    createdAt: userData.createdAt || new Date()
  };

  memoryStore.set(String(id), newUser);
  saveFallbackStore();
  return formatMemoryUser(newUser);
}

module.exports = {
  isMongoConnected,
  findOne,
  findById,
  createUser,
  memoryStore
};
