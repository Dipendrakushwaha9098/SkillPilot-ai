const express = require('express');
const router = express.Router();
const { generateRoadmap, getRoadmap, generateAssessmentQuestions, generateWeeklyTest } = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateRoadmap);
router.post('/assessment', protect, generateAssessmentQuestions);
router.get('/weekly-test', protect, generateWeeklyTest);
router.get('/', protect, getRoadmap);

module.exports = router;
