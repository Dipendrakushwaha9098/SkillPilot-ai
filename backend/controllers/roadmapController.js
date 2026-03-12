const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateRoadmap = async (req, res) => {
  try {
    const { skillLevel, interests, goals, dailyStudyTime } = req.body;
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert tech mentor. Create a highly personalized 3-month learning roadmap for a student.
      Level: ${skillLevel}
      Interests: ${interests.join(', ')}
      Goals: ${goals}
      Daily Study Time: ${dailyStudyTime} hours

      Return the roadmap as a structured JSON object with the following format:
      {
        "title": "Roadmap Title",
        "description": "General overview",
        "months": [
          {
            "month": 1,
            "topics": [
              {
                "title": "Topic Name",
                "explanation": "Brief explanation",
                "resources": ["Resource Link 1", "Resource Link 2"],
                "videoLinks": ["Video Link 1"],
                "exercises": ["Exercise 1"]
              }
            ],
            "project": {
              "title": "Project Title",
              "description": "Project description suitable for ${skillLevel} level"
            }
          }
        ]
      }
      Ensure the content is high quality and professional.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the text response (Gemini sometimes adds markdown blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to generate valid JSON roadmap');
    
    const roadmap = JSON.parse(jsonMatch[0]);

    // Save to user
    const user = await User.findById(req.user._id);
    user.skillLevel = skillLevel;
    user.interests = interests;
    user.goals = goals;
    user.dailyStudyTime = dailyStudyTime;
    user.assessmentCompleted = true;
    user.roadmap = roadmap;
    await user.save();

    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRoadmap = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
