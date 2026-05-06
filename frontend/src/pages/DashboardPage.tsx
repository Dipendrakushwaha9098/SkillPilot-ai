import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Circle, BookOpen, MessageSquare, Trophy,
  Flame, ArrowRight, Search, X, ChevronRight, Sparkles
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
 
// ---------------------------------------------------------------------------
// Confetti helper (canvas-based, no extra dep)
// ---------------------------------------------------------------------------
function fireConfetti(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
 
  const COLORS = ["#6366f1", "#8b5cf6", "#f59e0b", "#10b981", "#ec4899", "#3b82f6"];
  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: -20,
    r: Math.random() * 7 + 3,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rot: Math.random() * Math.PI * 2,
    vx: (Math.random() - 0.5) * 4,
    vy: Math.random() * 4 + 2,
    vrot: (Math.random() - 0.5) * 0.2,
    opacity: 1,
  }));
 
  let frame: number;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;
      p.vy += 0.12;
      p.opacity -= 0.012;
      if (p.opacity > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        ctx.restore();
      }
    });
    if (alive) frame = requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
  return () => cancelAnimationFrame(frame);
}
 
// ---------------------------------------------------------------------------
// Streak helpers (localStorage, date-based)
// ---------------------------------------------------------------------------
const STREAK_KEY = "lp_streak";
interface StreakData { lastDate: string; count: number }
 
function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}
 
function loadStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) return JSON.parse(raw) as StreakData;
  } catch {
    // Ignore invalid JSON format from localStorage
  }
  return { lastDate: "", count: 0 };
}
 
function recordStreakActivity(): StreakData {
  const today = getTodayStr();
  const prev = loadStreak();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
 
  let count = 1;
  if (prev.lastDate === today) count = prev.count;
  else if (prev.lastDate === yesterday) count = prev.count + 1;
 
  const next: StreakData = { lastDate: today, count };
  localStorage.setItem(STREAK_KEY, JSON.stringify(next));
  return next;
}
 
// ---------------------------------------------------------------------------
// Persist completed topics to localStorage
// ---------------------------------------------------------------------------
const COMPLETED_KEY = "lp_completed_topics";
 
function loadPersistedTopics(): string[] {
  try {
    const raw = localStorage.getItem(COMPLETED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
 
function persistTopics(topics: string[]) {
  localStorage.setItem(COMPLETED_KEY, JSON.stringify(topics));
}
 
// ---------------------------------------------------------------------------
// DashboardPage
// ---------------------------------------------------------------------------
const DashboardPage = () => {
  const { user, roadmap, completedTopics, toggleTopicComplete } = useAuth();
  const navigate = useNavigate();
 
  // --- Streak (date-based) ---
  const [streak, setStreak] = useState<number>(loadStreak().count);
 
  useEffect(() => {
    const data = recordStreakActivity();
    setStreak(data.count);
  }, []);
 
  // --- Confetti canvas ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevCompleted = useRef(completedTopics.length);
 
  useEffect(() => {
    if (completedTopics.length > prevCompleted.current && canvasRef.current) {
      fireConfetti(canvasRef.current);
    }
    prevCompleted.current = completedTopics.length;
  }, [completedTopics]);
 
  // --- Month filter ---
  const [activeMonth, setActiveMonth] = useState<number | "all">("all");
 
  // --- Search ---
  const [search, setSearch] = useState("");
 
  if (!user) return null;
 
  if (!roadmap || !roadmap.months) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="font-display text-3xl font-bold mb-3">Your journey begins here</h1>
          <p className="text-muted-foreground text-center max-w-sm mb-6">
            Complete the assessment to get your AI-powered personalized learning path.
          </p>
          <Link to="/assessment">
            <Button variant="hero" className="rounded-xl px-8">Take Assessment</Button>
          </Link>
        </motion.div>
      </div>
    );
  }
 
  // --- Derived state ---
  const allTopicsFlattened = roadmap.months.flatMap((m) =>
    m.topics.map((t) => ({ ...t, month: m.month }))
  );
  const totalTopics = allTopicsFlattened.length;
  const completedCount = completedTopics.length;
  // FIX: guard against 0 topics
  const progressPercent = totalTopics === 0 ? 0 : Math.round((completedCount / totalTopics) * 100);
  // FIX: proper next topic — first incomplete in order
  const nextTopic = allTopicsFlattened.find((t) => !completedTopics.includes(t.title));
 
  const monthNumbers = roadmap.months.map((m) => m.month);
 
  // Filter months for roadmap display
  const filteredMonths = roadmap.months
    .filter((m) => activeMonth === "all" || m.month === activeMonth)
    .map((m) => ({
      ...m,
      topics: m.topics.filter(
        (t) =>
          search.trim() === "" ||
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.explanation?.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((m) => m.topics.length > 0);
 
  const stats = [
    { icon: Trophy, label: "Completed", value: `${completedCount}/${totalTopics}`, gradient: "from-indigo-500 to-cyan-500" },
    { icon: Flame, label: "Day Streak", value: `${streak}d`, gradient: "from-orange-500 to-rose-500" },
    { icon: BookOpen, label: "Progress", value: `${progressPercent}%`, gradient: "from-cyan-500 to-blue-500" },
    { icon: MessageSquare, label: "AI Mentor", value: "Chat Now", gradient: "from-blue-500 to-indigo-600", link: "/chat" },
  ];

 
  const isSaturday = new Date().getDay() === 6;

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      {/* Confetti canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ width: "100%", height: "100%" }}
      />
 
      <div className="container mx-auto px-4 max-w-5xl">
        {/* ── Saturday Weekly Test Banner ── */}
        <AnimatePresence>
          {isSaturday && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-cyan-600 to-blue-600 p-[2px] shadow-xl shadow-cyan-500/20">
                <div className="bg-background/95 backdrop-blur-xl rounded-[22px] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0">

                      <Sparkles size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1">Saturday Mastery Test is Live! 🚀</h2>
                      <p className="text-muted-foreground">It's time to validate everything you've learned this week. Ready for the challenge?</p>
                    </div>
                  </div>
                  <Link to="/weekly-test" className="w-full sm:w-auto">
                    <Button variant="hero" size="lg" className="rounded-xl px-10 w-full">
                      Start Test
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="mt-1 text-muted-foreground text-base sm:text-lg">{roadmap.title}</p>
          </div>
          <Link to="/chat" className="shrink-0">
            <Button variant="outline" className="rounded-xl border-2 hover:bg-slate-50 gap-2 w-full sm:w-auto">
              <MessageSquare className="h-4 w-4" /> Message AI Mentor
            </Button>
          </Link>
        </motion.div>
 
        {/* ── Stats Grid ── */}
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 20 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              className="rounded-2xl border bg-card p-4 sm:p-5 shadow-sm group hover:border-primary/40 hover:shadow-md transition-all cursor-pointer"
              onClick={() => s.link && navigate(s.link)}
            >
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient}`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-xl sm:text-2xl font-bold font-display">{s.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
 
        {/* ── Progress Bar ── */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.97 }}
          animate={{ opacity: 1, scaleX: 1 }}
          className="mb-8 rounded-2xl border bg-card p-5 sm:p-6 shadow-sm"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="font-display font-semibold text-sm sm:text-base">Mastery Path Progress</span>
            <span className="text-sm font-bold text-primary tabular-nums">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-3 rounded-full" />
          {totalTopics === 0 && (
            <p className="mt-2 text-xs text-muted-foreground">No topics yet — complete the assessment to begin.</p>
          )}
        </motion.div>
 
        {/* ── Next Topic ── */}
        <AnimatePresence mode="wait">
          {nextTopic && (
            <motion.div
              key={nextTopic.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mb-10 rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-cyan-500/5 to-transparent p-6 sm:p-8 relative overflow-hidden group shadow-lg shadow-primary/5"
            >
              <div className="absolute -top-4 -right-4 opacity-[0.07] group-hover:scale-110 transition-transform duration-500">
                <BookOpen size={160} className="text-primary" />
              </div>
              <div className="relative z-10">
                <div className="mb-2 text-xs font-bold text-primary uppercase tracking-widest">
                  Recommended Next — Month {nextTopic.month}
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold mb-2">{nextTopic.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                  {nextTopic.explanation}
                </p>
                <Link to={`/course/${encodeURIComponent(nextTopic.title)}`}>
                  <Button
                    variant="hero"
                    size="lg"
                    className="mt-5 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.99] transition-all"
                  >
                    Resume Learning <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
 
          {!nextTopic && totalTopics > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 rounded-3xl border-2 border-emerald-200 bg-emerald-50/60 p-6 sm:p-8 text-center"
            >
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="font-display text-xl font-bold text-emerald-700">All topics completed!</h3>
              <p className="text-sm text-emerald-600 mt-1">You've mastered your entire roadmap. Amazing work!</p>
            </motion.div>
          )}
        </AnimatePresence>
 
        {/* ── Roadmap header + filters ── */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold">Your Detailed Roadmap</h2>
            <div className="flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-400 border border-violet-500/20">
              <Sparkles size={10} /> AI Generated
            </div>
          </div>
 
          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search topics…"
              className="w-full rounded-xl border bg-card pl-9 pr-9 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
 
        {/* ── Month filter tabs ── */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveMonth("all")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              activeMonth === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All
          </button>
          {monthNumbers.map((m) => (
            <button
              key={m}
              onClick={() => setActiveMonth(m === activeMonth ? "all" : m)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeMonth === m
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Month {m}
            </button>
          ))}
        </div>
 
        {/* ── Roadmap list ── */}
        <AnimatePresence mode="popLayout">
          {filteredMonths.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center text-muted-foreground"
            >
              No topics match your search.
            </motion.div>
          ) : (
            <div className="space-y-8">
              {filteredMonths.map((month, mIdx) => (
                <motion.div
                  key={month.month}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: mIdx * 0.05 }}
                  className="space-y-3"
                >
                  {/* Month heading */}
                  <div className="flex items-center gap-3 px-1">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {month.month}
                    </div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      Month {month.month} — {month.project?.title}
                    </h3>
                  </div>
 
                  {/* Topics */}
                  <div className="grid gap-3">
                    {month.topics.map((topic, tIdx) => {
                      const done = completedTopics.includes(topic.title);
                      return (
                        <motion.div
                          key={topic.title}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: tIdx * 0.04 }}
                          className={`group flex items-start gap-3 sm:gap-4 rounded-2xl border p-4 sm:p-5 transition-all ${
                            done
                              ? "border-primary/20 bg-primary/5"
                              : "bg-card hover:shadow-md hover:border-primary/30"
                          }`}
                        >
                          {/* Check button */}
                          <button
                            onClick={() => toggleTopicComplete(topic.title)}
                            className="mt-0.5 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full transition-transform active:scale-90"
                            aria-label={done ? "Mark incomplete" : "Mark complete"}
                          >
                            <AnimatePresence mode="wait">
                              {done ? (
                                <motion.div
                                  key="done"
                                  initial={{ scale: 0.5, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.5, opacity: 0 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                >
                                  <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="undone"
                                  initial={{ scale: 0.5, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.5, opacity: 0 }}
                                >
                                  <Circle className="h-6 w-6 sm:h-7 sm:w-7 text-muted-foreground group-hover:text-primary/50 transition-colors" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </button>
 
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <Link to={`/course/${encodeURIComponent(topic.title)}`}>
                              <h3
                                className={`font-display text-base sm:text-lg font-bold hover:text-primary transition-colors truncate ${
                                  done ? "line-through opacity-50" : ""
                                }`}
                              >
                                {topic.title}
                              </h3>
                            </Link>
                            <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                              {topic.explanation}
                            </p>
                          </div>
 
                          {/* Arrow */}
                          <Link
                            to={`/course/${encodeURIComponent(topic.title)}`}
                            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                          >
                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                              <ChevronRight size={16} />
                            </Button>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
 
export default DashboardPage;