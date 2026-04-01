import vision from '@google-cloud/vision';
import path from 'path';

// Define the path to the Google Credentials file
const KEY_FILENAME = path.join(process.cwd(), 'config', 'vision-key.json');

let client;

try {
  // Initialize the Vision Client with explicit credentials file path
  client = new vision.ImageAnnotatorClient({
    keyFilename: KEY_FILENAME,
  });
} catch (error) {
  console.error("Failed to initialize Google Vision Client. Make sure vision-key.json is present.", error);
}

/**
 * Analyzes an image buffer using Google Cloud Vision API and returns labels
 * @param {Buffer} imageBuffer - The image uploaded directly from memory
 * @returns {Array<string>} List of labels detected in the image
 */
export const analyzeImageBuffer = async (imageBuffer) => {
  if (!client) throw new Error('Google Vision API is not configured on this server.');

  try {
    // Perform label detection
    const [result] = await client.labelDetection(imageBuffer);
    const labels = result.labelAnnotations.map(label => label.description.toLowerCase());
    
    return labels;
  } catch (error) {
    console.error('Vision API Error:', error);
    throw new Error('Failed to analyze image with Vision API');
  }
};
