const { GoogleGenerativeAI } = require("@google/generative-ai");
const userStore = require("../utils/userStore");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateFallbackNotes = (topic) => {
  return `# ${topic} — Comprehensive Study Notes

## Executive Summary
**${topic}** is a fundamental concept essential for academic excellence, practical understanding, and concept mastery. Mastering its core principles equips learners with analytical clarity, problem-solving skills, and deep insight across this discipline.

---

## Real-World & Academic Importance ("The Why")
- **Conceptual Depth**: Establishes a strong foundation for advanced topics and real-world application.
- **Problem Solving**: Enhances analytical reasoning, critical thinking, and structured analysis.
- **Exam & Practical Relevance**: Frequently tested in academic evaluations, board exams, and competitive assessments.

---

## Core Concepts & Key Principles
1. **Fundamental Mechanics**: Understand the underlying principles, definitions, and relationships governing ${topic}.
2. **Systematic Application**: Apply standard step-by-step methodologies to solve problems, solve equations, or analyze case studies.
3. **Synthesis & Mastery**: Connect ${topic} to broader discipline themes and practical scenarios.

---

## Best Practices & Common Misconceptions
- ✅ **DO**: Master core definitions, formulas, or standard procedures before tackling complex questions.
- ✅ **DO**: Review worked examples and practice regularly under timed conditions.
- ❌ **DON'T**: Skip fundamental concepts or memorize without conceptual understanding.
- ❌ **DON'T**: Ignore edge cases, common exam traps, or unit conversions/syntax rules.

---

## High-Yield Revision & Assessment Questions
### Q1: What is the core principle of ${topic}?
> **Answer**: ${topic} provides the foundational framework for analyzing key phenomena and solving problems in this discipline. Focus on mastering its underlying mechanisms.

### Q2: How do you apply ${topic} to solve problems effectively?
> **Answer**: Break down the problem statement, identify key variables or requirements, apply relevant formulas/methods step-by-step, and verify your output.
`;
};

exports.generateNotes = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    let user;
    try {
      user = await userStore.findById(req.user._id);
    } catch (dbErr) {
      console.warn("[Notes Controller DB Warning]:", dbErr.message);
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 4096,
      }
    });

    const prompt = `
You are a World-Class Academic Educator, Senior Scientist, and Principal Engineer. 
Your goal is to generate "Deep, Comprehensive, and Crystal-Clear" study notes for the subject / topic: "${topic}".

Context:
- Learner Level: ${user?.skillLevel || "Beginner"}
- Learner Goals: ${user?.goals || "Subject Mastery & Exam Preparation"}

INSTRUCTIONS:
1. Detect the discipline of "${topic}" (e.g. Mathematics, Physics, Chemistry, Biology, Computer Science, Business & Finance, History, Literature, Philosophy, Languages, or Competitive Exam Prep).
2. Adapt the formatting & content structure to match the subject domain:
   - **For Science & Mathematics**: Include fundamental laws, formulas, KaTeX math derivations, worked step-by-step example problems, and key equations.
   - **For Computer Science & IT**: Include architecture, execution flow, clean production code blocks (with language labels), and design patterns.
   - **For Business & Economics**: Include strategic frameworks, economic formulas, real-world case studies, and market metrics.
   - **For Humanities & History**: Include historical context, key timelines, analytical perspectives, and major themes.
   - **For Languages & Communication**: Include grammar rules, vocabulary tables, usage examples, and common pitfalls.
3. Use rich, beautiful Markdown formatting with clear H1, H2, H3 headings, bold callouts, tables, and blockquotes.

STRUCTURE TO INCLUDE:
1. **Executive Summary**: High-level overview of what ${topic} is, its core significance, and real-world relevance (2-3 sentences).
2. **The "Why" & Real-World Impact**: Why this subject matters in academics, industry, or practical application.
3. **Core Concepts (Deep Dive)**: 
   - Fundamental principles and key mechanics.
   - Intelligently simplify complex ideas with clear analogies.
   - Sub-topic breakdown and key formulas/components/timelines.
4. **Practical Worked Example / Implementation**:
   - Step-by-step example problem solution, code block, financial calculation, or analytical breakdown.
5. **Best Practices & Common Misconceptions / Pitfalls**:
   - Key principles to follow vs common exam/practical mistakes to avoid.
6. **High-Yield Exam & Mastery Questions**:
   - 3-5 high-yield assessment questions related to ${topic} with detailed, impressive solutions.
7. **Summary Revision Cheat Sheet**:
   - A quick-reference table or bullet list for fast revision.

Tone: Authoritative, scholarly, encouraging, crystal-clear, and comprehensive.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const notes = response.text();

    res.json({ notes });
  } catch (error) {
    console.error("NOTES GENERATION ERROR:", error);
    const fallbackNotes = generateFallbackNotes(req.body.topic || "Software Technology");
    res.json({ notes: fallbackNotes });
  }
};
