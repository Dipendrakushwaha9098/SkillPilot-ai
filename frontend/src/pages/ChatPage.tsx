import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { mentorService } from "@/services/api";
import { useNavigate } from "react-router-dom";

interface Message {
  role: "user" | "model";
  parts: [{ text: string }];
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", parts: [{ text: "Hi! I'm your **SkillPilot AI Mentor** 🧠\n\nAsk me anything about coding, learning strategies, or career advice!" }] },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg: Message = { role: "user", parts: [{ text: input.trim() }] };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await mentorService.chat({
        message: input.trim(),
        history: messages
      });
      
      const botMsg: Message = { role: "model", parts: [{ text: res.data.reply }] };
      setMessages(prev => [...prev, botMsg]);
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.message || "Failed to get AI response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="border-b bg-card px-4 py-3 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-5 w-5" />
             </Button>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-semibold">AI Mentor</h1>
              <p className="text-xs text-muted-foreground">Powered by Gemini AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-3xl px-4 py-6">
          <div className="space-y-6">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  msg.role === "model" ? "bg-gradient-primary" : "bg-gradient-accent"
                }`}>
                  {msg.role === "model" ? (
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <User className="h-4 w-4 text-accent-foreground" />
                  )}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "border bg-card shadow-card rounded-tl-none"
                }`}>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="rounded-2xl border bg-card px-4 py-3 shadow-card rounded-tl-none">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-card px-4 py-4 sticky bottom-0">
        <div className="container mx-auto max-w-3xl">
          <form
            onSubmit={e => { e.preventDefault(); send(); }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask your AI mentor anything..."
              className="flex-1 h-12 rounded-xl"
              disabled={loading}
            />
            <Button type="submit" variant="hero" size="icon" className="h-12 w-12 rounded-xl" disabled={loading || !input.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
