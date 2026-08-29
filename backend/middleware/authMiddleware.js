const jwt = require('jsonwebtoken');
const userStore = require('../utils/userStore');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_jwt_key_skillpilot');

      let user = await userStore.findById(decoded.id);

      if (!user) {
        console.warn(`[authMiddleware] User ID ${decoded.id} from valid JWT not found in DB. Auto-reconstructing session...`);
        user = await userStore.createUser({
          _id: decoded.id,
          name: 'SkillPilot Learner',
          email: 'learner@skillpilot.ai',
          isVerified: true
        });
      }

      req.user = user;

      next(); // ✅ always call next
    } catch (error) {
      console.error("Auth Error:", error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };