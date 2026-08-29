import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { roadmapService } from '../services/api';
import { 
  Trophy, BrainCircuit, ChevronRight, ChevronLeft, 
  Loader2, CheckCircle2, XCircle, Sparkles, 
  RotateCcw, Home, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';

interface WeeklyTest {
  week: number;
  title: string;
  questions: { question: string; options: string[]; answer: string }[];
}

const WeeklyTestPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<WeeklyTest | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const data = await roadmapService.getWeeklyTest();
        setTest(data);
      } catch (error) {
        console.error("Failed to fetch weekly test", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, []);

  const handleAnswer = (option: string) => {
    if (showResult) return;
    setSelectedAnswer(option);
    setShowResult(true);
    if (option === test.questions[currentQ].answer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ < test.questions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizDone(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground transition-colors duration-300">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mb-4" />
        <h2 className="text-xl font-bold">Generating Weekly Test...</h2>
        <p className="text-muted-foreground">Gemini is analyzing your week's progress</p>
      </div>
    );
  }

  if (!test || !test.questions) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground transition-colors duration-300 p-6 text-center">
        <div className="mb-6 p-4 rounded-full bg-red-500/10 text-red-500">
          <XCircle size={48} />
        </div>
        <h2 className="text-2xl font-bold mb-2">No test available</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          We couldn't generate a test for you right now. This might be because your roadmap hasn't been generated yet or it's not Saturday!
        </p>
        <Link to="/dashboard">
          <Button variant="default">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQ];

  return (
    <div className="min-h-screen bg-background bg-grid-pattern bg-radial-gradient text-foreground transition-colors duration-300 pt-24 pb-12 px-6 relative overflow-hidden">
      {/* Background Animated Ambient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="animate-orb-1 absolute top-[10%] left-[-5%] w-[550px] h-[550px] rounded-full bg-violet-500/10 blur-[140px]" />
        <div className="animate-orb-2 absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[140px]" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        
        <AnimatePresence mode="wait">
          {!quizDone ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-1">{test.title}</h1>
                  <p className="text-violet-400 font-medium">Question {currentQ + 1} of {test.questions.length}</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                  <BrainCircuit size={24} />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-white/5 rounded-full mb-12 overflow-hidden">
                <motion.div 
                  className="h-full bg-violet-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQ + 1) / test.questions.length) * 100}%` }}
                />
              </div>

              {/* Question Card */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Sparkles size={120} className="text-violet-500" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold mb-8 leading-relaxed">
                  {currentQuestion.question}
                </h3>

                <div className="grid gap-4">
                  {currentQuestion.options.map((opt: string, idx: number) => {
                    const isCorrect = opt === currentQuestion.answer;
                    const isSelected = opt === selectedAnswer;
                    
                    let bgClass = "bg-white/5 border-white/10 hover:bg-white/10 hover:border-violet-500/30";
                    if (showResult) {
                      if (isCorrect) bgClass = "bg-emerald-500/20 border-emerald-500/50 text-emerald-400";
                      else if (isSelected) bgClass = "bg-red-500/20 border-red-500/50 text-red-400";
                      else bgClass = "bg-white/5 border-white/10 opacity-40";
                    } else if (isSelected) {
                      bgClass = "bg-violet-500/20 border-violet-500/50 text-violet-400";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(opt)}
                        disabled={showResult}
                        className={`w-full p-5 text-left rounded-2xl border-2 transition-all flex items-center gap-4 group ${bgClass}`}
                      >
                        <span className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold border ${
                          showResult && isCorrect ? 'bg-emerald-500 border-emerald-400 text-white' : 
                          showResult && isSelected ? 'bg-red-500 border-red-400 text-white' : 
                          isSelected ? 'bg-violet-500 border-violet-400 text-white' : 'bg-white/10 border-white/10'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="font-medium text-lg flex-1">{opt}</span>
                        {showResult && isCorrect && <CheckCircle2 className="text-emerald-500" size={24} />}
                        {showResult && isSelected && !isCorrect && <XCircle className="text-red-500" size={24} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {showResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <Button 
                    variant="hero" 
                    size="lg" 
                    onClick={nextQuestion}
                    className="rounded-2xl px-10 group"
                  >
                    {currentQ < test.questions.length - 1 ? "Next Question" : "See Final Score"}
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="mb-8 inline-flex p-6 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
                <Trophy size={80} />
              </div>
              
              <h2 className="text-4xl font-bold mb-2 text-foreground">Test Completed!</h2>
              <p className="text-muted-foreground mb-12 text-lg">You've finished your Week {test.week} assessment</p>

              <div className="grid grid-cols-2 gap-6 mb-12 max-w-md mx-auto">
                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                  <div className="text-4xl font-black text-gradient mb-1">{score}/{test.questions.length}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Correct Answers</div>
                </div>
                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                  <div className="text-4xl font-black text-gradient mb-1">{Math.round((score / test.questions.length) * 100)}%</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Mastery Level</div>
                </div>
              </div>

              <p className="text-lg text-foreground/80 mb-12 max-w-lg mx-auto">
                {score === test.questions.length 
                  ? "Flawless! You've perfectly mastered this week's concepts. Keep up the amazing work!" 
                  : score >= test.questions.length * 0.7 
                    ? "Great job! You have a solid grasp of the material. Review the topics you missed to reach 100%."
                    : "Good effort! We recommend going back through the notes for this week to strengthen your foundation."}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dashboard">
                  <Button variant="hero" className="rounded-2xl px-8 w-full sm:w-auto h-14 text-lg">
                    <Home className="mr-2 h-5 w-5" /> Back to Dashboard
                  </Button>
                </Link>
                <Link to="/chat">
                  <Button variant="outline" className="rounded-2xl px-8 border-2 w-full sm:w-auto h-14 text-lg">
                    <MessageSquare className="mr-2 h-5 w-5" /> Discuss Results with AI
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WeeklyTestPage;
