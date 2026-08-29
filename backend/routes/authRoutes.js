const express = require('express');
const router = express.Router();
const { signup, login, googleLogin, verifyEmail } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/verify/:token', verifyEmail);

module.exports = router;
