import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Generate personalised energy-saving tips using Gemini 2.5 Pro.
 *
 * @param {Array}  appliances   – list of Appliance docs for the user
 * @param {Object} billingStats – latest BillingStats doc (may be null)
 * @returns {Promise<string[]>} – array of tip strings
 */
export const generateEnergyTips = async (appliances, billingStats) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

  // Build a concise context string for the prompt
  const applianceLines = appliances
    .map(a => `- ${a.name} (${a.category}): ${a.wattage}W, used ${parseFloat(a.totalKwhThisMonth || 0).toFixed(3)} kWh this month`)
    .join('\n');

  const billLine = billingStats
    ? `Last month bill: Rs ${billingStats.realTimeBill} for ${billingStats.totalKwh} kWh (${billingStats.monthLabel})`
    : 'No past billing data yet.';

  const prompt = `
You are an energy efficiency advisor for a home in Sri Lanka.
The user has the following home appliances:
${applianceLines || 'No appliances added yet.'}

${billLine}

Based on this data, give exactly 5 short, practical, actionable energy-saving tips.
Focus on the highest-wattage appliances and suggest specific time or usage changes.
Format your response as a plain JSON array of 5 strings, no markdown, no extra text.
Example: ["Tip 1...", "Tip 2...", "Tip 3...", "Tip 4...", "Tip 5..."]
`.trim();

  const result   = await model.generateContent(prompt);
  const text     = result.response.text().trim();

  // Extract JSON array from response (Gemini sometimes wraps in markdown)
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('AI returned unexpected format');

  const tips = JSON.parse(match[0]);
  return Array.isArray(tips) ? tips.slice(0, 5) : [];
};
