
const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdf = require("pdf-parse");
const xlsx = require("xlsx");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function parsePdf(buffer) {
  const data = await pdf(buffer);
  return data.text;
}

async function parseXlsx(buffer) {
  const workbook = xlsx.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const json = xlsx.utils.sheet_to_json(worksheet);
  return JSON.stringify(json);
}

async function extractDataWithGemini(text) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `
    Extract the ESG data from the following text and return it as a JSON object.
    The JSON object should follow this structure:
    {
      "environmental": {
        "carbon_emissions": { "value": null, "unit": "tonnes CO2e" },
        "water_consumption": { "value": null, "unit": "cubic meters" },
        "energy_usage": { "value": null, "unit": "kWh" },
        "waste_generated": { "value": null, "unit": "tonnes" }
      },
      "social": {
        "employee_turnover_rate": { "value": null, "unit": "%" },
        "workplace_accidents": { "value": null, "unit": "count" },
        "diversity_and_inclusion": {
          "female_representation": { "value": null, "unit": "%" },
          "minority_representation": { "value": null, "unit": "%" }
        }
      },
      "governance": {
        "board_independence": { "value": null, "unit": "%" },
        "executive_compensation_ratio": { "value": null, "unit": "ratio" }
      }
    }
    If a value is not present in the text, keep it as null.
    Return only the JSON object, no additional text.
    
    Text to parse:
    ${text}
  `;
  
  const maxRetries = 3;
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = await response.text();
      
      // Clean the response to get a valid JSON string
      const jsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(jsonString);
    } catch (error) {
      lastError = error;
      console.log(`Gemini API attempt ${attempt} failed:`, error.message);
      
      if (error.status === 503 && attempt < maxRetries) {
        // Wait before retry (exponential backoff)
        const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`Retrying in ${waitTime/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // If it's not a 503 error or we've exhausted retries, throw the error
      throw error;
    }
  }
  
  throw lastError;
}

module.exports = {
  parsePdf,
  parseXlsx,
  extractDataWithGemini,
};
