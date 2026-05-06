const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGemini() {
  try {
    console.log("Testing Gemini API with Key:", process.env.GEMINI_API_KEY?.substring(0, 5) + "...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Test with a known valid model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say hello!");
    console.log("Gemini 1.5 Flash Response:", result.response.text());

    // Test with the current "gemini-3" placeholder
    try {
        const model3 = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const result3 = await model3.generateContent("Say hello!");
        console.log("Gemini 3 Flash Response:", result3.response.text());
    } catch (e) {
        console.log("Gemini 3 Flash Failed (as expected):", e.message);
    }

  } catch (error) {
    console.error("Gemini Test Failed:", error);
  }
}

testGemini();
