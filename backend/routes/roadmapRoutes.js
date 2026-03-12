const express = require('express');
const router = express.Router();
const { generateRoadmap, getRoadmap } = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateRoadmap);
router.get('/', protect, getRoadmap);

module.exports = router;
