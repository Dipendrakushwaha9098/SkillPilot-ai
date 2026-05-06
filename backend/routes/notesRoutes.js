const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, notesController.generateNotes);

module.exports = router;
