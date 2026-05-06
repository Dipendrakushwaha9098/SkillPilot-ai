const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGemini3() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const result = await model.generateContent("Say hello!");
    console.log("Gemini 3 Response:", result.response.text());
  } catch (error) {
    console.error("Gemini 3 Test Failed:", error);
  }
}

testGemini3();
