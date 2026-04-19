const axios = require("axios");

const dotenv = require('dotenv')

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

async function analyzeWithAI(payload) {
  try {
    const prompt = `
You are a cybersecurity system.

Analyze the following API request payload.

Return ONLY valid JSON:
{
  "classification": "NORMAL | SUSPICIOUS | MALICIOUS",
  "risk": "LOW | MEDIUM | HIGH",
  "reason": "short explanation"
}

Payload:
${JSON.stringify(payload)}
`;

    const response = await axios.post(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 3000
      }
    );

    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // 🔍 Extract JSON safely
    const match = text.match(/\{[\s\S]*\}/);

    if (match) {
      return JSON.parse(match[0]);
    }

    return {
      classification: "NORMAL",
      risk: "LOW",
      reason: "AI returned non-JSON"
    };

  } catch (err) {
    console.error("Gemini REST error:");
    console.error(err.response?.data || err.message);

    return {
      classification: "NORMAL",
      risk: "LOW",
      reason: "AI fallback"
    };
  }
}

module.exports = { analyzeWithAI };