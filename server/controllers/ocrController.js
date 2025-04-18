// server/controllers/ocrController.js
const fs = require('fs');
const path = require('path');
const visionService = require('../services/visionService');

/**
 * Process an image for OCR
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function processImage(req, res) {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const filePath = req.file.path;
    
    // Process the image with OCR
    const result = await visionService.detectText(filePath);
    
    // Add file info to the response
    if (result.success) {
      result.fileInfo = {
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      };
    }
    
    // Delete the file after processing (optional - can be kept for caching)
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });
    
    // Return the OCR results
    return res.status(result.success ? 200 : 422).json(result);
  } catch (error) {
    console.error('Controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing image',
      error: error.message
    });
  }
}

module.exports = {
  processImage
};