require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testAI() {
  try {
    console.log("API Key exists:", !!process.env.GEMINI_API_KEY);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" }); 
    
    console.log("Testing generation...");
    const result = await model.generateContent("Hello, are you working?");
    console.log("Response:", result.response.text());
  } catch (error) {
    console.error("AI Test Error:", error);
  }
}

testAI();
