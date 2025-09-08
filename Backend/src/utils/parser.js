const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdf = require("pdf-parse");
const xlsx = require("xlsx");

// Initialize Gemini AI with API key check
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set');
}

// Initialize the API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiVersion: 'v1',
});

// Check Gemini API connection
async function checkGeminiStatus() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "Just reply with 'OK' if you can read this.";
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (text && text.includes('OK')) {
      console.log('✅ Gemini API connection successful');
      return true;
    } else {
      throw new Error('Invalid response from Gemini API');
    }
  } catch (error) {
    console.error('❌ Gemini API connection failed:', error);
    console.error('Error details:', error.message);
    return false;
  }
}

async function parsePdf(buffer) {
  try {
    console.log('📄 Starting PDF parsing...');
    
    // Validate buffer
    if (!buffer || !(buffer instanceof Buffer)) {
      console.error('Invalid buffer:', typeof buffer);
      throw new Error('Invalid PDF buffer provided');
    }
    
    console.log('Buffer size:', buffer.length, 'bytes');
    
    // Ensure we have a valid PDF header
    const pdfHeader = buffer.slice(0, 5).toString();
    if (pdfHeader !== '%PDF-') {
      throw new Error('Invalid PDF format: Missing PDF header');
    }

    const options = {
      max: 2, // Return up to 2 pages
      version: 'v2.0.550'
    };

    const data = await pdf(buffer, options);
    
    if (!data) {
      throw new Error('PDF parsing returned no data');
    }

    const extractedText = data.text;
    
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text content extracted from PDF');
    }
    
    console.log(`✅ PDF parsed successfully. Extracted ${extractedText.length} characters`);
    console.log('📝 Sample of extracted text:', extractedText.substring(0, 200) + '...');
    
    return extractedText;
  } catch (error) {
    console.error('❌ PDF parsing failed:', error);
    if (error.message.includes('stream must have data')) {
      throw new Error('PDF file appears to be empty or corrupted');
    }
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
}

async function parseXlsx(buffer) {
  try {
    console.log('📊 Starting Excel parsing...');
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    
    if (!sheetName) {
      throw new Error('Excel file contains no sheets');
    }
    
    const worksheet = workbook.Sheets[sheetName];
    const json = xlsx.utils.sheet_to_json(worksheet);
    
    console.log(`✅ Excel parsed successfully. Found ${json.length} rows of data`);
    return JSON.stringify(json);
  } catch (error) {
    console.error('❌ Excel parsing failed:', error);
    throw new Error(`Failed to parse Excel file: ${error.message}`);
  }
}

function extractBasicESGData(text) {
  console.log('🔄 Using fallback ESG data extraction...');
  
  // Simple regex patterns to extract common ESG metrics
  const patterns = {
    carbonEmissions: /carbon[^0-9]*([0-9,]+\.?[0-9]*)[^a-zA-Z]*(?:tonnes?|tons?|t\s+co2|co2e)/gi,
    waterConsumption: /water[^0-9]*([0-9,]+\.?[0-9]*)[^a-zA-Z]*(?:cubic meters?|m3|liters?|litres?)/gi,
    energyUsage: /energy[^0-9]*([0-9,]+\.?[0-9]*)[^a-zA-Z]*(?:kwh|mwh|gwh)/gi,
    wasteGenerated: /waste[^0-9]*([0-9,]+\.?[0-9]*)[^a-zA-Z]*(?:tonnes?|tons?|kg)/gi,
    employeeTurnover: /turnover[^0-9]*([0-9,]+\.?[0-9]*)[^a-zA-Z]*%/gi,
    workplaceAccidents: /accidents?[^0-9]*([0-9,]+\.?[0-9]*)/gi,
    femaleRepresentation: /(?:female|women)[^0-9]*([0-9,]+\.?[0-9]*)[^a-zA-Z]*%/gi,
    boardIndependence: /(?:independent|board)[^0-9]*([0-9,]+\.?[0-9]*)[^a-zA-Z]*%/gi
  };
  
  const extractNumber = (text, pattern) => {
    const match = pattern.exec(text);
    if (match && match[1]) {
      return parseFloat(match[1].replace(/,/g, ''));
    }
    return null;
  };
  
  return {
    environmental: {
      carbon_emissions: { value: extractNumber(text, patterns.carbonEmissions), unit: "tonnes CO2e" },
      water_consumption: { value: extractNumber(text, patterns.waterConsumption), unit: "cubic meters" },
      energy_usage: { value: extractNumber(text, patterns.energyUsage), unit: "kWh" },
      waste_generated: { value: extractNumber(text, patterns.wasteGenerated), unit: "tonnes" }
    },
    social: {
      employee_turnover_rate: { value: extractNumber(text, patterns.employeeTurnover), unit: "%" },
      workplace_accidents: { value: extractNumber(text, patterns.workplaceAccidents), unit: "count" },
      diversity_and_inclusion: {
        female_representation: { value: extractNumber(text, patterns.femaleRepresentation), unit: "%" },
        minority_representation: { value: null, unit: "%" }
      }
    },
    governance: {
      board_independence: { value: extractNumber(text, patterns.boardIndependence), unit: "%" },
      executive_compensation_ratio: { value: null, unit: "ratio" }
    }
  };
}

async function extractDataWithGemini(text, useFallback = false) {
  console.log('🤖 Starting Gemini data extraction...');
  
  // Validate and truncate input text if needed
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid input: text must be a non-empty string');
  }

  const MAX_TEXT_LENGTH = 30000;
  if (text.length > MAX_TEXT_LENGTH) {
    console.warn(`⚠️ Text too long (${text.length} chars), truncating to ${MAX_TEXT_LENGTH} chars`);
    text = text.substring(0, MAX_TEXT_LENGTH);
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 2048,
      topP: 1,
      topK: 1
    }
  });
  
  const promptParts = [
    { 
      text: `You are an ESG data extraction expert. Extract numeric values from the text below into a JSON object with exactly this structure:

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

Rules:
1. Return ONLY the JSON object, no additional text
2. Keep all property names and units exactly as shown
3. Replace null with actual numbers when found in the text
4. Keep null for missing values
5. Ensure all values are numbers, not strings
6. Maintain the exact structure`
    },
    {
      text: `Text to analyze: ${text}`
    }
  ];

  const maxRetries = 5; // Increased from 3 to 5
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries}`);
      
      const result = await model.generateContent({ contents: [{ role: "user", parts: promptParts }] });
      if (!result || !result.response) {
        throw new Error('No response from Gemini API');
      }
      const response = await result.response;
      const responseText = response.text();
      
      console.log('📥 Received response from Gemini');
      console.log('Raw response:', responseText.substring(0, 200) + '...');
      
      // Clean the response to get a valid JSON string
      let jsonString = responseText;
      
      // Remove any markdown code blocks if present
      jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Extract just the JSON part
      const startBrace = jsonString.indexOf('{');
      const endBrace = jsonString.lastIndexOf('}');
      if (startBrace >= 0 && endBrace > startBrace) {
        jsonString = jsonString.slice(startBrace, endBrace + 1);
      }
      
      try {
        const parsedData = JSON.parse(jsonString.trim());
        console.log('✅ Successfully parsed JSON response');
        return parsedData;
      } catch (jsonError) {
        console.error('❌ JSON parsing failed:', jsonError);
        console.log('Invalid JSON string:', jsonString);
        throw new Error('Failed to parse Gemini response as JSON');
      }
    } catch (error) {
      lastError = error;
      console.error(`❌ Attempt ${attempt} failed:`, {
        message: error.message,
        status: error.status,
        stack: error.stack
      });
      
      // Check if this is a retryable error (503 Service Unavailable or rate limiting)
      if ((error.message.includes('503') || error.message.includes('overloaded') || error.message.includes('rate limit')) && attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`⏳ Retrying in ${waitTime/1000} seconds due to: ${error.message.substring(0, 100)}...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      if (attempt === maxRetries) {
        console.error('❌ All retry attempts failed');
      }
      
      throw error;
    }
  }
  
  // If all retries fail, try fallback extraction
  if (lastError.message.includes('overloaded') || lastError.message.includes('503')) {
    console.log('🔄 Gemini is overloaded, trying fallback extraction...');
    try {
      const fallbackData = extractBasicESGData(text);
      console.log('✅ Fallback extraction completed');
      return fallbackData;
    } catch (fallbackError) {
      console.error('❌ Fallback extraction also failed:', fallbackError);
      throw new Error('Both AI and fallback data extraction failed. Please try again later or check your document format.');
    }
  }
  
  throw lastError;
}

function validateExtractedData(data) {
  const requiredSections = ['environmental', 'social', 'governance'];
  const missing = requiredSections.filter(section => !data[section]);
  
  if (missing.length > 0) {
    console.warn(`⚠️ Missing sections in extracted data: ${missing.join(', ')}`);
  }
  
  return missing.length === 0;
}

module.exports = {
  parsePdf,
  parseXlsx,
  extractDataWithGemini,
  extractBasicESGData,
  checkGeminiStatus,
  validateExtractedData,
};
