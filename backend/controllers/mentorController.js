const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const User = require('../models/User');

exports.chat = async (req, res) => {
  try {
    const { message, history } = req.body;
    const user = await User.findById(req.user._id);
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: `You are an expert AI Tech Mentor on the SkillPilot platform.
      Your goal is to provide highly personalized, clear, and professional guidance.
      
      USER CONTEXT:
      - Goal: ${user.goals}
      - Level: ${user.skillLevel}
      - Roadmap: ${user.roadmap.title}
      - Completed Topics: ${user.progress.completedLessons.join(', ')}
      
      When answering, reference their progress if relevant (e.g., 'Since you've finished X, you'll find Y easier').
      If they ask what to do next, suggest the next uncompleted topic in their roadmap.
      Keep responses encouraging, concise, and technically deep.`
    });

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 800,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    res.json({ reply: response.text() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
