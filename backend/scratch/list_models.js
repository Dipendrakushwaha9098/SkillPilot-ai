const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // There isn't a direct listModels on genAI in the JS SDK usually, 
    // it's usually done via fetch to the endpoint.
    // But let's try a common model like 'gemini-pro'
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Say hello!");
    console.log("Gemini Pro Response:", result.response.text());
  } catch (error) {
    console.error("List Models / Pro Test Failed:", error);
  }
}

listModels();
