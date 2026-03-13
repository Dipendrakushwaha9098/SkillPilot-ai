const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: 'c:/Users/lenovo/3D Objects/Web Development/projects/SkillPilot-ai/backend/.env' });

async function testAI() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Say hello');
    const response = await result.response;
    console.log('AI Response:', response.text());
  } catch (error) {
    console.error('AI Test Failed:', error);
  }
}

testAI();
