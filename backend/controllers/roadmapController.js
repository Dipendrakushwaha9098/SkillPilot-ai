const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("../models/User");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// ===== FALLBACK ROADMAP =====
const generateFallbackRoadmap = (skillLevel, interests) => {
  return {
    title: `${interests?.[0] || "Technology"} Learning Roadmap`,
    description: "A structured roadmap generated as a fallback when AI generation fails.",
    months: [
      {
        month: 1,
        topics: [
          {
            title: "Fundamentals",
            explanation: "Start by learning the core concepts of your chosen field.",
            notes: [
              "Understand the basic principles and terminology.",
              "Practice small coding examples or exercises.",
              "Build a strong conceptual foundation.",
              "Focus on problem solving and logical thinking.",
              "Review concepts regularly."
            ],
            resources: [
              "https://developer.mozilla.org",
              "https://freecodecamp.org"
            ],
            videoLinks: [
              "https://www.youtube.com/results?search_query=programming+basics"
            ],
            exercises: [
              "Create a simple beginner project",
              "Solve 10 basic coding problems"
            ]
          }
        ],
        project: {
          title: "Beginner Project",
          description: "Build a small project applying the fundamental concepts you learned."
        }
      }
    ]
  };
};


// ===== GENERATE ROADMAP =====
exports.generateRoadmap = async (req, res) => {
  console.log("------ START ROADMAP GENERATION ------");

  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { skillLevel, interests, goals, dailyStudyTime } = req.body;

    console.log("Request Body:", req.body);

    if (!skillLevel || !interests || !goals || !dailyStudyTime) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const interestsText = Array.isArray(interests)
      ? interests.join(", ")
      : interests;

    // ===== GEMINI MODEL =====
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const prompt = `
You are an expert tech mentor.

Create a personalized 3 month learning roadmap.

Student Profile:
Level: ${skillLevel}
Interests: ${interestsText}
Goals: ${goals}
Daily Study Time: ${dailyStudyTime} hours

Return ONLY JSON in this format:

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
          "Paragraph explaining the concept",
          "Deeper explanation",
          "Advanced insight",
          "Real world usage",
          "Best practices"
        ],
        "resources": ["Resource link"],
        "videoLinks": ["Video link"],
        "exercises": ["Exercise 1", "Exercise 2"]
      }
    ],
    "project": {
      "title": "Project Title",
      "description": "Project description"
    }
  }
]
}

Return ONLY JSON. No markdown.
`;

    console.log("Sending prompt to Gemini...");

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log("Raw AI Response:", text);

    // Clean markdown formatting
    const cleaned = text.replace(/```json|```/g, "").trim();

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("AI did not return valid JSON");
    }

    let roadmap;

    try {
      roadmap = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      throw new Error("Failed to parse roadmap JSON");
    }

    console.log("Roadmap generated:", roadmap.title);

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Save roadmap
    user.skillLevel = skillLevel;
    user.interests = interests;
    user.goals = goals;
    user.dailyStudyTime = dailyStudyTime;
    user.assessmentCompleted = true;
    user.roadmap = roadmap;

    await user.save();

    console.log("Roadmap saved to database");

    res.json(roadmap);

  } catch (error) {
    console.error("ROADMAP GENERATION ERROR:", error);

    // ===== FALLBACK SYSTEM =====
    console.log("Using fallback roadmap...");

    const fallbackRoadmap = generateFallbackRoadmap(
      req.body.skillLevel,
      req.body.interests
    );

    res.json(fallbackRoadmap);
  }
};


// ===== GET ROADMAP =====
exports.getRoadmap = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user.roadmap || {});
  } catch (error) {
    console.error("GET ROADMAP ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
