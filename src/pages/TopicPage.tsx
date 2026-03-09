import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, ExternalLink, Code2, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const TopicPage = () => {
  const { id } = useParams();
  const { roadmap, completedTopics, toggleTopicComplete } = useAuth();

  if (!roadmap || !id) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold">Topic not found</h1>
          <Link to="/dashboard"><Button variant="hero" className="mt-4">Back to Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  const topic = roadmap.topics.find(t => t.id === id);
  if (!topic) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold">Topic not found</h1>
          <Link to="/dashboard"><Button variant="hero" className="mt-4">Back to Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  const done = completedTopics.includes(topic.id);

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto max-w-3xl px-4">
        <Link to="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Week {topic.week}</span>
            {topic.project && (
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                Project: {topic.project}
              </span>
            )}
          </div>

          <h1 className="mb-4 font-display text-4xl font-bold">{topic.title}</h1>
          <p className="mb-8 text-lg text-muted-foreground">{topic.description}</p>

          {/* Resources */}
          <div className="mb-6 rounded-2xl border bg-card p-6 shadow-card">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
              <BookOpen className="h-5 w-5 text-primary" /> Resources
            </h2>
            <ul className="space-y-2">
              {topic.resources.map(r => (
                <li key={r} className="flex items-center gap-2 text-sm">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exercises */}
          <div className="mb-6 rounded-2xl border bg-card p-6 shadow-card">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
              <Code2 className="h-5 w-5 text-accent" /> Practice Exercises
            </h2>
            <ul className="space-y-2">
              {topic.exercises.map(e => (
                <li key={e} className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Project */}
          {topic.project && (
            <div className="mb-8 rounded-2xl border-2 border-primary/20 bg-primary/5 p-6">
              <h2 className="mb-2 font-display text-lg font-semibold">🚀 Milestone Project</h2>
              <p className="text-muted-foreground">{topic.project}</p>
            </div>
          )}

          <Button
            variant={done ? "outline" : "hero"}
            size="lg"
            className="w-full"
            onClick={() => toggleTopicComplete(topic.id)}
          >
            {done ? (
              <><CheckCircle2 className="mr-2 h-5 w-5" /> Completed — Mark Incomplete</>
            ) : (
              <><CheckCircle2 className="mr-2 h-5 w-5" /> Mark as Complete</>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default TopicPage;
