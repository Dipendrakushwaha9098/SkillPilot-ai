import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, BookOpen, MessageSquare, Trophy, Flame, ArrowRight } from "lucide-react";
import { useEffect } from "react";

const DashboardPage = () => {
  const { user, roadmap, completedTopics, toggleTopicComplete } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  if (!roadmap) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-16">
        <h1 className="font-display text-2xl font-bold">No roadmap yet</h1>
        <p className="text-muted-foreground">Complete the assessment to get your personalized learning path.</p>
        <Link to="/assessment"><Button variant="hero">Take Assessment</Button></Link>
      </div>
    );
  }

  const totalTopics = roadmap.topics.length;
  const completedCount = completedTopics.length;
  const progressPercent = Math.round((completedCount / totalTopics) * 100);
  const nextTopic = roadmap.topics.find(t => !completedTopics.includes(t.id));
  const streak = Math.min(completedCount, 7);

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Welcome back, {user.name}! 👋</h1>
          <p className="mt-1 text-muted-foreground">{roadmap.title} • {roadmap.duration}</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          {[
            { icon: Trophy, label: "Completed", value: `${completedCount}/${totalTopics}`, color: "bg-gradient-primary" },
            { icon: Flame, label: "Streak", value: `${streak} days`, color: "bg-gradient-accent" },
            { icon: BookOpen, label: "Progress", value: `${progressPercent}%`, color: "bg-gradient-primary" },
            { icon: MessageSquare, label: "AI Chats", value: "Ask AI", color: "bg-gradient-accent", link: "/chat" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border bg-card p-5 shadow-card"
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
            <span className="font-display font-semibold">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </div>

        {/* Next Topic */}
        {nextTopic && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl border-2 border-primary/20 bg-primary/5 p-6"
          >
            <div className="mb-1 text-sm font-medium text-primary">Up Next — Week {nextTopic.week}</div>
            <h3 className="font-display text-xl font-bold">{nextTopic.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{nextTopic.description}</p>
            <Link to={`/topic/${nextTopic.id}`}>
              <Button variant="hero" size="sm" className="mt-4">
                Start Learning <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Roadmap */}
        <h2 className="mb-4 font-display text-xl font-bold">Your Learning Roadmap</h2>
        <div className="space-y-3">
          {roadmap.topics.map((topic, i) => {
            const done = completedTopics.includes(topic.id);
            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`group flex items-start gap-4 rounded-xl border p-4 transition-all ${
                  done ? "border-primary/30 bg-primary/5" : "bg-card hover:shadow-card"
                }`}
              >
                <button onClick={() => toggleTopicComplete(topic.id)} className="mt-1 shrink-0">
                  {done ? (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground group-hover:text-primary/50" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Week {topic.week}</span>
                    {topic.project && (
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                        Project
                      </span>
                    )}
                  </div>
                  <Link to={`/topic/${topic.id}`}>
                    <h3 className={`font-display font-semibold hover:text-primary ${done ? "line-through opacity-60" : ""}`}>
                      {topic.title}
                    </h3>
                  </Link>
                  <p className="mt-0.5 text-sm text-muted-foreground">{topic.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
