// server/routes/ocrRoutes.js
const express = require('express');
const router = express.Router();
const ocrController = require('../controllers/ocrController.js');
const upload = require('../middleware/uploadMiddleware');

// Route to process an image for OCR
router.post('/process', upload.single('image'), ocrController.processImage);

module.exports = router;