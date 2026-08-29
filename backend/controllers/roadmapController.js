const { GoogleGenerativeAI } = require("@google/generative-ai");
const userStore = require("../utils/userStore");

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
              "https://www.geeksforgeeks.org/learn-web-development/",
              "https://www.geeksforgeeks.org/fundamentals-of-algorithms/"
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
      model: "gemini-3-flash-preview",
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 16384,
        responseMimeType: "application/json",
      }
    });

    const prompt = `
You are an Omni-Subject Academic & Technical Architect conditioned across all fields of human knowledge (STEM, Medicine, Business, Humanities, Law, Languages, Competitive Exams, and Technology). Your task is to generate a comprehensive, personalized 3-month learning roadmap for a student in ANY subject area.

STUDENT PROFILE:
- Student Category / Background: ${req.body.studentCategory || "Student / Learner"}
- Target Subject(s): ${interestsText}
- Skill Level: ${skillLevel}
- Learning / Career Goals: ${goals}
- Daily Study Commitment: ${dailyStudyTime} hours
${req.body.assessmentResults ? `- Diagnostic Assessment Results: ${JSON.stringify(req.body.assessmentResults)}` : ''}

INSTRUCTIONS:
1. Create a structured 3-month Learning Roadmap tailored to the exact discipline requested.
2. Structure the curriculum logically:
   - Month 1: Fundamentals, Core Principles & Foundation Concepts.
   - Month 2: Intermediate Applications, Practical Problem Solving, Formulas/Code/Calculations, & Deep Concepts.
   - Month 3: Advanced Mastery, Real-World Projects/Case Studies, Mock Exams, and Execution.
3. For each topic, provide deep, structured study notes (at least 5 bullet points).
4. Include 2 high-quality educational resource links per topic (Khan Academy, MIT OpenCourseWare, GeeksforGeeks, Coursera, YouTube, Britannica, etc.).
5. Include a hands-on Milestone Project, Case Study, or Practice Set for each month.
6. Provide 2 multiple-choice questions per topic for self-assessment.

RESPONSE FORMAT:
You MUST return ONLY a valid JSON object following this schema:
{
  "title": "A compelling Roadmap Title tailored to the subject",
  "description": "A high-level summary of the learning journey",
  "months": [
    {
      "month": 1,
      "topics": [
        {
          "title": "Topic Name",
          "explanation": "Brief overview",
          "notes": ["Detailed point 1", "Detailed point 2", "Detailed point 3", "Detailed point 4", "Detailed point 5"],
          "resources": ["URL 1", "URL 2"],
          "videoLinks": ["YouTube URL"],
          "exercises": ["Hands-on exercise / problem 1", "Hands-on task 2"],
          "quizzes": [
            {
              "question": "Question text",
              "options": ["Opt A", "Opt B", "Opt C", "Opt D"],
              "answer": "Exact correct option text"
            }
          ]
        }
      ],
      "project": {
        "title": "Month Milestone Title (Project / Case Study / Practice Exam)",
        "description": "Milestone description, deliverables, and goals"
      }
    }
  ]
}
`;

    console.log("Sending optimized prompt to Gemini...");

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log("AI Response Received.");

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

    const user = await userStore.findById(req.user._id);

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

    const user = await userStore.findById(req.user._id);

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

// ===== GENERATE ASSESSMENT QUESTIONS =====
exports.generateAssessmentQuestions = async (req, res) => {
  try {
    const { skillLevel, interests } = req.body;

    if (!skillLevel || !interests) {
      return res.status(400).json({ message: "Missing skillLevel or interests" });
    }

    const interestsText = Array.isArray(interests) ? interests.join(", ") : interests;

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
You are an expert educator, professor, and assessment specialist.
Generate 5 multiple choice questions to assess a student's knowledge in: ${interestsText}.
The questions should be appropriate for a ${skillLevel} level student.

Return ONLY JSON in this format:
[
  {
    "question": "Question text?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "answer": "Correct Option text exactly as written in options"
  }
]

Return ONLY JSON. No markdown.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, "").trim();
    const jsonMatch = cleaned.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      throw new Error("AI did not return valid JSON for assessment");
    }

    const questions = JSON.parse(jsonMatch[0]);
    res.json(questions);

  } catch (error) {
    console.error("ASSESSMENT GENERATION ERROR:", error);
    res.status(500).json({ message: "Failed to generate assessment questions" });
  }
};

// ===== GENERATE WEEKLY TEST =====
exports.generateWeeklyTest = async (req, res) => {
  try {
    const user = await userStore.findById(req.user._id);
    if (!user || !user.roadmap || !user.roadmap.months) {
      return res.status(400).json({ message: "No roadmap found for weekly test" });
    }

    // Calculate current week
    const diffMs = Date.now() - new Date(user.createdAt).getTime();
    const currentWeek = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;
    
    // Determine which month we are in (assuming 4 weeks per month)
    const monthIndex = Math.floor((currentWeek - 1) / 4);
    const monthData = user.roadmap.months[monthIndex] || user.roadmap.months[user.roadmap.months.length - 1];
    
    // Get topics for this month to provide context
    const topicsText = monthData.topics.map(t => t.title).join(", ");
    console.log(`WEEKLY TEST: Generating for Week ${currentWeek}, Topics: ${topicsText}`);

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
You are an expert AI mentor and academic evaluator.
Generate a "Weekly Assessment" for a student studying: ${topicsText}.
The student is currently in Week ${currentWeek} of their learning journey.

Generate 10 multiple choice questions that cover the concepts found in these topics.
Make sure the difficulty is appropriate for someone who has been studying for ${currentWeek} weeks.

Return ONLY JSON in this format:
{
  "week": ${currentWeek},
  "title": "Week ${currentWeek} Mastery Test",
  "questions": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Correct Option text exactly as written in options"
    }
  ]
}

Return ONLY JSON. No markdown.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("WEEKLY TEST: AI raw response received");
    const cleaned = text.replace(/```json|```/g, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error("WEEKLY TEST: No JSON match in AI response:", text);
      throw new Error("AI did not return valid JSON for weekly test");
    }

    const test = JSON.parse(jsonMatch[0]);
    console.log("WEEKLY TEST: Success");
    res.json(test);

  } catch (error) {
    console.error("WEEKLY TEST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===== GET PHASE =====
exports.getPhase = async (req, res) => {
  try {
    const user = await userStore.findById(req.user._id);
    if (!user || !user.roadmap || !user.roadmap.months) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    const { phaseId } = req.params;
    const monthNum = parseInt(phaseId, 10);
    const monthData = user.roadmap.months.find(m => m.month === monthNum) || user.roadmap.months[0];

    if (!monthData) {
      return res.status(404).json({ message: "Phase not found" });
    }

    res.json({
      id: String(monthData.month),
      title: `Month ${monthData.month} - ${user.roadmap.title || 'Learning Phase'}`,
      description: user.roadmap.description || 'Structured learning phase',
      topics: monthData.topics || []
    });
  } catch (error) {
    console.error("GET PHASE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===== GET TOPIC =====
exports.getTopic = async (req, res) => {
  try {
    const user = await userStore.findById(req.user._id);
    if (!user || !user.roadmap || !user.roadmap.months) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    const { topicId } = req.params;
    let foundTopic = null;

    for (const month of user.roadmap.months) {
      for (const topic of month.topics || []) {
        if (topic.title.toLowerCase() === topicId.toLowerCase() || encodeURIComponent(topic.title) === topicId) {
          foundTopic = topic;
          break;
        }
      }
      if (foundTopic) break;
    }

    if (!foundTopic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.json(foundTopic);
  } catch (error) {
    console.error("GET TOPIC ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};