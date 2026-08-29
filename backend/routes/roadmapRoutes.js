const express = require('express');
const router = express.Router();
const { 
  generateRoadmap, 
  getRoadmap, 
  generateAssessmentQuestions, 
  generateWeeklyTest,
  getPhase,
  getTopic
} = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateRoadmap);
router.post('/assessment', protect, generateAssessmentQuestions);
router.get('/weekly-test', protect, generateWeeklyTest);
router.get('/phases/:phaseId', protect, getPhase);
router.get('/topics/:topicId', protect, getTopic);
router.get('/', protect, getRoadmap);

module.exports = router;
