import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, X, Loader2, Maximize2, Minimize2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { mentorService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface Message {
  role: "user" | "model";
  parts: [{ text: string }];
}

const AIChatBox = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", parts: [{ text: "Hi! I'm your AI Mentor. How can I help you with your roadmap today?" }] },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", parts: [{ text: input.trim() }] };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await mentorService.chat({ 
        message: input.trim(), 
        history: messages.slice(-6) // Send last few messages for context
      });
      const botMsg: Message = { role: "model", parts: [{ text: res.reply }] };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const botMsg: Message = { role: "model", parts: [{ text: "Sorry, I'm having trouble connecting right now. Please try again later." }] };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  if (!isAuthenticated || !user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-600 shadow-xl shadow-indigo-500/20 flex items-center justify-center text-white hover:scale-110 transition-transform"
          >
            <Bot size={32} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ 
              y: 0, 
              opacity: 1, 
              scale: 1,
              height: isMinimized ? "64px" : "500px",
              width: "360px"
            }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            className="bg-[#11111a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-white/5 border-bottom border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center text-white">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">AI Mentor</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        msg.role === "user" 
                          ? "bg-purple-600 text-white rounded-tr-none" 
                          : "bg-white/5 text-white/80 border border-white/10 rounded-tl-none"
                      }`}>
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none">
                        <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white/5 border-t border-white/5">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-purple-500/50 transition-all">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Ask anything..."
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-white/20 px-2"
                    />
                    <button 
                      onClick={handleSend}
                      disabled={!input.trim() || loading}
                      className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center disabled:opacity-50 disabled:scale-100 active:scale-90 transition-all"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between px-1">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={10} className="text-purple-400" />
                      <span className="text-[10px] text-white/30">Gemini 3 Powered</span>
                    </div>
                    <button 
                      onClick={() => navigate("/chat")}
                      className="text-[10px] text-purple-400 font-bold hover:underline"
                    >
                      Full Experience
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatBox;
