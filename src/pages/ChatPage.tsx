import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const mockResponses: Record<string, string> = {
  default: `I'm your **SkillPilot AI Mentor**! 🎯

I can help you with:
- **Coding questions** — explain concepts, debug issues
- **Learning advice** — what to study next, how to practice
- **Project ideas** — suggestions based on your skill level
- **Career guidance** — portfolio tips, interview prep

Just ask me anything!`,
};

const getAIResponse = async (message: string): Promise<string> => {
  await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));
  
  const lower = message.toLowerCase();
  if (lower.includes("react")) {
    return `**React** is a JavaScript library for building user interfaces. Here are key concepts:\n\n1. **Components** — Reusable UI building blocks\n2. **JSX** — HTML-like syntax in JavaScript\n3. **State** — Data that changes over time (\`useState\`)\n4. **Props** — Data passed from parent to child\n5. **Effects** — Side effects like API calls (\`useEffect\`)\n\nWant me to dive deeper into any of these? 🚀`;
  }
  if (lower.includes("javascript") || lower.includes("js")) {
    return `**JavaScript** is the language of the web! Key fundamentals:\n\n- **Variables**: \`let\`, \`const\`, \`var\`\n- **Functions**: Regular, arrow, async\n- **Arrays**: \`map\`, \`filter\`, \`reduce\`\n- **Promises**: Async/await pattern\n- **DOM**: Document manipulation\n\n\`\`\`javascript\nconst greet = (name) => \`Hello, \${name}!\`;\nconsole.log(greet('Developer'));\n\`\`\`\n\nWhat specific topic would you like to explore?`;
  }
  if (lower.includes("project")) {
    return `Here are some **project ideas** by level:\n\n🌱 **Beginner:**\n- Todo app with local storage\n- Calculator with history\n- Weather app using API\n\n🌿 **Intermediate:**\n- E-commerce product page\n- Real-time chat application\n- Blog with CMS\n\n🌳 **Advanced:**\n- Full-stack SaaS dashboard\n- AI-powered content generator\n- Real-time collaboration tool\n\nWhich level interests you?`;
  }
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return `Hey there! 👋 Great to see you!\n\nI'm your AI learning mentor. Ask me about:\n- Any **programming concept**\n- **Project ideas** for your level\n- **Debugging help** for your code\n- **Career advice** and learning tips\n\nWhat's on your mind?`;
  }
  return mockResponses.default;
};

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your **SkillPilot AI Mentor** 🧠\n\nAsk me anything about coding, learning strategies, or career advice!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const response = await getAIResponse(userMsg.content);
    setMessages(prev => [...prev, { role: "assistant", content: response }]);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col pt-16">
      <div className="border-b bg-card px-4 py-3">
        <div className="container mx-auto flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-semibold">AI Mentor</h1>
            <p className="text-xs text-muted-foreground">Ask anything about coding & learning</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-3xl px-4 py-6">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  msg.role === "assistant" ? "bg-gradient-primary" : "bg-gradient-accent"
                }`}>
                  {msg.role === "assistant" ? (
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <User className="h-4 w-4 text-accent-foreground" />
                  )}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border bg-card shadow-card"
                }`}>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="rounded-2xl border bg-card px-4 py-3 shadow-card">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-card px-4 py-4">
        <div className="container mx-auto max-w-3xl">
          <form
            onSubmit={e => { e.preventDefault(); send(); }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask your AI mentor anything..."
              className="flex-1"
              disabled={loading}
            />
            <Button type="submit" variant="hero" size="icon" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
