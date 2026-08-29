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
  FileText,
  BrainCircuit,
  MessageSquare,
  ChevronRight,
  Atom,
  Calculator,
  Globe,
  TrendingUp,
  Landmark,
  GraduationCap,
  Languages,
  Code2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const SUBJECT_CATEGORIES = [
  {
    name: "Computer Science & IT",
    icon: Code2,
    color: "#6EE7B7",
    topics: [
      "Data Structures & Algorithms",
      "React & Next.js Architecture",
      "System Design & Scalability",
      "Node.js Backend & APIs",
      "PostgreSQL & Database Design"
    ]
  },
  {
    name: "Core Sciences",
    icon: Atom,
    color: "#38BDF8",
    topics: [
      "Quantum Mechanics & Wave Functions",
      "Organic Chemistry Mechanisms",
      "Cell Biology & Genetics",
      "Thermodynamics & Heat Transfer",
      "Electromagnetism & Circuits"
    ]
  },
  {
    name: "Mathematics",
    icon: Calculator,
    color: "#F472B6",
    topics: [
      "Multivariable Calculus & Integration",
      "Linear Algebra & Vector Spaces",
      "Probability & Statistics",
      "Differential Equations",
      "Discrete Mathematics & Logic"
    ]
  },
  {
    name: "Business & Economics",
    icon: TrendingUp,
    color: "#10B981",
    topics: [
      "Financial Accounting & Balance Sheets",
      "Microeconomics & Supply-Demand",
      "Corporate Finance & Valuation",
      "Digital Marketing Strategy",
      "Macroeconomic Indicators & Inflation"
    ]
  },
  {
    name: "Humanities & Social Sciences",
    icon: Landmark,
    color: "#818CF8",
    topics: [
      "Cognitive Psychology & Behavioral Science",
      "World History & Geopolitics",
      "Political Theory & Governance",
      "Philosophical Ethics & Logic",
      "Sociology & Cultural Systems"
    ]
  },
  {
    name: "Competitive Exam Prep",
    icon: GraduationCap,
    color: "#FBBF24",
    topics: [
      "JEE Physics - Rotational Dynamics",
      "NEET Biology - Plant Physiology",
      "SAT Math - Advanced Algebra",
      "GATE Computer Science - Operating Systems",
      "UPSC Civil Services - Indian Constitution"
    ]
  },
  {
    name: "Languages & Skills",
    icon: Languages,
    color: "#14B8A6",
    topics: [
      "Advanced English Grammar & Syntax",
      "Technical Writing & Documentation",
      "Public Speaking & Presentation Skills",
      "Spanish Conversational Basics",
      "Business Communication & Negotiation"
    ]
  }
];

const NotesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Computer Science & IT");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e?: React.FormEvent, customTopic?: string) => {
    if (e) e.preventDefault();
    const targetTopic = customTopic || topic;
    if (!targetTopic.trim()) return;

    setLoading(true);
    setNotes(null);
    try {
      const data = await notesService.generate(targetTopic);
      setNotes(data.notes);
      toast({
        title: "Study Notes Generated!",
        description: `Comprehensive notes for ${targetTopic} are ready.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate notes. Please try again.",
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

  const downloadNotes = () => {
    if (!notes) return;
    const blob = new Blob([notes], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: "Notes saved as Markdown file.",
    });
  };

  const currentCategoryData = SUBJECT_CATEGORIES.find(c => c.name === activeCategory) || SUBJECT_CATEGORIES[0];

  return (
    <div className="min-h-screen bg-background bg-grid-pattern bg-radial-gradient pt-24 pb-12 relative overflow-hidden">
      {/* Background Animated Ambient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="animate-orb-1 absolute top-[10%] left-[-5%] w-[550px] h-[550px] rounded-full bg-emerald-500/10 blur-[130px]" />
        <div className="animate-orb-2 absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[130px]" />
      </div>

      <div className="container mx-auto max-w-4xl px-4 relative z-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-[0_0_15px_-3px_rgba(var(--primary-rgb),0.3)]"
          >
            <Sparkles className="h-4 w-4" />
            <span>Universal AI Notes Library</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
          >
            Every Subject <span className="text-gradient">Study Notes</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Instant, comprehensive study notes & revision guides for any academic, scientific, business, or technical subject.
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <form onSubmit={(e) => handleGenerate(e)} className="relative flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Enter any subject or topic (e.g. Quantum Physics, Calculus, Organic Chemistry, Microeconomics, React)..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="h-14 pl-12 pr-4 text-base md:text-lg rounded-2xl border-2 border-primary/10 bg-card focus:border-primary/50 focus:ring-0 shadow-lg transition-all"
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading || !topic}
              variant="hero"
              className="h-14 px-8 rounded-2xl gap-2 font-semibold text-base shrink-0"
            >
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Generating...</>
              ) : (
                <><BrainCircuit className="h-5 w-5" /> Generate Notes</>
              )}
            </Button>
          </form>

          {/* Subject Categories Bar */}
          <div className="mt-6 flex overflow-x-auto pb-2 gap-2 scrollbar-none">
            {SUBJECT_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all border ${
                    active
                      ? 'bg-primary text-primary-foreground border-primary shadow-md'
                      : 'bg-card/70 border-border text-muted-foreground hover:bg-card hover:text-foreground'
                  }`}
                >
                  <Icon size={14} style={{ color: active ? 'inherit' : cat.color }} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Topics Grid */}
          {!notes && !loading && (
            <div className="mt-4 p-4 rounded-2xl bg-card/60 border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Popular Topics in {currentCategoryData.name}:</p>
              <div className="flex flex-wrap gap-2">
                {currentCategoryData.topics.map((t, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setTopic(t);
                      handleGenerate(undefined, t);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border bg-background/80 px-3.5 py-1.5 text-xs font-medium text-foreground transition-all hover:border-primary/50 hover:text-primary hover:bg-primary/5 shadow-sm"
                  >
                    <ChevronRight className="h-3 w-3 text-emerald-400" />
                    {t}
                  </motion.button>
                ))}
              </div>
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
              <h3 className="mb-2 text-2xl font-bold font-display">Crafting Your Subject Study Notes...</h3>
              <p className="max-w-md text-muted-foreground text-sm">
                Gathering key principles, step-by-step examples, formulas/code, and exam mastery questions for <span className="font-semibold text-foreground">{topic}</span>.
              </p>
            </motion.div>
          ) : notes ? (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative rounded-3xl border bg-card p-6 md:p-12 shadow-2xl overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-[100px]" />
              <div className="absolute -left-40 -bottom-40 h-80 w-80 rounded-full bg-accent/5 blur-[100px]" />

              {/* Floating Action Buttons */}
              <div className="flex justify-end gap-2 mb-6 border-b pb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyToClipboard}
                  className="bg-card/80 backdrop-blur-sm gap-2 border-border hover:border-primary/40 text-xs font-semibold"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={downloadNotes}
                  className="bg-card/80 backdrop-blur-sm gap-2 border-border hover:border-primary/40 text-xs font-semibold"
                >
                  <Download className="h-4 w-4 text-emerald-400" />
                  Download .md
                </Button>
              </div>

              {/* Content */}
              <div className="prose dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
                <ReactMarkdown>{notes}</ReactMarkdown>
              </div>

              {/* Footer Actions */}
              <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t pt-8 md:flex-row">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs">
                    AI
                  </div>
                  <p className="text-sm text-muted-foreground">Generated by SkillPilot Universal AI Tutor</p>
                </div>
                <div className="flex gap-4">
                   <Link to={`/chat?topic=${encodeURIComponent(topic)}`}>
                    <Button variant="hero" className="gap-2 text-sm font-semibold">
                      <MessageSquare className="h-4 w-4" /> Ask AI Mentor About This Note
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
                    <h3 className="font-bold mb-2">Comprehensive & Structured</h3>
                    <p className="text-sm text-muted-foreground">Deep dive notes with summaries, core principles, formulas, code, and case studies.</p>
                </div>
                <div className="p-6 rounded-2xl border bg-card/50 hover:bg-card transition-colors">
                    <BrainCircuit className="h-8 w-8 text-accent mb-4" />
                    <h3 className="font-bold mb-2">Exam & Interview Ready</h3>
                    <p className="text-sm text-muted-foreground">Curated high-yield practice questions and worked solutions for every discipline.</p>
                </div>
                <div className="p-6 rounded-2xl border bg-card/50 hover:bg-card transition-colors md:col-span-2 lg:col-span-1">
                    <Sparkles className="h-8 w-8 text-emerald-400 mb-4" />
                    <h3 className="font-bold mb-2">Instant Export</h3>
                    <p className="text-sm text-muted-foreground">Copy notes to clipboard or download as a clean Markdown (.md) document instantly.</p>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotesPage;
