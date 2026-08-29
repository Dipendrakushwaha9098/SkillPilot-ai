const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const dns = require('dns');

// Force Node.js to use Google's DNS (fixes ECONNREFUSED for MongoDB Atlas SRV)
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Disable query buffering so Mongoose fails fast when Mongo is offline
mongoose.set('bufferCommands', false);

// Database Connection
mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 3000 })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection warning (resilient in-memory fallback active):', err.message));

// Routes
const authRoutes = require('./routes/authRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const progressRoutes = require('./routes/progressRoutes');
const notesRoutes = require('./routes/notesRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/notes', notesRoutes);

app.get('/', (req, res) => {
  res.send('SkillPilot AI API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
