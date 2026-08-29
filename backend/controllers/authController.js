const userStore = require('../utils/userStore');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/emailService');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_jwt_key_skillpilot', { expiresIn: '30d' });
};

// Email validation helper
const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) return false;
  
  // Disposable email check
  const disposableDomains = ['yopmail.com', 'temp-mail.org', 'guerrillamail.com', '10minutemail.com', 'mailinator.com'];
  const domain = email.split('@')[1].toLowerCase();
  if (disposableDomains.includes(domain)) return false;
  
  return true;
};

// ================= SIGNUP =================
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a real and valid email address.' });
    }

    // Check if user already exists
    const userExists = await userStore.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // Create user with verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const isConnected = userStore.isMongoConnected();

    const user = await userStore.createUser({ 
      name, 
      email, 
      password,
      verificationToken,
      verificationTokenExpires,
      isVerified: isConnected ? false : true // Auto-verify in memory fallback mode
    });

    // Send verification email if Mongo connected
    if (isConnected) {
      try {
        console.log(`[DEBUG] Verification Token for ${email}: ${verificationToken}`);
        await sendVerificationEmail(email, name, verificationToken);
      } catch (emailError) {
        console.error('[Verification Email Error]:', emailError);
      }
    }

    // Send response
    res.status(201).json({
      message: isConnected
        ? 'Registration successful. Please check your email to verify your account.'
        : 'Registration successful! (Offline dev mode auto-verified). You can log in now.'
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

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password' });
    }

    // Check user exists
    const user = await userStore.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'No account found with this email address' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Check verification status
    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email address before logging in.' });
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

// ================= GOOGLE LOGIN =================
exports.googleLogin = async (req, res) => {
  try {
    const { idToken, accessToken, token } = req.body;
    const authToken = token || idToken || accessToken;

    if (!authToken) {
      return res.status(400).json({ error: 'Google authentication token is required' });
    }

    let ticketPayload = null;

    // 1. Try verifying as Google ID Token (JWT format: 3 dot-separated parts)
    if (typeof authToken === 'string' && authToken.split('.').length === 3) {
      try {
        const ticket = await client.verifyIdToken({
          idToken: authToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (payload && payload.email) {
          ticketPayload = {
            name: payload.name || payload.given_name || 'Google User',
            email: payload.email,
            sub: payload.sub,
            picture: payload.picture,
            email_verified: payload.email_verified
          };
        }
      } catch (idErr) {
        console.warn('[Google ID Token Verification Notice]:', idErr.message);
      }
    }

    // 2. If ID token verification was not applicable or failed, try Google UserInfo API using Access Token
    if (!ticketPayload) {
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${authToken}` }
        });

        if (userInfoRes.ok) {
          const info = await userInfoRes.json();
          if (info && info.email) {
            ticketPayload = {
              name: info.name || info.given_name || 'Google User',
              email: info.email,
              sub: info.sub,
              picture: info.picture,
              email_verified: info.email_verified ?? true
            };
          }
        }
      } catch (accessErr) {
        console.warn('[Google UserInfo API Error]:', accessErr.message);
      }
    }

    // 3. Security Check: Reject if token is invalid or email couldn't be cryptographically verified
    if (!ticketPayload || !ticketPayload.email) {
      return res.status(401).json({ error: 'Invalid or expired Google authentication token. Security check failed.' });
    }

    const { name, email, sub: googleId, picture: avatarUrl, email_verified } = ticketPayload;

    if (email_verified === false) {
      return res.status(400).json({ error: 'Your Google email is not verified.' });
    }

    // Find existing user by googleId OR email
    let user = await userStore.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      let modified = false;
      if (!user.googleId) {
        user.googleId = googleId;
        modified = true;
      }
      if (avatarUrl && !user.avatarUrl) {
        user.avatarUrl = avatarUrl;
        modified = true;
      }
      if (!user.isVerified) {
        user.isVerified = true;
        modified = true;
      }
      if (modified) {
        await user.save();
      }
    } else {
      user = await userStore.createUser({
        name: name || 'Google Learner',
        email,
        googleId,
        avatarUrl,
        password: crypto.randomBytes(16).toString('hex'),
        isVerified: true
      });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl
      },
      token: generateToken(user._id)
    });

  } catch (error) {
    console.error('[Google Login Error]:', error);
    res.status(500).json({ error: 'Failed to complete Google login: ' + error.message });
  }
};

// ================= VERIFY EMAIL =================
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await userStore.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    console.error('[Verify Email Error]:', error);
    res.status(500).json({ error: error.message });
  }
};

// ================= GET ME (CURRENT USER PROFILE) =================
exports.getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatarUrl: req.user.avatarUrl,
      createdAt: req.user.createdAt
    });
  } catch (error) {
    console.error('[Get Me Error]:', error);
    res.status(500).json({ error: error.message });
  }
};