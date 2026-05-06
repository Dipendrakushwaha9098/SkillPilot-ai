import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { roadmapService } from '../services/api';
import {
  Sparkles, Loader2, ChevronRight, ChevronLeft,
  Globe, Bot, BarChart2, Smartphone, Shield, Cloud,
  Check, Clock, Flame, Zap, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';

/* ================= TYPES ================= */
type FormDataType = {
  skillLevel: string;
  interests: string[];
  goals: string;
  dailyStudyTime: number;
};

type StepDotProps = {
  active: boolean;
  done: boolean;
};

/* ================= DATA ================= */
const INTERESTS = [
  { label: 'Web Development', icon: Globe, color: '#6EE7B7' },
  { label: 'AI & Machine Learning', icon: Bot, color: '#A78BFA' },
  { label: 'Data Science', icon: BarChart2, color: '#60A5FA' },
  { label: 'App Development', icon: Smartphone, color: '#FCD34D' },
  { label: 'Cybersecurity', icon: Shield, color: '#F87171' },
  { label: 'Cloud Computing', icon: Cloud, color: '#34D399' },
];

const LEVELS = [
  { id: 'Beginner', icon: Flame, desc: 'Starting from absolute zero.', tag: 'Fresh Start' },
  { id: 'Intermediate', icon: Zap, desc: 'You know the basics.', tag: 'Building Up' },
  { id: 'Advanced', icon: Star, desc: 'Expert level concepts.', tag: 'Elite Track' },
];

/* ================= COMPONENTS ================= */
const StepDot: React.FC<StepDotProps> = ({ active, done }) => (
  <div
    className={`h-2 flex-1 rounded-full transition-all duration-500 ${
      done ? 'bg-emerald-400' : active ? 'bg-indigo-400' : 'bg-white/10'
    }`}
  />
);

const LOADING_MSGS = [
  'Mapping your skill landscape…',
  'Selecting resources…',
  'Sequencing milestones…',
  'Building your roadmap…',
];

/* ================= MAIN ================= */
const AssessmentPage: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMsg, setLoadingMsg] = useState<number>(0);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizLoading, setQuizLoading] = useState<boolean>(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [userResults, setUserResults] = useState<any[]>([]);

  const [formData, setFormData] = useState<FormDataType>({
    skillLevel: 'Beginner',
    interests: [],
    goals: '',
    dailyStudyTime: 2,
  });

  const { fetchRoadmap } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => {
      setLoadingMsg((p) => (p + 1) % LOADING_MSGS.length);
    }, 1800);
    return () => clearInterval(id);
  }, [loading]);

  /* ================= FUNCTIONS ================= */
  const toggleInterest = (label: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(label)
        ? prev.interests.filter((i) => i !== label)
        : [...prev.interests, label],
    }));
  };

  const startQuiz = async () => {
    setQuizLoading(true);
    setStep(3);
    try {
      const questions = await roadmapService.generateAssessment(formData.skillLevel, formData.interests);
      setQuizQuestions(questions);
    } catch (e) {
      console.error(e);
      // Fallback or move to next step if quiz fails
      setStep(4);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleQuizAnswer = (answer: string) => {
    const question = quizQuestions[currentQuizIndex];
    const isCorrect = answer === question.answer;
    
    const result = {
      question: question.question,
      answer,
      correct: isCorrect
    };

    const newAnswers = [...userAnswers, answer]; // Note: userAnswers currently only stores the string answer, I should change it to store the full result if I want.
    // Actually let's just keep a separate state for results if needed, or update userAnswers to store objects.
    
    // Let's update userAnswers to be an array of objects
    setUserResults(prev => [...prev, result]);
    
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      setStep(4);
    }
  };

  const handleSubmit = async () => {
    if (!formData.goals.trim() || formData.interests.length === 0) {
      alert("Please complete all fields");
      return;
    }

    setLoading(true);
    try {
      const roadmapData = {
        ...formData,
        assessmentResults: userResults
      };
      await roadmapService.generate(roadmapData);
      await fetchRoadmap();
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const estimateTime = (hours: number) => {
    if (hours >= 6) return '2–3 months';
    if (hours >= 3) return '4–6 months';
    return '7–10 months';
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white relative overflow-hidden">
        {/* Animated Background Glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full"
        />

        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-24 h-24 mb-8 rounded-3xl bg-gradient-to-br from-indigo-500 via-cyan-500 to-blue-500 p-[2px]"
          >
            <div className="w-full h-full bg-black rounded-[22px] flex items-center justify-center">
              <Bot size={48} className="text-white" />
            </div>
          </motion.div>

          <h2 className="text-3xl font-bold mb-3 tracking-tight text-gradient">
            AI is Crafting Your Path
          </h2>
          
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingMsg}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-indigo-300 font-medium text-lg"
            >
              {LOADING_MSGS[loadingMsg]}
            </motion.p>
          </AnimatePresence>

          <div className="mt-12 flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 bg-indigo-400 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-center mb-6">
          Build Your Learning Path
        </h1>

        <div className="flex gap-2 mb-6">
          {[1,2,3,4,5].map(i => (
            <StepDot key={i} active={step === i} done={step > i} />
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-3"
          >
            <h2 className="text-xl font-bold mb-6 text-center text-white/80">Select your current level</h2>
            <div className="grid gap-3">
              {LEVELS.map(({ id, desc, tag, icon: Icon }) => (
                <button
                  key={id}
                  className={`group relative w-full p-5 text-left bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-indigo-500/50 transition-all duration-300 ${
                    formData.skillLevel === id ? 'border-indigo-500 bg-indigo-500/10' : ''
                  }`}
                  onClick={() => {
                    setFormData(p => ({ ...p, skillLevel: id }));
                    setStep(2);
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/40 font-bold uppercase tracking-wider">{tag}</span>
                      </div>
                      <p className="text-sm text-white/50">{desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl font-bold mb-6 text-center text-white/80">What are you interested in?</h2>
            <div className="grid grid-cols-2 gap-3">
              {INTERESTS.map(({ label, icon: Icon, color }) => {
                const selected = formData.interests.includes(label);
                return (
                  <button
                    key={label}
                    className={`group relative flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-300 ${
                      selected
                        ? 'bg-indigo-500/20 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                    onClick={() => toggleInterest(label)}
                  >
                    <div 
                      className="p-3 rounded-xl bg-white/5 text-white transition-transform group-hover:scale-110"
                      style={{ color: selected ? color : 'inherit' }}
                    >
                      <Icon size={24} />
                    </div>
                    <span className={`text-sm font-semibold text-center ${selected ? 'text-white' : 'text-white/60'}`}>
                      {label}
                    </span>
                    {selected && (
                      <div className="absolute top-2 right-2">
                        <Check size={14} className="text-indigo-400" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={() => setStep(1)} className="text-white/40 hover:text-white">
                <ChevronLeft size={18} className="mr-1" /> Back
              </Button>
              <Button 
                variant="hero" 
                onClick={startQuiz}
                disabled={formData.interests.length === 0}
                className="rounded-xl px-8"
              >
                Next <ChevronRight size={18} className="ml-1" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 3 (NEW): AI Quiz */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {quizLoading ? (
              <div className="py-20 text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-indigo-500 mb-4" />
                <h2 className="text-xl font-bold">Generating Skill Test...</h2>
                <p className="text-white/40 text-sm">Gemini is preparing questions for {formData.interests.join(", ")}</p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-2 text-center text-white/80">Skill Assessment</h2>
                <p className="text-white/40 text-sm text-center mb-8">Question {currentQuizIndex + 1} of {quizQuestions.length}</p>
                
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-6">{quizQuestions[currentQuizIndex]?.question}</h3>
                  <div className="grid gap-3">
                    {quizQuestions[currentQuizIndex]?.options.map((opt: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => handleQuizAnswer(opt)}
                        className="w-full p-4 text-left rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl font-bold mb-6 text-center text-white/80">What's your ultimate goal?</h2>
            <div className="relative group">
              <textarea
                className="w-full min-h-[160px] p-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
                placeholder="e.g. I want to become a full-stack developer and build my own SaaS product within 6 months."
                value={formData.goals}
                onChange={(e) =>
                  setFormData(p => ({ ...p, goals: e.target.value }))
                }
              />
              <div className="absolute bottom-4 right-4 text-[10px] text-white/20 font-bold uppercase tracking-wider">
                Be as specific as possible
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={() => setStep(2)} className="text-white/40 hover:text-white">
                <ChevronLeft size={18} className="mr-1" /> Back
              </Button>
              <Button 
                variant="hero" 
                onClick={() => setStep(5)}
                disabled={!formData.goals.trim()}
                className="rounded-xl px-8"
              >
                Next <ChevronRight size={18} className="ml-1" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center"
          >
            <h2 className="text-xl font-bold mb-2 text-white/80">Daily Commitment</h2>
            <p className="text-white/40 text-sm mb-10">How many hours can you dedicate each day?</p>

            <div className="flex items-center justify-center gap-8 mb-12">
              <button 
                onClick={() => setFormData(p => ({ ...p, dailyStudyTime: Math.max(1, p.dailyStudyTime - 1) }))}
                className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl hover:bg-white/10 hover:border-white/20 transition-all"
              >
                −
              </button>

              <div className="flex flex-col items-center">
                <motion.span 
                  key={formData.dailyStudyTime}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-6xl font-bold text-gradient"
                >
                  {formData.dailyStudyTime}
                </motion.span>
                <span className="text-white/40 font-bold uppercase tracking-widest text-[10px] mt-2">Hours</span>
              </div>

              <button 
                onClick={() => setFormData(p => ({ ...p, dailyStudyTime: Math.min(12, p.dailyStudyTime + 1) }))}
                className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl hover:bg-white/10 hover:border-white/20 transition-all"
              >
                +
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 mb-10">
              <p className="text-sm text-indigo-300">
                <Clock className="inline mr-2 h-4 w-4 opacity-50" />
                Estimated time to mastery: <span className="font-bold">{estimateTime(formData.dailyStudyTime)}</span>
              </p>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(4)} className="text-white/40 hover:text-white">
                <ChevronLeft size={18} className="mr-1" /> Back
              </Button>
              <Button 
                variant="hero" 
                onClick={handleSubmit}
                className="rounded-xl px-10 py-6 text-lg group"
              >
                <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Generate My Plan
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AssessmentPage;