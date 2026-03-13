const express = require('express');
const router = express.Router();
const { updateProgress, getProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.post('/update', protect, updateProgress);
router.get('/', protect, getProgress);

module.exports = router;
