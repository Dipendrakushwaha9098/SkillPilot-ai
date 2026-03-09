import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Brain, Code, Database, Smartphone, Bot, Briefcase, Rocket, Clock } from "lucide-react";
import { toast } from "sonner";

const steps = [
  {
    question: "What's your current skill level?",
    key: "skillLevel",
    options: [
      { value: "Beginner", label: "Beginner", desc: "I'm just starting out", icon: "🌱" },
      { value: "Intermediate", label: "Intermediate", desc: "I know the basics", icon: "🌿" },
      { value: "Advanced", label: "Advanced", desc: "I have solid experience", icon: "🌳" },
    ],
  },
  {
    question: "What field interests you most?",
    key: "interest",
    options: [
      { value: "Web Development", label: "Web Development", desc: "Websites & web apps", icon: "🌐" },
      { value: "AI", label: "Artificial Intelligence", desc: "ML, deep learning, NLP", icon: "🤖" },
      { value: "Data Science", label: "Data Science", desc: "Analysis & visualization", icon: "📊" },
      { value: "App Development", label: "App Development", desc: "Mobile applications", icon: "📱" },
    ],
  },
  {
    question: "What's your learning goal?",
    key: "goal",
    options: [
      { value: "Job", label: "Get a Job", desc: "Land a full-time position", icon: "💼" },
      { value: "Freelancing", label: "Freelancing", desc: "Work independently", icon: "🚀" },
      { value: "Startup", label: "Build a Startup", desc: "Create my own product", icon: "💡" },
    ],
  },
  {
    question: "How much time can you study daily?",
    key: "dailyTime",
    options: [
      { value: "1-2 hours", label: "1-2 Hours", desc: "Casual learning pace", icon: "⏰" },
      { value: "3-4 hours", label: "3-4 Hours", desc: "Moderate commitment", icon: "🕐" },
      { value: "5+ hours", label: "5+ Hours", desc: "Full-time learning", icon: "🔥" },
    ],
  },
];

const AssessmentPage = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { setAssessment, generateRoadmap } = useAuth();
  const navigate = useNavigate();

  const current = steps[step];
  const selected = answers[current.key];

  const selectOption = (value: string) => {
    setAnswers(prev => ({ ...prev, [current.key]: value }));
  };

  const next = () => {
    if (!selected) { toast.error("Please select an option"); return; }
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      const assessment = {
        skillLevel: answers.skillLevel,
        interest: answers.interest,
        goal: answers.goal,
        dailyTime: answers.dailyTime,
      };
      setAssessment(assessment);
      generateRoadmap(assessment);
      toast.success("Your roadmap is ready!");
      navigate("/dashboard");
    }
  };

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 pt-16">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
            <span>Step {step + 1} of {steps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full bg-gradient-primary"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="mb-8 text-center font-display text-3xl font-bold">{current.question}</h1>

            <div className="grid gap-4 sm:grid-cols-2">
              {current.options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => selectOption(opt.value)}
                  className={`group rounded-2xl border-2 p-5 text-left transition-all ${
                    selected === opt.value
                      ? "border-primary bg-primary/5 shadow-elevated"
                      : "border-border bg-card hover:border-primary/30 hover:shadow-card"
                  }`}
                >
                  <div className="mb-2 text-3xl">{opt.icon}</div>
                  <div className="font-display font-semibold">{opt.label}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{opt.desc}</div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button variant="hero" onClick={next}>
            {step === steps.length - 1 ? "Generate Roadmap" : "Continue"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;
