const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const User = require('../models/User');

exports.chat = async (req, res) => {
  try {
    const { message, history } = req.body;
    const user = await User.findById(req.user._id);
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3-flash-preview',
      systemInstruction: `You are the SkillPilot AI Mentor, an elite technical guide. 
      Your purpose is to help the student master their personalized learning roadmap.
      
      STUDENT CONTEXT:
      - Name: ${user.name}
      - Career Goals: ${user.goals}
      - Skill Level: ${user.skillLevel}
      - Current Roadmap: ${user.roadmap?.title || "Not generated yet"}
      - Progress: ${user.progress?.completedLessons?.length || 0} topics completed.
      
      GUIDELINES:
      1. Be technically precise but accessible.
      2. Use the student's name occasionally to make it personal.
      3. If they ask about their roadmap, give specific advice based on their "${user.roadmap?.title}" plan.
      4. Suggest the next logical step if they seem stuck.
      5. Use professional Markdown formatting (bolding, code blocks, lists).
      6. Encourage deep learning, not just surface-level understanding.`
    });


    const chat = model.startChat({
      history: (history || []).filter((m, i) => i > 0 || m.role === 'user'),
      generationConfig: {
        maxOutputTokens: 800,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    res.json({ reply: response.text() });
  } catch (error) {
    console.error("CHAT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
