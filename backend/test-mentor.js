const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testMentor() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-flash-latest',
            systemInstruction: `You are an expert AI Tech Mentor.`
        });
        
        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 800,
            },
        });
        
        const result = await chat.sendMessage("hello");
        const response = await result.response;
        console.log("Reply:", response.text());
    } catch(e) {
        console.error("Mentor Test Error:", e);
    }
}

testMentor();
