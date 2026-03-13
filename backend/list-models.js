const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: 'c:/Users/lenovo/3D Objects/Web Development/projects/SkillPilot-ai/backend/.env' });

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // There isn't a direct listModels on genAI in the new SDK easily accessible like this.
    // But we can try common names.
    const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro', 'gemini-1.5-pro'];
    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        await model.generateContent('test');
        console.log(`Model ${m} is AVAILABLE`);
      } catch (e) {
        console.log(`Model ${m} is NOT available: ${e.message}`);
      }
    }
  } catch (error) {
    console.error('List Models Failed:', error);
  }
}

listModels();
