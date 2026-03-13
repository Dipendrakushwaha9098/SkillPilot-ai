const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: 'c:/Users/lenovo/3D Objects/Web Development/projects/SkillPilot-ai/backend/.env' });

async function listAllModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // In SDK 0.24.1, listing models isn't directly on the genAI instance sometimes.
    // It's part of the GenerativeAI client or available via fetch.
    // Let's try to fetch them directly from the API endpoints.
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log('Available Models:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('List All Models Failed:', error);
  }
}

listAllModels();
