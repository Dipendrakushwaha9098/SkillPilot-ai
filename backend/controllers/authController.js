const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ================= SIGNUP =================
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;



    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' }); // ✅ fixed
    }

    // Create user
    const user = await User.create({ name, email, password });

    // Send response
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token: generateToken(user._id)
    });

  } catch (error) {
    console.error('[Signup Error]:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }

};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'User not found' }); // ✅ fixed
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' }); // ✅ fixed
    }

    // Success response
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token: generateToken(user._id)
    });

  } catch (error) {
    console.error('[Login Error]:', error);
    res.status(500).json({ error: error.message });
  }
};