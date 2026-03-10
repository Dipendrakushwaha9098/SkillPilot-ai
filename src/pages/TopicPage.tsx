import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, ExternalLink, Code2, BookOpen, FileText, BrainCircuit, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TopicPage = () => {
  const { id } = useParams();
  const { roadmap, completedTopics, toggleTopicComplete } = useAuth();
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

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
  const quiz = topic.quizzes || [];
  const currentQuestion = quiz[currentQ];

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setSelectedAnswer(idx);
    setShowResult(true);
    if (idx === currentQuestion.correctAnswer) {
      setScore(s => s + 1);
    }
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

  const resetQuiz = () => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizDone(false);
    setQuizStarted(false);
  };

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

          {/* Study Notes */}
          {topic.notes && topic.notes.length > 0 && (
            <div className="mb-6 rounded-2xl border bg-card p-6 shadow-card">
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
                <FileText className="h-5 w-5 text-primary" /> Study Notes
              </h2>
              <div className="space-y-4">
                {topic.notes.map((note, i) => (
                  <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                    {note}
                  </p>
                ))}
              </div>
            </div>
          )}

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

          {/* Quiz Section */}
          {quiz.length > 0 && (
            <div className="mb-6 rounded-2xl border-2 border-accent/20 bg-accent/5 p-6">
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
                <BrainCircuit className="h-5 w-5 text-accent" /> Knowledge Quiz
              </h2>

              {!quizStarted ? (
                <div className="text-center py-4">
                  <p className="mb-4 text-muted-foreground">
                    Test your understanding with {quiz.length} questions
                  </p>
                  <Button variant="hero" onClick={() => setQuizStarted(true)}>
                    Start Quiz
                  </Button>
                </div>
              ) : quizDone ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="mb-2 text-5xl">
                    {score === quiz.length ? "🎉" : score >= quiz.length / 2 ? "👍" : "📚"}
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-1">
                    {score}/{quiz.length} Correct
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {score === quiz.length
                      ? "Perfect score! You've mastered this topic."
                      : score >= quiz.length / 2
                      ? "Good job! Review the notes for topics you missed."
                      : "Keep studying! Review the notes and try again."}
                  </p>
                  <Button variant="outline" onClick={resetQuiz}>
                    Retake Quiz
                  </Button>
                </motion.div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQ}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="mb-1 text-xs font-medium text-muted-foreground">
                      Question {currentQ + 1} of {quiz.length}
                    </div>
                    <h3 className="mb-4 font-display text-base font-semibold">
                      {currentQuestion.question}
                    </h3>
                    <div className="space-y-2">
                      {currentQuestion.options.map((opt, idx) => {
                        const isCorrect = idx === currentQuestion.correctAnswer;
                        const isSelected = idx === selectedAnswer;
                        let borderClass = "border-border hover:border-accent/40";
                        if (showResult) {
                          if (isCorrect) borderClass = "border-primary bg-primary/10";
                          else if (isSelected) borderClass = "border-destructive bg-destructive/10";
                        } else if (isSelected) {
                          borderClass = "border-accent bg-accent/5";
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            disabled={showResult}
                            className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left text-sm transition-all ${borderClass} disabled:cursor-default`}
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium">
                              {showResult && isCorrect ? (
                                <Check className="h-3.5 w-3.5 text-primary" />
                              ) : showResult && isSelected ? (
                                <X className="h-3.5 w-3.5 text-destructive" />
                              ) : (
                                String.fromCharCode(65 + idx)
                              )}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                    {showResult && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex justify-end">
                        <Button variant="hero" size="sm" onClick={nextQuestion}>
                          {currentQ < quiz.length - 1 ? "Next Question" : "See Results"}
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          )}

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
