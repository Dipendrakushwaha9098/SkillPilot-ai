import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { notesService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Loader2, 
  Copy, 
  Check, 
  Download, 
  ArrowLeft,
  FileText,
  BrainCircuit,
  MessageSquare,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const NotesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setNotes(null);
    try {
      const data = await notesService.generate(topic);
      setNotes(data.notes);
      toast({
        title: "Notes Generated!",
        description: `Deep dive into ${topic} is ready.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not reach AI mentor. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!notes) return;
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Notes copied to clipboard.",
    });
  };

  const quickTopics = [
    "React Server Components",
    "Tailwind CSS Architecture",
    "MongoDB Aggregation Pipelines",
    "Redis Caching Strategies",
    "TypeScript Advanced Types"
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-[0_0_15px_-3px_rgba(var(--primary-rgb),0.3)]"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Powered Learning</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
          >
            SkillPilot <span className="text-gradient">Notes</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Generate deep, clear, and comprehensive study notes for any technical concept in seconds.
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <form onSubmit={handleGenerate} className="relative flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Enter a topic (e.g., GraphQL, Docker, Clean Architecture...)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="h-14 pl-12 pr-4 text-lg rounded-2xl border-2 border-primary/10 bg-card focus:border-primary/50 focus:ring-0 shadow-lg transition-all"
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading || !topic}
              variant="hero"
              className="h-14 px-8 rounded-2xl gap-2 font-semibold text-base"
            >
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Generating...</>
              ) : (
                <><BrainCircuit className="h-5 w-5" /> Generate Notes</>
              )}
            </Button>
          </form>

          {/* Quick Topics */}
          {!notes && !loading && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {quickTopics.map((t, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setTopic(t);
                    // Trigger generate manually after state update
                    setTimeout(() => {
                      const btn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
                      btn?.click();
                    }, 0);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-card/50 px-4 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                >
                  <ChevronRight className="h-3 w-3" />
                  {t}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Results Area */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="relative mb-6 h-24 w-24">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                <div className="absolute inset-0 animate-pulse rounded-full bg-primary/10" />
                <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-primary/20 bg-card shadow-2xl">
                  <BrainCircuit className="h-10 w-10 text-primary animate-bounce" />
                </div>
              </div>
              <h3 className="mb-2 text-2xl font-bold">Crafting Your Deep Dive...</h3>
              <p className="max-w-md text-muted-foreground">
                Analyzing the concept, gathering best practices, and structuring clear explanations. This might take a few seconds.
              </p>
            </motion.div>
          ) : notes ? (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative rounded-3xl border bg-card p-8 md:p-12 shadow-2xl overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-[100px]" />
              <div className="absolute -left-40 -bottom-40 h-80 w-80 rounded-full bg-accent/5 blur-[100px]" />

              {/* Floating Action Buttons */}
              <div className="absolute right-6 top-6 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyToClipboard}
                  className="bg-card/80 backdrop-blur-sm gap-2 border-primary/10 hover:border-primary/30"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>

              {/* Content */}
              <div className="prose prose-invert prose-primary max-w-none prose-headings:font-display prose-headings:font-bold prose-p:text-muted-foreground prose-li:text-muted-foreground">
                <ReactMarkdown>{notes}</ReactMarkdown>
              </div>

              {/* Footer Actions */}
              <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t pt-8 md:flex-row">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-bold">
                        AI
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Generated by SkillPilot AI Mentor</p>
                </div>
                <div className="flex gap-4">
                   <Link to={`/chat?topic=${encodeURIComponent(topic)}`}>
                    <Button variant="outline" className="gap-2">
                      <MessageSquare className="h-4 w-4" /> Ask Follow-up
                    </Button>
                   </Link>
                </div>
              </div>
            </motion.div>
          ) : !loading && (
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
             >
                <div className="p-6 rounded-2xl border bg-card/50 hover:bg-card transition-colors">
                    <FileText className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-bold mb-2">Detailed Explanations</h3>
                    <p className="text-sm text-muted-foreground">Deep dives into core principles and underlying logic of any tech stack.</p>
                </div>
                <div className="p-6 rounded-2xl border bg-card/50 hover:bg-card transition-colors">
                    <BrainCircuit className="h-8 w-8 text-accent mb-4" />
                    <h3 className="font-bold mb-2">Interview Ready</h3>
                    <p className="text-sm text-muted-foreground">Curated questions and impressive answers to help you ace your next interview.</p>
                </div>
                <div className="p-6 rounded-2xl border bg-card/50 hover:bg-card transition-colors md:col-span-2 lg:col-span-1">
                    <Sparkles className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-bold mb-2">Visual & Structured</h3>
                    <p className="text-sm text-muted-foreground">Beautifully formatted Markdown with code blocks, tables, and lists.</p>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotesPage;
