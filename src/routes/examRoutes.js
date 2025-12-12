const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');

router.post('/generate', examController.generatePaper);
router.post('/analyze', examController.analyzePaper);

module.exports = router;