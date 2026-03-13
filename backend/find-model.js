const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: 'c:/Users/lenovo/3D Objects/Web Development/projects/SkillPilot-ai/backend/.env' });

async function findModel() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) {
      console.error('API Error:', data.error.message);
      return;
    }
    const extractName = (name) => name.replace('models/', '');
    const genModels = data.models
      .filter(m => m.supportedGenerationMethods.includes('generateContent'))
      .map(m => extractName(m.name));
    
    console.log('Available Generation Models:', genModels);
    
    // Check if what we want is there
    if (genModels.includes('gemini-1.5-flash')) {
      console.log('gemini-1.5-flash IS available');
    } else {
      console.log('gemini-1.5-flash NOT in list');
    }
  } catch (e) {
    console.error('Failed:', e);
  }
}

findModel();
