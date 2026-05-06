const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testRoadmap() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const skillLevel = "Beginner";
    const interestsText = "Web Development, React";
    const goals = "Become a full stack developer";
    const dailyStudyTime = 2;

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

    try {
        console.log("Sending prompt to Gemini...");
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log("Raw Response:");
        console.log(text);
        
        const cleaned = text.replace(/```json|```/g, "").trim();
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
            console.error("No JSON match");
            return;
        }
        
        const parsed = JSON.parse(jsonMatch[0]);
        console.log("Parsed JSON Title:", parsed.title);
    } catch (e) {
        console.error("Error:", e);
    }
}

testRoadmap();
