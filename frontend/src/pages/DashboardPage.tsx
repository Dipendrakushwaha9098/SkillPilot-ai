import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, BookOpen, MessageSquare, Trophy, Flame, ArrowRight } from "lucide-react";

const DashboardPage = () => {
  const { user, roadmap, completedTopics, toggleTopicComplete } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  if (!roadmap || !roadmap.months) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-16">
        <h1 className="font-display text-2xl font-bold">Your journey begins here</h1>
        <p className="text-muted-foreground text-center max-w-sm">Complete the assessment to get your AI-powered personalized learning path.</p>
        <Link to="/assessment"><Button variant="hero" className="rounded-xl px-8">Take Assessment</Button></Link>
      </div>
    );
  }

  // Flatten topics from all months for calculations
  const allTopicsFlattened = roadmap.months.flatMap(m => m.topics.map(t => ({...t, month: m.month})));
  const totalTopics = allTopicsFlattened.length;
  const completedCount = completedTopics.length;
  const progressPercent = Math.round((completedCount / totalTopics) * 100);
  const nextTopic = allTopicsFlattened.find(t => !completedTopics.includes(t.title));
  const streak = completedCount; // Placeholder for streak logic

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tight">Welcome back, {user.name}! 👋</h1>
            <p className="mt-2 text-muted-foreground text-lg">{roadmap.title}</p>
          </div>
          <Link to="/chat">
            <Button variant="outline" className="rounded-xl border-2 hover:bg-slate-50 gap-2">
              <MessageSquare className="h-4 w-4" /> Message AI Mentor
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          {[
            { icon: Trophy, label: "Completed", value: `${completedCount}/${totalTopics}`, color: "bg-gradient-primary" },
            { icon: Flame, label: "Streak", value: `${streak} topics`, color: "bg-gradient-accent" },
            { icon: BookOpen, label: "Progress", value: `${progressPercent}%`, color: "bg-gradient-primary" },
            { icon: MessageSquare, label: "Mentorship", value: "Chat Now", color: "bg-gradient-accent", link: "/chat" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border bg-card p-5 shadow-card group hover:border-primary/50 transition-colors"
              onClick={() => s.link && navigate(s.link)}
              style={{ cursor: s.link ? "pointer" : "default" }}
            >
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="text-2xl font-bold font-display">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mb-8 rounded-2xl border bg-card p-6 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-display font-semibold">Mastery Path Progress</span>
            <span className="text-sm font-bold text-primary">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-4 rounded-full" />
        </div>

        {/* Next Topic */}
        {nextTopic && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 rounded-3xl border-2 border-primary/20 bg-primary/5 p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <BookOpen size={120} className="text-primary" />
            </div>
            <div className="relative z-10">
                <div className="mb-2 text-sm font-bold text-primary uppercase tracking-widest">Recommended Next Step — Month {nextTopic.month}</div>
                <h3 className="font-display text-2xl font-bold mb-2">{nextTopic.title}</h3>
                <p className="text-muted-foreground max-w-2xl">{nextTopic.explanation}</p>
                <Link to={`/course/${encodeURIComponent(nextTopic.title)}`}>
                  <Button variant="hero" size="lg" className="mt-6 rounded-xl shadow-lg ring-offset-2 hover:ring-2 hover:ring-primary/20 transition-all">
                    Resume Learning <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
            </div>
          </motion.div>
        )}

        {/* Roadmap */}
        <h2 className="mb-6 font-display text-2xl font-bold">Your Detailed Roadmap</h2>
        <div className="space-y-8">
          {roadmap.months.map((month, mIdx) => (
             <div key={mIdx} className="space-y-4">
                <h3 className="text-lg font-bold text-muted-foreground uppercase tracking-widest px-2">Month {month.month} — {month.project.title}</h3>
                <div className="grid gap-4">
                    {month.topics.map((topic, tIdx) => {
                        const done = completedTopics.includes(topic.title);
                        return (
                        <motion.div
                            key={tIdx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: tIdx * 0.05 }}
                            className={`group flex items-start gap-4 rounded-2xl border p-5 transition-all ${
                            done ? "border-primary/20 bg-primary/5 shadow-none" : "bg-card hover:shadow-card hover:border-primary/30"
                            }`}
                        >
                            <button onClick={() => toggleTopicComplete(topic.title)} className="mt-1 shrink-0">
                            {done ? (
                                <CheckCircle2 className="h-7 w-7 text-primary" />
                            ) : (
                                <Circle className="h-7 w-7 text-muted-foreground group-hover:text-primary/50 transition-colors" />
                            )}
                            </button>
                            <div className="flex-1">
                            <Link to={`/course/${encodeURIComponent(topic.title)}`}>
                                <h3 className={`font-display text-lg font-bold hover:text-primary transition-colors ${done ? "line-through opacity-60" : ""}`}>
                                {topic.title}
                                </h3>
                            </Link>
                            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{topic.explanation}</p>
                            </div>
                            <Link to={`/course/${encodeURIComponent(topic.title)}`} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <ArrowRight size={18} />
                                </Button>
                            </Link>
                        </motion.div>
                        );
                    })}
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
