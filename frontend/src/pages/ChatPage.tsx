import { useState, useRef, useEffect, useCallback } from "react";
import { 
  Send, Bot, User, Loader2, ArrowLeft, Sparkles, RotateCcw, 
  Copy, Check, Lightbulb, Zap, Volume2, Trash2, Code2, 
  BookOpen, FileText, Award, HelpCircle, Layers, Flame
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { mentorService } from "@/services/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export type ChatMode = "concise" | "detailed" | "code" | "exam";

interface Message {
  role: "user" | "model";
  parts: [{ text: string }];
  suggestions?: string[];
  mode?: ChatMode;
}

const CATEGORIZED_PROMPTS = [
  {
    category: "Full Stack & Tech",
    icon: Code2,
    prompts: [
      "Explain async/await and promises in JS with clean examples",
      "How do I design a secure JWT + Refresh Token authentication system?",
      "Explain Database Indexing in PostgreSQL vs MongoDB",
      "What are the core principles of System Design for scalable web apps?"
    ]
  },
  {
    category: "Sciences & Math",
    icon: AtomIcon,
    prompts: [
      "Explain Multivariable Calculus & Line Integrals step-by-step",
      "Derive the fundamental principles of Quantum Entanglement",
      "Explain Organic Chemistry SN1 vs SN2 reaction mechanisms",
      "How does Cellular Respiration work in mitochondria?"
    ]
  },
  {
    category: "Business & Economics",
    icon: TrendingIcon,
    prompts: [
      "Explain Discounted Cash Flow (DCF) valuation with an example",
      "What is Price Elasticity of Demand in Microeconomics?",
      "How to build a financial model for a SaaS startup?",
      "Explain the differences between Equity and Debt Financing"
    ]
  },
  {
    category: "Aptitude & Reasoning",
    icon: HelpCircle,
    prompts: [
      "How to solve Time & Work problems quickly with LCM shortcut method?",
      "Explain Syllogisms and Venn diagram rules with trick examples",
      "What are the top shortcuts for Permutations, Combinations & Probability?",
      "How to solve Data Interpretation bar graphs & caselets faster in exams?"
    ]
  },
  {
    category: "Soft Skills & Career",
    icon: Lightbulb,
    prompts: [
      "How to use the STAR method to answer behavioral interview questions?",
      "Give me a step-by-step framework to master public speaking & reduce anxiety",
      "How to write a high-impact, ATS-friendly resume for job applications?",
      "What are effective techniques for salary negotiation & executive communication?"
    ]
  },
  {
    category: "Interview Prep & Mock",
    icon: Award,
    prompts: [
      "Conduct a mock technical interview for a Senior Full-Stack / React Developer role",
      "Ask me a behavioral HR interview question and evaluate my answer using the STAR method",
      "How to solve the Two Sum / 3Sum LeetCode problem with optimal time complexity?",
      "Walk me through a System Design interview for designing a URL Shortener or WhatsApp"
    ]
  },
  {
    category: "Exam & Strategy",
    icon: Award,
    prompts: [
      "Top strategies to solve complex JEE / SAT Math problems faster",
      "How to structure an answer for UPSC / Competitive Exams",
      "What are high-yield topics in GATE Computer Science?",
      "How to prepare for a Senior Full-Stack Technical Interview?"
    ]
  }
];

function AtomIcon(props: any) {
  return <Sparkles {...props} />;
}

function TrendingIcon(props: any) {
  return <Layers {...props} />;
}

const TypingIndicator = () => (
  <div style={{ display: "flex", gap: 5, padding: "6px 4px", alignItems: "center" }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        width: 7, height: 7, borderRadius: "50%",
        background: "#10b981",
        animation: `typingBounce 1.2s ease-in-out ${i * 0.18}s infinite`,
      }} />
    ))}
  </div>
);

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button 
      onClick={handleCopy} 
      className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-md"
      title="Copy message"
    >
      {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
    </button>
  );
};

const SpeechButton = ({ text }: { text: string }) => {
  const [speaking, setSpeaking] = useState(false);

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      toast.error("Text-to-speech is not supported in your browser.");
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/\[SUGGESTIONS\]:[\s\S]*/g, '').replace(/[\*\_#`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <button 
      onClick={toggleSpeech} 
      className={`p-1 transition-colors rounded-md ${speaking ? 'text-emerald-400 animate-pulse' : 'text-muted-foreground hover:text-foreground'}`}
      title={speaking ? "Stop reading" : "Read out loud"}
    >
      <Volume2 size={13} />
    </button>
  );
};

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "model", 
      parts: [{ text: "Hello! I am your **SkillPilot Omni-AI Mentor** 🧠\n\nI am conditioned across all fields of knowledge — Computer Science, Core Sciences, Mathematics, Business, Humanities, and Competitive Exams.\n\nSelect a response mode above or ask any question to get started!" }],
      suggestions: [
        "Explain async/await in JS",
        "How to prepare for System Design interviews?",
        "Explain Multivariable Calculus simply"
      ]
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<ChatMode>("concise");
  const [selectedPromptCategory, setSelectedPromptCategory] = useState(0);
  const [rows, setRows] = useState(1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const topic = searchParams.get("topic");
    if (topic && messages.length === 1) {
      setInput(`Explain **${topic}** with key principles and practical examples.`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const parseReplyAndSuggestions = (rawReply: string): { cleanText: string; suggestions?: string[] } => {
    const suggestionMatch = rawReply.match(/\[SUGGESTIONS\]:\s*(\[[\s\S]*\])/);
    let suggestions: string[] | undefined = undefined;
    let cleanText = rawReply;

    if (suggestionMatch) {
      try {
        suggestions = JSON.parse(suggestionMatch[1]);
        cleanText = rawReply.replace(/\[SUGGESTIONS\]:[\s\S]*/, '').trim();
      } catch (err) {
        console.warn("[ChatPage] Failed to parse follow-up suggestions JSON:", err);
      }
    }

    return { cleanText, suggestions };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const lineCount = e.target.value.split("\n").length;
    setRows(Math.min(lineCount, 5));
  };

  const [learnedMemory, setLearnedMemory] = useState<any>(null);
  const [showMemoryModal, setShowMemoryModal] = useState(false);

  const send = useCallback(async (overrideText?: string, overrideMode?: ChatMode) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    const currentMode = overrideMode || mode;

    const userMsg: Message = { role: "user", parts: [{ text }] };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setRows(1);
    setLoading(true);

    try {
      const historyPayload = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.parts[0].text }]
      }));

      const res = await mentorService.chat({ 
        message: text, 
        history: historyPayload, 
        conciseMode: currentMode === 'concise',
        mode: currentMode
      });

      if (res.learnedProfile && Object.keys(res.learnedProfile).length > 0) {
        setLearnedMemory(res.learnedProfile);
      }

      const { cleanText, suggestions } = parseReplyAndSuggestions(res.reply);

      const botMsg: Message = { 
        role: "model", 
        parts: [{ text: cleanText }],
        suggestions: suggestions,
        mode: currentMode
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error: unknown) {
      let message = "Failed to get AI response";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, loading, messages, mode]);

  const retry = () => {
    const lastUser = [...messages].reverse().find(m => m.role === "user");
    if (lastUser) {
      setMessages(prev => prev.slice(0, -1));
      send(lastUser.parts[0].text);
    }
  };

  const clearChat = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setMessages([
      { 
        role: "model", 
        parts: [{ text: "Chat history cleared! Ask me anything about any subject." }],
        suggestions: [
          "Explain async/await in JS",
          "How to prepare for System Design interviews?",
          "Explain Quantum Physics foundations"
        ]
      }
    ]);
    toast.success("Chat reset successfully.");
  };

  const MODES: { id: ChatMode; label: string; icon: any; color: string; desc: string }[] = [
    { id: 'concise', label: 'Concise Mode', icon: Zap, color: '#34D399', desc: 'Short, crisp, direct 2-3 sentence answers.' },
    { id: 'detailed', label: 'Deep Dive', icon: BookOpen, color: '#818CF8', desc: 'In-depth explanation with step-by-step reasoning.' },
    { id: 'code', label: 'Code & Debug', icon: Code2, color: '#F472B6', desc: 'Full-stack code reviews & line-by-line debugging.' },
    { id: 'exam', label: 'Exam & Prep', icon: Award, color: '#FBBF24', desc: 'High-yield exam concepts & practice problems.' },
  ];

  return (
    <>
      <style>{`
        @keyframes typingBounce {
          0%, 100% { transform: translateY(0); opacity: .4; }
          50%       { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .chat-root {
          display: flex;
          flex-direction: column;
          height: 100dvh;
          background: #090d1a;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
          position: relative;
        }

        .chat-bg-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(16, 185, 129, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.04) 1px, transparent 1px);
          z-index: 0;
        }

        .chat-header {
          position: sticky; top: 0; z-index: 20;
          display: flex; align-items: center; gap: 12px;
          padding: 12px 20px;
          background: hsl(var(--card) / 0.85);
          border-bottom: 1px solid hsl(var(--border));
          backdrop-filter: blur(20px);
        }

        .messages-area {
          flex: 1; overflow-y: auto; position: relative; z-index: 1;
          padding: 20px 16px 8px;
          scroll-behavior: smooth;
        }
        .messages-area::-webkit-scrollbar { width: 4px; }
        .messages-area::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 4px; }
        .messages-inner { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }

        .bubble-row { display: flex; gap: 10px; animation: fadeUp .3s ease; }
        .bubble-row.user { flex-direction: row-reverse; }

        .avatar-sm {
          width: 34px; height: 34px; border-radius: 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          align-self: flex-start;
        }
        .avatar-sm.bot { background: linear-gradient(135deg, #10b981, #0d9488); box-shadow: 0 0 15px rgba(16,185,129,0.2); }
        .avatar-sm.user { background: linear-gradient(135deg, #3b82f6, #6366f1); }

        .bubble {
          max-width: min(85%, 650px);
          padding: 14px 18px;
          border-radius: 20px;
          font-size: .92rem;
          line-height: 1.65;
          position: relative;
        }
        .bubble.bot {
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          color: hsl(var(--foreground));
          border-top-left-radius: 4px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        .bubble.user {
          background: linear-gradient(135deg, #10b981, #059669);
          border: 1px solid rgba(16,185,129,.4);
          color: white;
          border-top-right-radius: 4px;
        }

        .prose-content p { margin: 0 0 .6em; }
        .prose-content p:last-child { margin-bottom: 0; }
        .prose-content pre {
          background: #06060c; border: 1px solid hsl(var(--border));
          border-radius: 12px; padding: 14px; overflow-x: auto; margin: .8em 0;
          font-size: .84rem; line-height: 1.5; color: #f8fafc;
        }
        .prose-content code {
          background: rgba(16,185,129,0.15); border-radius: 4px;
          padding: .15em .4em; font-size: .84em; color: #34d399;
        }
        .prose-content pre code { background: none; padding: 0; color: inherit; }
        .prose-content strong { color: inherit; font-weight: 700; }
        .prose-content ul, .prose-content ol { padding-left: 1.3em; margin: .5em 0; }
        .prose-content li { margin-bottom: .25em; }

        .typing-bubble {
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 18px; border-top-left-radius: 4px;
          padding: 12px 18px; display: inline-flex; align-items: center;
        }

        .input-bar {
          position: sticky; bottom: 0; z-index: 20;
          padding: 12px 16px 16px;
          background: hsl(var(--background) / 0.9);
          border-top: 1px solid hsl(var(--border));
          backdrop-filter: blur(20px);
        }
        .input-wrap {
          max-width: 800px; margin: 0 auto;
          display: flex; align-items: flex-end; gap: 10px;
        }
        .textarea-shell {
          flex: 1; position: relative;
          background: hsl(var(--card));
          border: 1.5px solid hsl(var(--border));
          border-radius: 18px; overflow: hidden;
          transition: border-color .25s;
        }
        .textarea-shell:focus-within { border-color: #10b981; }
        .chat-textarea {
          width: 100%; padding: 14px 18px;
          background: none; border: none; outline: none; resize: none;
          color: hsl(var(--foreground)); font-size: .92rem; line-height: 1.5;
          max-height: 140px; overflow-y: auto;
        }
      `}</style>

      <div className="chat-root">
        <div className="chat-bg-grid" />
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="animate-orb-1 absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[140px]" />
          <div className="animate-orb-2 absolute bottom-[20%] right-[10%] w-[450px] h-[450px] rounded-full bg-indigo-500/10 blur-[140px]" />
        </div>

        {/* Header */}
        <div className="chat-header">
          <button 
            className="w-9 h-9 rounded-xl border border-border bg-muted/50 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors shrink-0" 
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={16} />
          </button>

          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <Bot size={20} className="text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-extrabold text-white text-base leading-none font-display">
              SkillPilot Omni-AI Mentor
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-[11px] text-muted-foreground font-medium">Self-Improving AI Engine</span>
            </div>
          </div>

          {/* Self-Improving Memory Insights Button */}
          <button
            onClick={() => setShowMemoryModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-all shrink-0"
            title="View AI Learned Memory Insights"
          >
            <Sparkles size={13} className="animate-spin-slow" />
            <span>AI Memory</span>
          </button>

          {/* Mode Selector Dropdown */}
          <div className="hidden md:flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border">
            {MODES.map((m) => {
              const Icon = m.icon;
              const active = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  title={m.desc}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    active 
                      ? 'bg-card text-foreground shadow-sm border border-border' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon size={13} style={{ color: active ? m.color : 'inherit' }} />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              title="Clear chat history"
              className="w-9 h-9 rounded-xl border border-border bg-card/60 text-muted-foreground hover:text-red-400 flex items-center justify-center transition-colors"
            >
              <Trash2 size={15} />
            </button>
            <button
              onClick={retry}
              disabled={loading || messages.length < 2}
              title="Retry last response"
              className="w-9 h-9 rounded-xl border border-border bg-card/60 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors disabled:opacity-30"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* Mobile Mode Switcher */}
        <div className="md:hidden flex overflow-x-auto gap-1 p-2 bg-card/50 border-b border-border scrollbar-none">
          {MODES.map((m) => {
            const Icon = m.icon;
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                  active 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-card text-muted-foreground border-border'
                }`}
              >
                <Icon size={12} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Messages */}
        <div className="messages-area">
          <div className="messages-inner">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .25 }}
                className={`bubble-row ${msg.role === "user" ? "user" : ""}`}
              >
                <div className={`avatar-sm ${msg.role === "model" ? "bot" : "user"}`}>
                  {msg.role === "model"
                    ? <Bot size={16} className="text-white" />
                    : <User size={16} className="text-white" />}
                </div>

                <div className="max-w-full">
                  <div className={`bubble ${msg.role === "model" ? "bot" : "user"}`}>
                    <div className="prose-content">
                      <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                    </div>
                  </div>

                  {/* Actions & Speech */}
                  <div className={`flex items-center gap-2 mt-1.5 px-1 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <CopyButton text={msg.parts[0].text} />
                    {msg.role === "model" && <SpeechButton text={msg.parts[0].text} />}
                    <span className="text-[10px] text-muted-foreground/50">
                      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  {/* Smart Follow-up Suggestion Chips */}
                  {msg.role === "model" && msg.suggestions && msg.suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex flex-col gap-1.5"
                    >
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400/80 flex items-center gap-1">
                        <Sparkles size={11} /> Suggested Follow-ups:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => send(sug)}
                            className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/60 px-3 py-1.5 rounded-xl transition-all text-left font-medium"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="bubble-row"
                >
                  <div className="avatar-sm bot">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="typing-bubble">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Categorized Quick Prompts */}
            {messages.length === 1 && !input && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-3xl bg-card border border-border shadow-xl"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb size={16} className="text-amber-400" />
                  <span className="text-sm font-bold text-foreground">Explore Questions across Disciplines:</span>
                </div>

                {/* Categories Tabs */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
                  {CATEGORIZED_PROMPTS.map((cat, idx) => {
                    const Icon = cat.icon;
                    const active = selectedPromptCategory === idx;
                    return (
                      <button
                        key={cat.category}
                        onClick={() => setSelectedPromptCategory(idx)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                          active
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                            : 'bg-background border-border text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Icon size={13} />
                        <span>{cat.category}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Prompt List */}
                <div className="grid gap-2">
                  {CATEGORIZED_PROMPTS[selectedPromptCategory].prompts.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => send(p)}
                      className="p-3 text-left rounded-2xl bg-background border border-border text-xs font-medium text-foreground hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all flex items-center justify-between group"
                    >
                      <span>{p}</span>
                      <Sparkles size={13} className="text-muted-foreground group-hover:text-emerald-400 transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className="input-bar">
          <div className="input-wrap">
            <div className="textarea-shell">
              <textarea
                ref={inputRef}
                className="chat-textarea"
                value={input}
                rows={rows}
                onChange={handleInputChange}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Ask your AI mentor anything... (Shift+Enter for new line)"
                disabled={loading}
              />
            </div>
            <button
              className="w-12 h-12 rounded-2xl border-none bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-white font-bold transition-all flex items-center justify-center shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              onClick={() => send()}
              disabled={loading || !input.trim()}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
          <div className="text-center mt-2">
            <span className="text-[11px] text-muted-foreground/60">
              SkillPilot Self-Improving AI Engine · Mode: <strong className="text-emerald-400 capitalize">{mode}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Memory Insights Modal */}
      <AnimatePresence>
        {showMemoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-foreground text-base">Continuous AI Memory</h3>
                    <p className="text-[11px] text-muted-foreground">Real-time learned preferences from your chat</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMemoryModal(false)}
                  className="w-8 h-8 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground flex items-center justify-center text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px] block mb-1">Preferred Style:</span>
                  <div className="p-3 rounded-xl bg-background border border-border text-foreground font-medium">
                    {learnedMemory?.preferredStyle || "Adapting to your conversation style in real-time..."}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px] block mb-1">Reinforced Weak Topics:</span>
                  {learnedMemory?.weakTopics && learnedMemory.weakTopics.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {learnedMemory.weakTopics.map((wt: string, idx: number) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-semibold">
                          {wt}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic text-[11px]">No weak topics flagged yet.</p>
                  )}
                </div>

                <div>
                  <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px] block mb-1">Learned User Facts:</span>
                  {learnedMemory?.customNotes && learnedMemory.customNotes.length > 0 ? (
                    <div className="space-y-1">
                      {learnedMemory.customNotes.map((note: string, idx: number) => (
                        <div key={idx} className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium">
                          • {note}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic text-[11px]">Chatting continuously builds your personalized memory profile.</p>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-border flex justify-end">
                <button
                  onClick={() => setShowMemoryModal(false)}
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatPage;