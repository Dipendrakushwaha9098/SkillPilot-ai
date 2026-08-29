const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const userStore = require('../utils/userStore');
const { getOmniMentorSystemInstruction } = require('../utils/aiDomainPrompts');

async function extractAndSaveUserMemory(user, userMessage) {
  try {
    if (!userMessage || userMessage.length < 5) return;
    
    const lower = userMessage.toLowerCase();
    const indicatesPreferenceOrDifficulty = 
      lower.includes("prefer") || lower.includes("don't like") || lower.includes("like") ||
      lower.includes("hard") || lower.includes("difficult") || lower.includes("struggle") ||
      lower.includes("weak") || lower.includes("confused") || lower.includes("python") ||
      lower.includes("java") || lower.includes("short") || lower.includes("visual") ||
      lower.includes("example") || lower.includes("explain in") || lower.includes("code") ||
      lower.includes("no math") || lower.includes("math");

    if (!indicatesPreferenceOrDifficulty) return;

    const memoryModel = genAI.getGenerativeModel({
      model: 'gemini-3-flash-preview',
      generationConfig: { responseMimeType: "application/json" }
    });

    const extractionPrompt = `
Analyze this student's chat message and extract any new learning preferences, topics they struggle with, or explicit teaching instructions.

STUDENT MESSAGE: "${userMessage}"

EXISTING LEARNED PROFILE:
${JSON.stringify(user.learnedProfile || {})}

Return JSON with this schema:
{
  "hasNewInsights": true,
  "preferredStyle": "string describing preference (e.g. prefers Python, likes visual code) or empty",
  "newWeakTopic": "single topic name or empty",
  "newCustomNote": "short learned fact or empty"
}
`;

    const result = await memoryModel.generateContent(extractionPrompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);

    if (parsed && parsed.hasNewInsights) {
      if (!user.learnedProfile) {
        user.learnedProfile = { weakTopics: [], masteredTopics: [], customNotes: [] };
      }

      if (parsed.preferredStyle && parsed.preferredStyle.trim()) {
        user.learnedProfile.preferredStyle = parsed.preferredStyle.trim();
      }
      if (parsed.newWeakTopic && parsed.newWeakTopic.trim() && !user.learnedProfile.weakTopics.includes(parsed.newWeakTopic.trim())) {
        user.learnedProfile.weakTopics.push(parsed.newWeakTopic.trim());
      }
      if (parsed.newCustomNote && parsed.newCustomNote.trim() && !user.learnedProfile.customNotes.includes(parsed.newCustomNote.trim())) {
        user.learnedProfile.customNotes.push(parsed.newCustomNote.trim());
      }
      user.learnedProfile.lastUpdated = new Date();
      await user.save();
      console.log(`[Self-Improving Memory] Updated learned profile for ${user.name}:`, user.learnedProfile);
    }
  } catch (err) {
    console.warn("[Self-Improving Memory Extractor Warning]:", err.message);
  }
}

exports.chat = async (req, res) => {
  try {
    const { message, history, conciseMode, mode = 'concise' } = req.body;
    const user = await userStore.findById(req.user._id);

    let selectedMode = mode;
    if (conciseMode !== undefined && conciseMode === false && mode === 'concise') {
      selectedMode = 'detailed';
    }

    let modeInstruction = '';
    if (selectedMode === 'concise') {
      modeInstruction = `ANSWER MODE: CONCISE & DIRECT
      - Keep responses short, clear, and punchy (2-4 sentences or 3 quick bullet points maximum).
      - Directly answer the query without fluff or unnecessary filler.`;
    } else if (selectedMode === 'detailed') {
      modeInstruction = `ANSWER MODE: DETAILED & COMPREHENSIVE
      - Provide a thorough, well-structured explanation with clear reasoning, step-by-step guidance, formulas/code, and examples.`;
    } else if (selectedMode === 'code') {
      modeInstruction = `ANSWER MODE: CODE REVIEW & DEBUGGING
      - Focus heavily on code syntax, stack trace analysis, line-by-line breakdown, security, and performance optimization. Provide clean, well-commented code blocks.`;
    } else if (selectedMode === 'exam') {
      modeInstruction = `ANSWER MODE: EXAM & PRACTICE PREP
      - Focus on high-yield test concepts, problem-solving tricks, key formulas, and exam-style practice questions with detailed solutions.`;
    }

    const followUpInstruction = `
    SMART FOLLOW-UP SUGGESTIONS INSTRUCTION:
    At the very end of your response, output 3 logical follow-up questions on a single new line in this exact format:
    [SUGGESTIONS]: ["Follow-up question 1?", "Follow-up question 2?", "Follow-up question 3?"]
    `;

    const baseInstruction = getOmniMentorSystemInstruction(user);

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3-flash-preview',
      systemInstruction: `${baseInstruction}\n\n${modeInstruction}\n\n${followUpInstruction}`
    });

    const chat = model.startChat({
      history: (history || []).filter((m, i) => i > 0 || m.role === 'user'),
      generationConfig: {
        maxOutputTokens: (selectedMode === 'concise') ? 450 : 1400,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;

    // Trigger background memory learning (non-blocking)
    extractAndSaveUserMemory(user, message);

    res.json({ 
      reply: response.text(),
      learnedProfile: user.learnedProfile || {} 
    });
  } catch (error) {
    console.error("CHAT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
