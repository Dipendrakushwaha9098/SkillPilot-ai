const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateRoadmap = async (req, res) => {
  console.log('--- START ROADMAP GENERATION ---');
  console.log('User ID:', req.user?._id);
  try {
    const { skillLevel, interests, goals, dailyStudyTime } = req.body;
    console.log('Payload:', { skillLevel, interests, goals, dailyStudyTime });
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

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
                "explanation": "Brief overview description",
                "notes": [
                  "Paragraph 1: Deep dive into the core concepts with clear explanations.",
                  "Paragraph 2: Detailed breakdown of the 'how-it-works' with practical logic.",
                  "Paragraph 3: Advanced insights, professional tips, and potential pitfalls.",
                  "Paragraph 4: Real-world use cases and architectural context.",
                  "Paragraph 5: Summary and best practices for mastery."
                ],
                "resources": ["Resource Name & Link 1", "Resource Name & Link 2"],
                "videoLinks": ["Video Tutorial Link 1"],
                "exercises": ["Detailed Practice Project/Exercise 1", "Detailed Practice Project/Exercise 2"]
              }
            ],
            "project": {
              "title": "Milestone Project Title",
              "description": "A comprehensive project description that integrates all month's concepts, suitable for ${skillLevel} level"
            }
          }
        ]
      }
      The 'notes' field is CRITICAL. Each paragraph must be clear, deep, and professional, providing the depth of a textbook section. Use Markdown formatting inside the strings for bold text, lists, and code blocks.
      Ensure the content is high quality, logically structured, and provides extreme clarity for self-study.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('AI Response Text:', text);
    
    // Extract JSON from the text response (Gemini sometimes adds markdown blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Failed to extract JSON from AI response');
      throw new Error('Failed to generate valid JSON roadmap');
    }
    
    let roadmap;
    try {
      roadmap = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      throw new Error('Failed to parse roadmap JSON');
    }
    console.log('Roadmap generated successfully:', roadmap.title);

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
    console.error('ROADMAP GENERATION ERROR:', error);
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
