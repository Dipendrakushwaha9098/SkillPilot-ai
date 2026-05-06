const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("../models/User");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateNotes = async (req, res) => {
  try {
    const { topic } = req.body;
    const user = await User.findById(req.user._id);

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      }
    });


    const prompt = `
You are an elite technical educator and expert software engineer. 
Your goal is to generate "Deep and Clear" study notes for the topic: "${topic}".

Context:
- Student Level: ${user?.skillLevel || "Beginner"}
- Student Goals: ${user?.goals || "Mastering modern technology"}

Structure the notes in a professional, immersive Markdown format. The content must be comprehensive, easy to understand, and visually organized.

Please include the following sections:

1. **Executive Summary**: A high-level overview of what ${topic} is and why it matters in 2-3 sentences.
2. **The "Why"**: Real-world problems this solves.
3. **Core Concepts (Deep Dive)**: 
   - Explain the fundamental principles.
   - Use analogies to simplify complex ideas.
   - Breakdown key components or sub-topics.
4. **Implementation & Code Examples**:
   - Provide a clear, well-commented code example (if applicable).
   - Explain the code step-by-step.
5. **Best Practices & Common Pitfalls**:
   - What should a professional do?
   - What are the common mistakes to avoid?
6. **Comparison / Alternatives**:
   - How does it compare to similar technologies or concepts?
7. **Interview Mastery**:
   - 3-5 high-level interview questions related to ${topic} with detailed, "impressive" answers.
8. **Summary Cheat Sheet**:
   - A quick-reference table or bullet list for fast revision.

Tone: Professional, encouraging, and technically deep yet accessible.
Formatting: Use H1, H2, H3, Bold, Italic, and Code Blocks (with language labels like \`\`\`javascript) to make it beautiful.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const notes = response.text();

    res.json({ notes });
  } catch (error) {
    console.error("NOTES GENERATION ERROR:", error);
    res.status(500).json({ message: "Failed to generate notes. Please try again." });
  }
};
