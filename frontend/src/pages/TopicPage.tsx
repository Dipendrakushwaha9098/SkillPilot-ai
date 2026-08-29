import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2, 
  ExternalLink, 
  Code2, 
  BookOpen, 
  FileText, 
  BrainCircuit, 
  Check, 
  X, 
  HelpCircle, 
  MessageSquare,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Zap,
  Copy,
  Terminal,
  List
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

// --- SUB-COMPONENTS ---

/**
 * Custom Markdown Components for a premium look
 */
const MarkdownComponents = {
  code({ inline, className, children, ...props }: { node?: unknown; inline?: boolean; className?: string; children?: React.ReactNode }) {
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '');
    
    const copyToClipboard = () => {
      navigator.clipboard.writeText(codeString);
      toast.success("Code copied to clipboard!");
    };

    if (!inline) {
      return (
        <div className="group relative my-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d1a] shadow-2xl">
          <div className="flex items-center justify-between bg-white/5 px-4 py-2 text-xs font-mono text-muted-foreground border-b border-white/5">
            <div className="flex items-center gap-2">
              <Terminal className="h-3 w-3" />
              <span>{match ? match[1].toUpperCase() : 'CODE'}</span>
            </div>
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Copy className="h-3 w-3" /> Copy
            </button>
          </div>
          <pre className="p-4 overflow-x-auto text-sm leading-relaxed text-indigo-100/90 font-mono">
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      );
    }
    return (
      <code className="rounded bg-primary/10 px-1.5 py-0.5 text-sm font-semibold text-primary" {...props}>
        {children}
      </code>
    );
  },
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mt-10 mb-6 text-2xl font-bold tracking-tight text-foreground border-b border-border pb-2">
      {children}
    </h2>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-4 leading-relaxed text-muted-foreground/90">
      {children}
    </p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => <ul className="mb-6 space-y-2 list-none">{children}</ul>,
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="flex items-start gap-3 text-muted-foreground/90">
      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
      <span>{children}</span>
    </li>
  ),
};

interface TopicInfo {
  title: string;
  explanation: string;
}

const TopicHeader = React.memo(({ topic, mMonth }: { topic: TopicInfo; mMonth: number }) => (
  <div id="overview" className="mb-10">
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="mb-5 flex items-center justify-between"
    >
      <Link to="/dashboard" className="group flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-all">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-background/50 backdrop-blur-md group-hover:border-primary/50 group-hover:bg-primary/5 group-hover:scale-110 transition-all">
          <ArrowLeft className="h-4 w-4" />
        </div>
        Back to Dashboard
      </Link>
      <div className="flex items-center gap-2 rounded-full border bg-background/30 px-4 py-1.5 text-xs font-bold backdrop-blur-xl shadow-sm">
        <span className="text-muted-foreground opacity-60">PHASE</span>
        <span className="text-primary tracking-widest">MONTH {mMonth}</span>
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary ring-1 ring-inset ring-primary/20">
        <Sparkles className="h-3 w-3" /> Accelerated Learning
      </div>
      <h1 className="mb-4 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
        <span className="text-nebula">{topic.title}</span>
      </h1>
      <div className="prose prose-purple dark:prose-invert max-w-3xl text-base sm:text-lg leading-relaxed text-muted-foreground/90">
        <ReactMarkdown components={MarkdownComponents}>{topic.explanation}</ReactMarkdown>
      </div>
    </motion.div>
  </div>
));

const TopicSidebar = React.memo(({ topic, done, onToggleComplete }: { topic: TopicInfo; done: boolean; onToggleComplete: () => void }) => (
  <div className="space-y-6 w-full min-w-0">
    {/* Progress Card */}
    <div className={`relative overflow-hidden rounded-[2rem] border-2 p-6 sm:p-8 transition-all duration-500 ${done ? "border-primary/30 bg-primary/5 shadow-[0_0_40px_-15px_rgba(var(--primary),0.3)]" : "border-border bg-card/50 backdrop-blur-md shadow-xl"}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="font-display text-xs font-black uppercase tracking-widest text-muted-foreground">Status</div>
        {done && <Sparkles className="h-4 w-4 text-primary animate-pulse" />}
      </div>
      <div className="mb-6 flex items-center gap-4">
         <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] transition-all duration-500 ${done ? "bg-primary text-white scale-110 shadow-lg shadow-primary/25" : "bg-muted text-muted-foreground"}`}>
            <CheckCircle2 className="h-7 w-7" />
         </div>
         <div>
            <div className="font-display text-lg font-black">{done ? "Completed" : "In Progress"}</div>
            <div className="text-xs text-muted-foreground">{done ? "Course Mastered" : "Ready to Learn"}</div>
         </div>
      </div>
      <Button
        variant={done ? "outline" : "hero"}
        size="lg"
        className="group w-full rounded-2xl py-6 font-bold"
        onClick={onToggleComplete}
      >
        {done ? (
          <span className="flex items-center gap-2">Revisit Topic <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></span>
        ) : (
          <span className="flex items-center gap-2">Mark as Mastered <Zap className="h-4 w-4 fill-current" /></span>
        )}
      </Button>
    </div>

    {/* Resources Glass Card */}
    <div id="resources" className="glass rounded-[2rem] border border-white/20 p-6 shadow-2xl dark:glass-dark w-full overflow-hidden">
      <h3 className="mb-4 flex items-center gap-2.5 font-display text-xs font-black uppercase tracking-widest text-emerald-400">
        <BookOpen className="h-4 w-4 text-emerald-400 shrink-0" /> GeeksforGeeks Resources
      </h3>
      <div className="flex flex-col gap-3 w-full min-w-0">
        {topic.resources.map((r: string, i: number) => {
          const isGfg = r.includes("geeksforgeeks.org");
          const targetUrl = isGfg ? r : `https://www.geeksforgeeks.org/search/?q=${encodeURIComponent(topic.title)}`;
          return (
            <a 
              key={i} 
              href={targetUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/10 active:scale-[0.98] w-full min-w-0 overflow-hidden"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500/25 transition-colors">
                <ExternalLink className="h-4 w-4" />
              </div>
              <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider truncate">GeeksforGeeks</span>
                <span className="text-xs font-semibold text-foreground/90 group-hover:text-emerald-400 transition-colors truncate">
                  GeeksforGeeks Guide #{i + 1}
                </span>
                <span className="text-[11px] text-muted-foreground/60 truncate font-mono mt-0.5">
                  geeksforgeeks.org
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>

    {/* AI Mentor Sticky CTA */}
    <div className="group relative overflow-hidden rounded-[2.5rem] border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6 sm:p-8 shadow-xl w-full">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-all group-hover:bg-primary/20" />
      <h3 className="mb-3 flex items-center gap-3 font-display text-xl sm:text-2xl font-black tracking-tight">
        <MessageSquare className="h-6 w-6 text-primary" /> AI Mentor
      </h3>
      <p className="mb-6 text-xs sm:text-sm leading-relaxed text-muted-foreground/80">
        Stuck on a concept? Ask for a real-world analogy or a deep dive into the code.
      </p>
      <Link to={`/chat?topic=${encodeURIComponent(topic.title)}`}>
        <Button variant="outline" className="w-full bg-background/80 hover:bg-background font-black gap-3 border-2 rounded-2xl py-6 shadow-sm group-hover:shadow-primary/10 transition-all">
          Launch Mentor <Zap className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  </div>
));

// --- MAIN COMPONENT ---

const TopicPage = () => {
  const { topicTitle } = useParams();
  const navigate = useNavigate();
  const { roadmap, completedTopics, toggleTopicComplete } = useAuth();
  
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizDone(false);
  };

  // Scroll Progress for top bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Memoize topic info
  const { topic, prevTopic, nextTopic } = useMemo(() => {
    if (!roadmap) return { topic: null, prevTopic: null, nextTopic: null };
    const flatTopics = roadmap.months.flatMap(m => m.topics.map(t => ({ ...t, mMonth: m.month })));
    const index = flatTopics.findIndex(t => t.title === topicTitle);
    return {
      topic: flatTopics[index] || null,
      prevTopic: index > 0 ? flatTopics[index - 1] : null,
      nextTopic: index < flatTopics.length - 1 ? flatTopics[index + 1] : null,
    };
  }, [roadmap, topicTitle]);

  const handleToggleComplete = useCallback(() => {
    if (topic) toggleTopicComplete(topic.title);
  }, [topic, toggleTopicComplete]);

  if (!roadmap || !topic) return null; // Add proper loading/not found state if needed

  const done = completedTopics.includes(topic.title);
  const quiz = topic.quizzes || [];
  const currentQuestion = quiz[currentQ];
  const quizProgress = quiz.length > 0 ? ((currentQ + (showResult ? 1 : 0)) / quiz.length) * 100 : 0;

  const handleAnswer = (option: string) => {
    if (showResult) return;
    setSelectedAnswer(option);
    setShowResult(true);
    if (option === currentQuestion.answer) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentQ < quiz.length - 1) {
      setCurrentQ(q => q + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizDone(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-background bg-grid-pattern bg-radial-gradient selection:bg-primary/30 overflow-hidden">
      {/* Scroll Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-emerald-500 origin-left z-50" style={{ scaleX }} />

      {/* Modern Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="animate-orb-1 absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="animate-orb-2 absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 pt-20 pb-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* LEFT: Table of Contents (Sticky) */}
          <aside className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-32 space-y-8">
              <div className="flex items-center gap-2 font-display text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                <List className="h-3 w-3" /> Navigation
              </div>
              <nav className="space-y-1">
                {[
                  { name: 'Overview', id: 'overview' },
                  { name: 'Deep Dive Notes', id: 'notes' },
                  { name: 'Knowledge Check', id: 'quiz' },
                  { name: 'Resources', id: 'resources' }
                ].map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-all text-left rounded-xl hover:bg-primary/5 group"
                  >
                    <div className="h-1 w-1 rounded-full bg-border group-hover:bg-primary group-hover:scale-150 transition-all" />
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* CENTER: Main Content */}
          <main className="flex-1 max-w-4xl">
            <TopicHeader topic={topic} mMonth={topic.mMonth} />

            {/* Study Notes */}
            <section id="notes" className="glass rounded-[2.5rem] border border-white/10 p-10 mb-16 shadow-2xl dark:glass-dark relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                <FileText className="h-40 w-40" />
              </div>
              
              <h2 className="mb-10 flex items-center gap-4 font-display text-3xl font-black tracking-tight">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                  <FileText className="h-6 w-6" />
                </div>
                Detailed Learning Notes
              </h2>
              
              <div className="space-y-10">
                {topic.notes.map((note: string, i: number) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-gradient-to-b before:from-primary/40 before:to-transparent before:rounded-full"
                  >
                    <ReactMarkdown components={MarkdownComponents}>{note}</ReactMarkdown>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Quiz Section */}
            {quiz.length > 0 && (
              <section id="quiz" className="relative overflow-hidden rounded-[3rem] border-2 border-accent/20 bg-accent/5 p-12 mb-16 shadow-inner">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[100px] rounded-full" />
                
                <h2 className="relative mb-10 flex items-center gap-4 font-display text-3xl font-black tracking-tight">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent shadow-inner">
                    <BrainCircuit className="h-6 w-6" />
                  </div>
                  Knowledge Checkpoint
                </h2>

                {!quizStarted ? (
                  <div className="relative z-10 text-center py-12">
                    <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-accent/10 ring-1 ring-accent/20 shadow-xl">
                      <Zap className="h-10 w-10 text-accent fill-accent/20 animate-pulse" />
                    </div>
                    <p className="mb-10 text-xl font-medium text-muted-foreground max-w-lg mx-auto leading-relaxed">
                      Prove your mastery of this topic by completing the <strong>{quiz.length} checkpoint questions</strong>.
                    </p>
                    <Button variant="hero" size="lg" className="px-12 py-8 text-lg font-black rounded-3xl shadow-accent/20 hover:scale-105 transition-transform" onClick={() => setQuizStarted(true)}>
                      Begin Challenge
                    </Button>
                  </div>
                ) : quizDone ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 relative z-10">
                    <div className="relative mx-auto mb-10 flex h-32 w-32 items-center justify-center rounded-[2.5rem] bg-accent/10 text-accent shadow-2xl">
                       <Trophy className="h-14 w-14" />
                       <motion.div className="absolute inset-[-10px] rounded-[3rem] border-4 border-accent/30 border-t-accent" animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                    </div>
                    <h3 className="font-display text-5xl font-black mb-4 tracking-tight">
                      {score === quiz.length ? "GODLIKE!" : score >= quiz.length / 2 ? "IMPRESSIVE!" : "KEEP GRINDING!"}
                    </h3>
                    <p className="mx-auto mb-12 max-w-md text-xl text-muted-foreground font-medium">
                      You scored <strong>{score} out of {quiz.length}</strong>. 
                      {score === quiz.length ? " You are officially a master of this topic." : " Review the concepts to achieve perfection."}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-6">
                      <Button variant="outline" size="lg" className="rounded-2xl px-10 py-7 font-bold border-2" onClick={resetQuiz}>
                        Retry Assessment
                      </Button>
                      {!done && (
                        <Button variant="hero" size="lg" className="rounded-2xl px-10 py-7 font-black shadow-lg" onClick={handleToggleComplete}>
                          Claim Completion
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="relative z-10">
                    <div className="mb-10 space-y-4">
                      <div className="flex items-end justify-between font-display">
                        <div className="text-sm font-black uppercase tracking-[0.2em] text-accent/70">Question {currentQ + 1} / {quiz.length}</div>
                        <div className="text-4xl font-black text-accent">{Math.round(quizProgress)}<span className="text-lg opacity-40">%</span></div>
                      </div>
                      <Progress value={quizProgress} className="h-3 rounded-full bg-accent/10" />
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div key={currentQ} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}>
                        <h3 className="mb-10 font-display text-2xl font-black leading-snug tracking-tight">
                          {currentQuestion.question}
                        </h3>
                        <div className="grid gap-4">
                          {currentQuestion.options.map((opt: string, idx: number) => {
                            const isCorrect = opt === currentQuestion.answer;
                            const isSelected = opt === selectedAnswer;
                            let btnStyle = "border-border/50 bg-background/50 hover:border-accent/50 hover:bg-accent/5";
                            if (showResult) {
                              if (isCorrect) btnStyle = "border-primary bg-primary/10 ring-4 ring-primary/10 scale-[1.02]";
                              else if (isSelected) btnStyle = "border-destructive bg-destructive/10 ring-4 ring-destructive/10";
                              else btnStyle = "opacity-40 grayscale-[0.5]";
                            } else if (isSelected) btnStyle = "border-accent bg-accent/10 ring-4 ring-accent/10 scale-[1.01]";

                            return (
                              <button key={idx} onClick={() => handleAnswer(opt)} disabled={showResult} className={`group flex w-full items-center gap-5 rounded-2xl border-2 p-6 text-left transition-all duration-300 ${btnStyle} disabled:cursor-default`}>
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 text-sm font-black transition-all ${
                                  showResult && isCorrect ? "bg-primary border-primary text-white shadow-lg shadow-primary/25" : 
                                  showResult && isSelected ? "bg-destructive border-destructive text-white shadow-lg shadow-destructive/25" : 
                                  isSelected ? "bg-accent border-accent text-white shadow-lg shadow-accent/25" : "group-hover:border-accent group-hover:scale-110"
                                }`}>
                                  {showResult && isCorrect ? <Check className="h-5 w-5" /> : showResult && isSelected ? <X className="h-5 w-5" /> : String.fromCharCode(65 + idx)}
                                </div>
                                <span className="font-bold text-lg">{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                        {showResult && (
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 flex justify-end">
                            <Button variant="hero" size="lg" className="rounded-2xl px-12 py-8 text-lg font-black group" onClick={nextQuestion}>
                              {currentQ < quiz.length - 1 ? "Next Step" : "Reveal Final Score"} <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                            </Button>
                          </motion.div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}
              </section>
            )}

            {/* Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-16 border-t border-border/50">
              {prevTopic ? (
                <Link to={`/course/${encodeURIComponent(prevTopic.title)}`} className="group flex flex-col items-start gap-4 rounded-3xl border-2 p-8 transition-all hover:border-primary/50 hover:bg-primary/5 hover:translate-y-[-4px] shadow-lg">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground group-hover:text-primary transition-colors">
                    <ChevronLeft className="h-4 w-4" /> Previous Module
                  </div>
                  <div className="font-display text-2xl font-black group-hover:text-nebula transition-all">{prevTopic.title}</div>
                </Link>
              ) : <div />}
              
              {nextTopic ? (
                <Link to={`/course/${encodeURIComponent(nextTopic.title)}`} className="group flex flex-col items-end gap-4 rounded-3xl border-2 p-8 text-right transition-all hover:border-primary/50 hover:bg-primary/5 hover:translate-y-[-4px] shadow-lg">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground group-hover:text-primary transition-colors">
                    Next Module <ChevronRight className="h-4 w-4" />
                  </div>
                  <div className="font-display text-2xl font-black group-hover:text-nebula transition-all">{nextTopic.title}</div>
                </Link>
              ) : (
                <div className="rounded-3xl border-2 border-dashed p-8 flex flex-col items-end justify-center bg-muted/20 opacity-60">
                   <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Roadmap Peak</div>
                   <div className="font-display text-2xl font-black italic">Journey Complete</div>
                </div>
              )}
            </div>
          </main>

          {/* RIGHT: Sidebar */}
          <aside className="w-full lg:w-96 shrink-0">
            <div className="sticky top-32">
              <TopicSidebar topic={topic} done={done} onToggleComplete={handleToggleComplete} />
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default TopicPage;
