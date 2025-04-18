
// // server/services/visionService.js
// const vision = require('@google-cloud/vision');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
// dotenv.config()
// // Create a client


// const credentials = JSON.parse(
//   Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'base64').toString('utf8')
// );

// initializeApp({
//   credential: cert(credentials),
// });


// // const client = new vision.ImageAnnotatorClient({
// //   keyFilename: path.join(__dirname, '../config/google-vision-credentials.json')
// // });

// const client = new vision.ImageAnnotatorClient({credentials});
const vision = require('@google-cloud/vision');
const dotenv = require('dotenv');
dotenv.config();

// Decode base64-encoded JSON credentials from env
const credentials = JSON.parse(
  Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'base64').toString('utf8')
);

// Create a client using the decoded credentials
const client = new vision.ImageAnnotatorClient({ credentials });
/**
 * Extract text from an image using Google Cloud Vision API
 * @param {string} filePath - Path to the image file
 * @returns {Promise<Object>} - OCR results
 */
async function detectText(filePath) {
  try {
    // Read file into memory
    const imageFile = fs.readFileSync(filePath);
    
    // Convert to base64
    const encodedImage = imageFile.toString('base64');
    
    // Detect text in the image
    const [result] = await client.textDetection({
      image: {
        content: encodedImage
      }
    });
    
    // Extract text annotations
    const detections = result.textAnnotations;
    
    if (!detections || detections.length === 0) {
      return {
        success: true,
        message: 'No text detected in the image',
        data: {
          fullText: '',
          words: []
        }
      };
    }
    
    // First annotation contains the full text
    const fullText = detections[0].description;
    
    // Rest of the annotations are individual words
    const words = detections.slice(1).map(word => ({
      text: word.description,
      boundingBox: word.boundingPoly.vertices,
      confidence: word.confidence || 0.99 // Vision API might not always return confidence
    }));
    
    return {
      success: true,
      message: 'OCR completed successfully',
      data: {
        fullText,
        words
      }
    };
  } catch (error) {
    console.error('Error in OCR processing:', error);
    return {
      success: false,
      message: 'Failed to process OCR',
      error: error.message
    };
  }
}

module.exports = {
  detectText
};
