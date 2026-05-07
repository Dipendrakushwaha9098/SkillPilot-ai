const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
    const result = await model.generateContent("Hello");
    console.log("Success:", result.response.text());
  } catch (e) {
    console.log("Error with gemini-3-flash-preview:", e.message);
    try {
        const model2 = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result2 = await model2.generateContent("Hello");
        console.log("Success with gemini-1.5-flash:", result2.response.text());
    } catch (e2) {
        console.log("Error with gemini-1.5-flash:", e2.message);
    }
  }
}

test();
