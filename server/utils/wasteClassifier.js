/**
 * Maps common Vision API labels to EcoLife supported waste types.
 *
 * Supported primary categories: 'Plastic', 'Paper', 'Glass', 'Organic', 'E-waste'
 */

const KEYWORD_MAP = {
  // ORGANIC
  'Organic': [
    'food', 'fruit', 'vegetable', 'plant', 'leaf', 'wood', 'apple', 'banana',
    'organism', 'cuisine', 'dish', 'ingredient', 'meat', 'flower', 'tree', 'bread'
  ],
  // PAPER
  'Paper': [
    'paper', 'cardboard', 'box', 'document', 'newspaper', 'magazine', 
    'paper product', 'carton', 'origami', 'packaging'
  ],
  // PLASTIC
  'Plastic': [
    'plastic', 'bottle', 'water bottle', 'container', 'wrapper', 'bag', 
    'plastic bag', 'polyethylene', 'cup'
  ],
  // GLASS
  'Glass': [
    'glass', 'jar', 'wine glass', 'glass bottle', 'drinkware', 'transparent material'
  ],
  // E-WASTE
  'E-waste': [
    'electronics', 'computer', 'phone', 'mobile phone', 'device', 'cable', 
    'wire', 'laptop', 'hardware', 'gadget', 'electronic instrument', 'pc'
  ]
};

// Fallback logic for calculating recyclability based on our constants
const BIODEGRADABLE_TYPES = ['Organic', 'Paper'];
const RECYCLABLE_TYPES = ['Plastic', 'Paper', 'Glass', 'E-waste'];

/**
 * Parses an array of labels from Google Vision API and determines the best waste category.
 * @param {Array<string>} labels - Array of lowercase string tags from Vision API.
 * @returns {Object} The classification containing wasteType, isRecyclable, and isBiodegradable.
 */
export const classifyWaste = (labels) => {
  if (!labels || labels.length === 0) {
    return {
      wasteType: 'Plastic', // fallback to default
      isRecyclable: true,
      isBiodegradable: false
    };
  }

  // Count matches for each category based on keywords
  const scores = {
    Organic: 0,
    Paper: 0,
    Plastic: 0,
    Glass: 0,
    'E-waste': 0
  };

  // Give higher weight to labels that appear first as Vision API orders by confidence
  labels.forEach((label, index) => {
    const weight = Math.max(1, 10 - index); // Max 10 points down to 1 point
    
    // Check which category this label belongs to
    for (const [category, keywords] of Object.entries(KEYWORD_MAP)) {
      if (keywords.some(kw => label.includes(kw))) {
        scores[category] += weight;
      }
    }
  });

  // Find the highest scoring category
  let bestMatch = 'Plastic'; // Default fallback
  let highestScore = 0;

  for (const [category, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score;
      bestMatch = category;
    }
  }

  return {
    wasteType: bestMatch,
    isRecyclable: RECYCLABLE_TYPES.includes(bestMatch),
    isBiodegradable: BIODEGRADABLE_TYPES.includes(bestMatch),
    confidenceScore: highestScore, // strictly for debugging or thresholding
    detectedLabels: labels.slice(0, 5) // keep top 5 for notes/debugging
  };
};
