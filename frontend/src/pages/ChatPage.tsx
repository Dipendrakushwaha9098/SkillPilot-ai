import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, Loader2, ArrowLeft, Sparkles, RotateCcw, Copy, Check, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { mentorService } from "@/services/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
 
interface Message {
  role: "user" | "model";
  parts: [{ text: string }];
}
 
const QUICK_PROMPTS = [
  "Explain async/await with examples",
  "Best resources for system design",
  "How do I improve my problem-solving?",
  "Career tips for junior devs",
];
 
const TypingIndicator = () => (
  <div style={{ display: "flex", gap: 5, padding: "4px 2px", alignItems: "center" }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        width: 7, height: 7, borderRadius: "50%",
        background: "rgba(139,92,246,.7)",
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
    <button onClick={handleCopy} style={{
      background: "none", border: "none", cursor: "pointer",
      color: "rgba(255,255,255,.25)", padding: "2px 4px", borderRadius: 6,
      transition: "color .2s", display: "flex", alignItems: "center",
    }}
    onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,.6)")}
    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.25)")}
    title="Copy message"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
};
 
const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", parts: [{ text: "Hi! I'm your **SkillPilot AI Mentor** 🧠\n\nAsk me anything about coding, learning strategies, or career advice. I'm here to help you grow." }] },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
 
  useEffect(() => {
    const topic = searchParams.get("topic");
    if (topic && messages.length === 1) {
      setInput(`I'm studying **${topic}** and I'd like to dive deeper into it. Can you explain the core concepts and maybe give me a practical example?`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);
 
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const lineCount = e.target.value.split("\n").length;
    setRows(Math.min(lineCount, 5));
  };
 
  const send = useCallback(async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;
 
    const userMsg: Message = { role: "user", parts: [{ text }] };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setRows(1);
    setLoading(true);
 
    try {
      const res = await mentorService.chat({ message: text, history: messages });
      const botMsg: Message = { role: "model", parts: [{ text: res.reply }] };
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
  }, [input, loading, messages]);
 
  const retry = () => {
    const lastUser = [...messages].reverse().find(m => m.role === "user");
    if (lastUser) {
      setMessages(prev => prev.slice(0, -1));
      send(lastUser.parts[0].text);
    }
  };
 
  const showQuickPrompts = messages.length === 1 && !input;
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Inter:wght@400;500;600&display=swap');
 
        @keyframes typingBounce {
          0%, 100% { transform: translateY(0); opacity: .4; }
          50%       { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
 
        .chat-root {
          display: flex;
          flex-direction: column;
          height: 100dvh;
          background: #0b0b14;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
          position: relative;
        }
        .chat-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 55% 45% at 15% 10%, rgba(109,40,217,.14) 0%, transparent 65%),
            radial-gradient(ellipse 40% 35% at 85% 90%, rgba(14,165,233,.09) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }
 
        /* ── Header ── */
        .chat-header {
          position: sticky; top: 0; z-index: 20;
          display: flex; align-items: center; gap: 12px;
          padding: 14px 20px;
          background: rgba(11,11,20,.8);
          border-bottom: 1px solid rgba(255,255,255,.06);
          backdrop-filter: blur(20px);
        }
        .back-btn {
          width: 36px; height: 36px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,.08);
          background: rgba(255,255,255,.04);
          color: rgba(255,255,255,.5); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all .2s; flex-shrink: 0;
        }
        .back-btn:hover { border-color: rgba(255,255,255,.2); color: white; }
        .avatar-bot {
          width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 20px rgba(124,58,237,.35);
        }
        .status-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 8px rgba(52,211,153,.6);
          animation: pulse-dot 2s ease infinite;
        }
        @keyframes pulse-dot {
          0%,100% { opacity: 1; } 50% { opacity: .5; }
        }
 
        /* ── Messages area ── */
        .messages-area {
          flex: 1; overflow-y: auto; position: relative; z-index: 1;
          padding: 24px 16px 8px;
          scroll-behavior: smooth;
        }
        .messages-area::-webkit-scrollbar { width: 4px; }
        .messages-area::-webkit-scrollbar-track { background: transparent; }
        .messages-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,.08); border-radius: 4px; }
        .messages-inner { max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
 
        /* ── Bubbles ── */
        .bubble-row { display: flex; gap: 10px; animation: fadeUp .3s ease; }
        .bubble-row.user { flex-direction: row-reverse; }
 
        .avatar-sm {
          width: 32px; height: 32px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          align-self: flex-end;
        }
        .avatar-sm.bot { background: linear-gradient(135deg, #7c3aed, #4f46e5); }
        .avatar-sm.user { background: linear-gradient(135deg, #0ea5e9, #6366f1); }
 
        .bubble {
          max-width: min(80%, 600px);
          padding: 12px 16px;
          border-radius: 18px;
          font-size: .9rem;
          line-height: 1.65;
          position: relative;
        }
        .bubble.bot {
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.08);
          color: rgba(255,255,255,.88);
          border-bottom-left-radius: 4px;
        }
        .bubble.user {
          background: linear-gradient(135deg, rgba(124,58,237,.7), rgba(79,70,229,.7));
          border: 1px solid rgba(139,92,246,.3);
          color: white;
          border-bottom-right-radius: 4px;
        }
        .bubble-actions {
          display: flex; gap: 4px; align-items: center;
          margin-top: 6px; opacity: 0; transition: opacity .2s;
        }
        .bubble-row:hover .bubble-actions { opacity: 1; }
 
        /* Markdown inside bubbles */
        .bubble .prose-content { color: inherit; }
        .bubble .prose-content p { margin: 0 0 .5em; }
        .bubble .prose-content p:last-child { margin-bottom: 0; }
        .bubble .prose-content pre {
          background: rgba(0,0,0,.4); border: 1px solid rgba(255,255,255,.1);
          border-radius: 10px; padding: 12px; overflow-x: auto; margin: .6em 0;
          font-size: .82rem; line-height: 1.5;
        }
        .bubble .prose-content code {
          background: rgba(139,92,246,.2); border-radius: 4px;
          padding: .1em .35em; font-size: .82em;
        }
        .bubble .prose-content pre code { background: none; padding: 0; }
        .bubble .prose-content strong { color: white; font-weight: 600; }
        .bubble .prose-content ul, .bubble .prose-content ol { padding-left: 1.2em; margin: .4em 0; }
        .bubble .prose-content li { margin-bottom: .2em; }
        .bubble .prose-content a { color: #a78bfa; text-decoration: underline; }
        .bubble .prose-content h1,.bubble .prose-content h2,.bubble .prose-content h3 {
          color: white; font-family: 'Sora', sans-serif; margin: .75em 0 .3em;
        }
        .bubble.user .prose-content strong { color: #e0d7ff; }
 
        /* ── Typing bubble ── */
        .typing-bubble {
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 18px; border-bottom-left-radius: 4px;
          padding: 14px 18px; display: inline-flex; align-items: center;
        }
 
        /* ── Quick prompts ── */
        .quick-prompts {
          display: flex; flex-wrap: wrap; gap: 8px;
          justify-content: center; padding: 12px 0 4px;
        }
        .prompt-chip {
          padding: .4rem .9rem; border-radius: 99px;
          border: 1px solid rgba(139,92,246,.25);
          background: rgba(139,92,246,.08);
          color: rgba(255,255,255,.55); font-size: .8rem;
          cursor: pointer; transition: all .2s;
          font-family: 'Inter', sans-serif;
        }
        .prompt-chip:hover { border-color: rgba(139,92,246,.5); color: white; background: rgba(139,92,246,.15); }
 
        /* ── Input bar ── */
        .input-bar {
          position: sticky; bottom: 0; z-index: 20;
          padding: 12px 16px 16px;
          background: rgba(11,11,20,.85);
          border-top: 1px solid rgba(255,255,255,.06);
          backdrop-filter: blur(20px);
        }
        .input-wrap {
          max-width: 760px; margin: 0 auto;
          display: flex; align-items: flex-end; gap: 10px;
        }
        .textarea-shell {
          flex: 1; position: relative;
          background: rgba(255,255,255,.05);
          border: 1.5px solid rgba(255,255,255,.1);
          border-radius: 16px; overflow: hidden;
          transition: border-color .25s;
        }
        .textarea-shell:focus-within { border-color: rgba(139,92,246,.5); }
        .chat-textarea {
          width: 100%; padding: 12px 16px;
          background: none; border: none; outline: none; resize: none;
          color: white; font-size: .9rem; line-height: 1.5;
          font-family: 'Inter', sans-serif;
          max-height: 140px; overflow-y: auto;
        }
        .chat-textarea::placeholder { color: rgba(255,255,255,.25); }
        .send-btn {
          width: 46px; height: 46px; border-radius: 14px; border: none;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: white; cursor: pointer; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: all .2s;
          box-shadow: 0 4px 20px rgba(124,58,237,.35);
        }
        .send-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 28px rgba(124,58,237,.5); }
        .send-btn:disabled { opacity: .35; cursor: not-allowed; transform: none; }
 
        /* ── Empty state ── */
        .empty-hero {
          text-align: center; padding: 40px 20px 20px;
          animation: fadeUp .5s ease;
        }
        .empty-glow {
          width: 72px; height: 72px; border-radius: 22px; margin: 0 auto 16px;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 40px rgba(124,58,237,.4);
        }
      `}</style>
 
      <div className="chat-root">
        {/* Header */}
        <div className="chat-header">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={16} />
          </button>
          <div className="avatar-bot">
            <Bot size={20} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "1rem", color: "white", lineHeight: 1.2 }}>
              AI Mentor
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
              <div className="status-dot" />
              <span style={{ fontSize: ".72rem", color: "rgba(255,255,255,.4)" }}>Online · SkillPilot Intelligence</span>
            </div>
          </div>
          <button
            onClick={retry}
            disabled={loading || messages.length < 2}
            title="Retry last response"
            style={{
              background: "none", border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 10, color: "rgba(255,255,255,.3)",
              width: 34, height: 34, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .2s", opacity: messages.length < 2 ? 0.3 : 1,
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "white")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.3)")}
          >
            <RotateCcw size={14} />
          </button>
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
                    ? <Bot size={15} color="white" />
                    : <User size={15} color="white" />}
                </div>
                <div>
                  <div className={`bubble ${msg.role === "model" ? "bot" : "user"}`}>
                    <div className="prose-content">
                      <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                    </div>
                  </div>
                  <div className={`bubble-actions ${msg.role === "user" ? "justify-end" : ""}`}
                    style={{ justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                    <CopyButton text={msg.parts[0].text} />
                    <span style={{ fontSize: ".68rem", color: "rgba(255,255,255,.18)" }}>
                      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
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
                    <Bot size={15} color="white" />
                  </div>
                  <div className="typing-bubble">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
 
            {/* Quick prompt chips */}
            <AnimatePresence>
              {showQuickPrompts && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginBottom: 10 }}>
                    <Lightbulb size={13} color="rgba(255,255,255,.25)" />
                    <span style={{ fontSize: ".73rem", color: "rgba(255,255,255,.25)" }}>Try asking…</span>
                  </div>
                  <div className="quick-prompts">
                    {QUICK_PROMPTS.map(p => (
                      <button key={p} className="prompt-chip" onClick={() => send(p)}>{p}</button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
 
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
                placeholder="Ask your AI mentor anything… (Shift+Enter for new line)"
                disabled={loading}
              />
            </div>
            <button
              className="send-btn"
              onClick={() => send()}
              disabled={loading || !input.trim()}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <span style={{ fontSize: ".68rem", color: "rgba(255,255,255,.15)" }}>
              <Sparkles size={9} style={{ display: "inline", marginRight: 3 }} />
              AI can make mistakes. Verify important information.
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
 
export default ChatPage;