import vision from '@google-cloud/vision';
import path from 'path';

let client;

try {
  let config = {};

  if (process.env.GOOGLE_CREDS) {
    config.credentials = JSON.parse(process.env.GOOGLE_CREDS);
    console.log("Vision API: Initialized via environment variable.");
  } else {
    const KEY_FILENAME = path.join(process.cwd(), 'config', 'vision-key.json');
    config.keyFilename = KEY_FILENAME;
    console.log(`Vision API: Initialized via local file: ${KEY_FILENAME}`);
  }

  client = new vision.ImageAnnotatorClient(config);
} catch (error) {
  console.error("Failed to initialize Google Vision Client:", error.message);
}

/**
 * Analyzes an image buffer using Google Cloud Vision API and returns labels
 */
export const analyzeImageBuffer = async (imageBuffer) => {
  if (!client) throw new Error('Google Vision API is not configured on this server.');

  try {
    const [result] = await client.labelDetection(imageBuffer);
    const labels = result.labelAnnotations.map(label => label.description.toLowerCase());
    
    return labels;
  } catch (error) {
    console.error('Vision API Error:', error);
    throw new Error('Failed to analyze image with Vision API');
  }
};