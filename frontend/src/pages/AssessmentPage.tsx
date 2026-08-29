import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { roadmapService } from '../services/api';
import {
  Sparkles, Loader2, ChevronRight, ChevronLeft,
  Globe, Bot, BarChart2, Smartphone, Shield, Cloud,
  Check, Clock, Flame, Zap, Star, Code2, Server, Database,
  Terminal, Layers, Cpu, GitBranch, Plus, Trophy, BookOpen,
  Award, Target, Calculator, Atom, Dna, TrendingUp, DollarSign,
  LineChart, Briefcase, Scale, Landmark, Brain, MessageSquare,
  ShieldCheck, Binary, Compass, HeartPulse
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from '../components/ui/sonner';

/* ================= TYPES ================= */
type FormDataType = {
  domainId: string;
  stackCategory: string;
  skillLevel: string;
  interests: string[];
  customSubject: string;
  goals: string;
  dailyStudyTime: number;
};

type StepDotProps = {
  active: boolean;
  done: boolean;
};

/* ================= DATA ================= */
const DOMAIN_CATEGORIES = [
  {
    id: 'Competitive Exams',
    title: 'Competitive & Entrance Exams',
    icon: Trophy,
    tag: 'Rank & Admission',
    desc: 'JEE Main/Adv, NEET, UPSC, GATE, CAT, SAT, GRE, MCAT, GMAT, USMLE, SSC, Banking.',
    color: '#F59E0B',
    tracks: [
      { id: 'JEE Main & Advanced (Physics, Chemistry, Math)', icon: Target, desc: 'Engineering Entrance — Kinematics, Calculus, Organic Chemistry, Electromagnetism.', tag: 'Engineering' },
      { id: 'NEET UG / PG (Biology, Chemistry, Physics)', icon: HeartPulse, desc: 'Medical Entrance — Human Physiology, Genetics, Organic Chemistry, Botany, Zoology.', tag: 'Medical' },
      { id: 'UPSC Civil Services (IAS / IPS / IFS)', icon: Shield, desc: 'General Studies, Polity & Constitution, Indian History, Economy, Geography, Ethics.', tag: 'Civil Services' },
      { id: 'GATE (Graduate Aptitude Test in Engineering)', icon: Cpu, desc: 'CS, EC, EE, ME, CE core engineering concepts, formulas & problem solving.', tag: 'Graduate Tech' },
      { id: 'CAT / GMAT / GRE (MBA & Master Entrance)', icon: BarChart2, desc: 'Quantitative Aptitude, Data Interpretation, Verbal Reasoning, Analytical Writing.', tag: 'Management' },
      { id: 'SAT / ACT / MCAT / LSAT (Global Entrance)', icon: Globe, desc: 'US College Entrance, Pre-Med MCAT preparation & Pre-Law LSAT reasoning.', tag: 'Global Study' },
    ],
    topicModules: [
      { label: 'JEE Physics (Mechanics & Electrodynamics)', icon: Target },
      { label: 'JEE Chemistry (Organic & Physical)', icon: Flame },
      { label: 'JEE Mathematics (Calculus & Vectors)', icon: Binary },
      { label: 'NEET Biology (Genetics & Physiology)', icon: Dna },
      { label: 'UPSC Polity & Governance', icon: Landmark },
      { label: 'UPSC Modern Indian History & Economy', icon: Scale },
      { label: 'GATE Data Structures & Algorithms', icon: Code2 },
      { label: 'CAT Quantitative Aptitude & DI', icon: Calculator },
    ]
  },
  {
    id: 'School & Boards',
    title: 'School & College Board Exams',
    icon: BookOpen,
    tag: 'K-12 & Academics',
    desc: 'CBSE, ICSE, State Boards, AP, IB, Class 10/12 & University Subjects.',
    color: '#10B981',
    tracks: [
      { id: 'CBSE / ICSE Class 12 Science (PCM / PCB)', icon: Award, desc: 'Board exam mastery in Physics, Chemistry, Math, and Biology.', tag: 'Class 12' },
      { id: 'CBSE / ICSE Class 10 All Subjects', icon: BookOpen, desc: 'Board prep for Science, Math, Social Science, English, Hindi.', tag: 'Class 10' },
      { id: 'Commerce & Accountancy (Class 11/12 & College)', icon: Calculator, desc: 'Financial Accounting, Business Studies, Micro & Macro Economics.', tag: 'Commerce' },
      { id: 'AP / IB International Diploma Curriculum', icon: Globe, desc: 'Advanced Placement (AP Physics, Calc, Bio) & IB Diploma subjects.', tag: 'International' },
    ],
    topicModules: [
      { label: 'Class 12 Physics (Electrostatics & Optics)', icon: Compass },
      { label: 'Class 12 Organic Chemistry', icon: Flame },
      { label: 'Class 12 Calculus & Integrals', icon: Binary },
      { label: 'Class 10 Mathematics & Geometry', icon: Calculator },
      { label: 'Accountancy & Balance Sheets', icon: DollarSign },
      { label: 'Macro & Micro Economics', icon: LineChart },
    ]
  },
  {
    id: 'Computer Science',
    title: 'Computer Science & Software',
    icon: Code2,
    tag: 'Tech & Dev',
    desc: 'Full-Stack Web Dev, AI/ML, Data Science, DevOps, Cyber Security.',
    color: '#6366F1',
    tracks: [
      { id: 'MERN & Full-Stack Web Development', icon: Code2, desc: 'MongoDB, Express, React, Node.js, Next.js & TypeScript.', tag: 'Web Dev' },
      { id: 'AI, Machine Learning & Data Science', icon: Bot, desc: 'Python, PyTorch, Deep Learning, LLMs, Pandas, Scikit-Learn.', tag: 'AI & Data' },
      { id: 'DevOps, Cloud & System Design', icon: Cloud, desc: 'Docker, Kubernetes, AWS, Infrastructure as Code, Microservices.', tag: 'Cloud Native' },
      { id: 'Mobile Development (React Native / Flutter)', icon: Smartphone, desc: 'iOS & Android cross-platform app development.', tag: 'Mobile' },
      { id: 'Cyber Security & Ethical Hacking', icon: ShieldCheck, desc: 'Network Security, Cryptography, Penetration Testing, Linux.', tag: 'Security' },
    ],
    topicModules: [
      { label: 'React.js & Next.js Architecture', icon: Globe },
      { label: 'Node.js & REST/GraphQL APIs', icon: Server },
      { label: 'Python & Machine Learning Algorithms', icon: Bot },
      { label: 'PostgreSQL & MongoDB Database Design', icon: Database },
      { label: 'Docker & Kubernetes Containerization', icon: Cloud },
      { label: 'Data Structures & Algorithms (LeetCode)', icon: Code2 },
    ]
  },
  {
    id: 'Core Sciences',
    title: 'Core & Natural Sciences',
    icon: Atom,
    tag: 'STEM Sciences',
    desc: 'Physics, Chemistry, Biology, Environmental Science, Astrophysics.',
    color: '#EC4899',
    tracks: [
      { id: 'Physics (Classical, Quantum, Thermodynamics)', icon: Compass, desc: 'Kinematics, Electromagnetism, Quantum Mechanics, Relativity.', tag: 'Physics' },
      { id: 'Chemistry (Organic, Inorganic, Physical)', icon: Flame, desc: 'Reaction mechanisms, Chemical Kinetics, Stoichiometry, Bonding.', tag: 'Chemistry' },
      { id: 'Biology & Genetics', icon: Dna, desc: 'Cellular biology, Genetics, Molecular Biology, Immunology.', tag: 'Biology' },
    ],
    topicModules: [
      { label: 'Quantum Mechanics & Wave Equations', icon: Atom },
      { label: 'Thermodynamics & Statistical Physics', icon: Compass },
      { label: 'Organic Chemistry Reaction Mechanisms', icon: Flame },
      { label: 'Genetics, DNA Replication & Biotech', icon: Dna },
      { label: 'Biochemistry & Metabolic Pathways', icon: HeartPulse },
    ]
  },
  {
    id: 'Mathematics',
    title: 'Mathematics & Logic',
    icon: Calculator,
    tag: 'Pure & Applied Math',
    desc: 'Calculus, Linear Algebra, Probability, Statistics, Discrete Math.',
    color: '#3B82F6',
    tracks: [
      { id: 'Calculus & Differential Equations', icon: Binary, desc: 'Limits, Derivatives, Integrals, ODEs, Multivariable Calculus.', tag: 'Calculus' },
      { id: 'Linear Algebra & Vectors', icon: Layers, desc: 'Matrices, Eigenvalues, Vector Spaces, Transformations.', tag: 'Algebra' },
      { id: 'Probability & Statistics', icon: BarChart2, desc: 'Inferential Stats, Probability Distributions, Hypothesis Testing.', tag: 'Statistics' },
    ],
    topicModules: [
      { label: 'Differential & Integral Calculus', icon: Binary },
      { label: 'Linear Algebra & Matrix Operations', icon: Layers },
      { label: 'Probability Theory & Bayes Theorem', icon: BarChart2 },
      { label: 'Discrete Math & Logic', icon: Cpu },
    ]
  },
  {
    id: 'Business & Finance',
    title: 'Business, Finance & Economics',
    icon: TrendingUp,
    tag: 'Finance & Strategy',
    desc: 'Corporate Finance, Micro/Macroeconomics, Accounting, Marketing.',
    color: '#8B5CF6',
    tracks: [
      { id: 'Corporate Finance & Investment Banking', icon: DollarSign, desc: 'Financial Valuation (DCF), LBOs, Financial Modeling, Accounting.', tag: 'Finance' },
      { id: 'Microeconomics & Macroeconomics', icon: LineChart, desc: 'Supply/Demand, Market Structures, Inflation, GDP, Fiscal Policy.', tag: 'Economics' },
      { id: 'Entrepreneurship & Business Strategy', icon: Briefcase, desc: 'Product Strategy, Marketing, SaaS Metrics, Business Models.', tag: 'Business' },
    ],
    topicModules: [
      { label: 'Financial Statement Analysis & DCF', icon: DollarSign },
      { label: 'Microeconomics & Price Theory', icon: LineChart },
      { label: 'Corporate Finance & Capital Structure', icon: Briefcase },
      { label: 'Digital Marketing & Growth Strategy', icon: TrendingUp },
    ]
  },
  {
    id: 'Humanities & Law',
    title: 'Humanities, Social Sciences & Law',
    icon: Scale,
    tag: 'Arts & Law',
    desc: 'History, Psychology, Constitutional Law, Philosophy, Literature.',
    color: '#F43F5E',
    tracks: [
      { id: 'World & Indian History', icon: Landmark, desc: 'Ancient, Medieval, Modern History & Cultural Revolutions.', tag: 'History' },
      { id: 'Psychology & Behavioral Science', icon: Brain, desc: 'Cognitive Psychology, Neurobiology, Clinical & Behavioral Studies.', tag: 'Psychology' },
      { id: 'Constitutional & International Law', icon: Scale, desc: 'Legal Reasoning, Constitutional Rights, Criminal & Corporate Law.', tag: 'Law' },
    ],
    topicModules: [
      { label: 'Constitutional Law & Fundamental Rights', icon: Scale },
      { label: 'Cognitive & Clinical Psychology', icon: Brain },
      { label: 'Modern World History & Revolutions', icon: Landmark },
      { label: 'Ethics, Epistemology & Moral Philosophy', icon: BookOpen },
    ]
  },
  {
    id: 'Aptitude & Reasoning',
    title: 'Aptitude & Logical Reasoning',
    icon: Calculator,
    tag: 'Placements & Exams',
    desc: 'Quantitative Aptitude, Logical Reasoning, Verbal Ability (VARC), Data Interpretation.',
    color: '#10B981',
    tracks: [
      { id: 'Quantitative Aptitude (Math Shortcuts & Speed)', icon: Calculator, desc: 'Number Systems, Percentages, Profit & Loss, Speed/Time/Distance, P&C, Probability.', tag: 'Quant' },
      { id: 'Logical & Analytical Reasoning', icon: Brain, desc: 'Syllogisms, Blood Relations, Seating Arrangements, Coding-Decoding, Puzzles.', tag: 'Logic' },
      { id: 'Verbal Ability & Reading Comprehension (VARC)', icon: MessageSquare, desc: 'Reading Comprehension, Critical Reasoning, Vocabulary, Sentence Correction.', tag: 'Verbal' },
      { id: 'Data Interpretation & Data Sufficiency (DI / DS)', icon: BarChart2, desc: 'Bar Graphs, Pie Charts, Tables, Caselets, Data Sufficiency problem sets.', tag: 'Data' },
    ],
    topicModules: [
      { label: 'Quantitative Aptitude & Speed Math Shortcuts', icon: Calculator },
      { label: 'Logical Reasoning & Syllogisms', icon: Brain },
      { label: 'Verbal Ability & Reading Comprehension (VARC)', icon: MessageSquare },
      { label: 'Data Interpretation (Charts, Tables, Graphs)', icon: BarChart2 },
      { label: 'Puzzles, Seating Arrangements & Blood Relations', icon: Layers },
      { label: 'Permutations, Combinations & Probability', icon: Binary },
    ]
  },
  {
    id: 'Interview Prep',
    title: 'Interview Prep & Career Placement',
    icon: Award,
    tag: 'FAANG & Placements',
    desc: 'Technical Coding (DSA), System Design, Behavioral HR (STAR Method), Mock Interviews & Resumes.',
    color: '#EF4444',
    tracks: [
      { id: 'Technical Coding & Data Structures (LeetCode Patterns)', icon: Code2, desc: 'Arrays, Linked Lists, Trees, Graphs, Dynamic Programming, System Complexity (O(N)).', tag: 'Coding Round' },
      { id: 'System Design & Software Architecture (HLD & LLD)', icon: Server, desc: 'Scalability, Microservices, Caching (Redis), Load Balancers, Database Sharding.', tag: 'Design Round' },
      { id: 'Behavioral & HR Interview Mastery (STAR Method)', icon: Award, desc: 'Leadership principles, culture fit scenarios, conflict resolution & salary negotiation.', tag: 'HR Round' },
      { id: 'Resume, Portfolio & Mock Interview Coaching', icon: ShieldCheck, desc: 'ATS-optimized resume building, GitHub portfolio review, real-time AI mock interviews.', tag: 'Career Prep' },
    ],
    topicModules: [
      { label: 'Data Structures & Algorithms (Top 75 LeetCode)', icon: Code2 },
      { label: 'System Design (High Level & Low Level Design)', icon: Server },
      { label: 'Behavioral Interviews (STAR Method & Storytelling)', icon: Award },
      { label: 'Frontend & React Technical Interview Loop', icon: Globe },
      { label: 'Backend & System Architecture Interview Loop', icon: Database },
      { label: 'ATS Resume Building & Mock Interview Feedback', icon: ShieldCheck },
    ]
  }
];

const LEVELS = [
  { id: 'Beginner (Foundations)', icon: Flame, desc: 'Mastering core definitions, fundamental concepts, and basic problem solving.', tag: 'Fresh Start' },
  { id: 'Intermediate (Concept Mastery & Practice)', icon: Zap, desc: 'Solving standard exam problems, understanding formulas, code, or theories.', tag: 'Building Up' },
  { id: 'Advanced (Exam Mastery & Top Ranks)', icon: Star, desc: 'High-yield problem solving, trick short-cuts, full mock tests & speed strategy.', tag: 'Top Rank Track' },
];

const StepDot: React.FC<StepDotProps> = ({ active, done }) => (
  <div
    className={`h-2 flex-1 rounded-full transition-all duration-500 ${
      done ? 'bg-emerald-400' : active ? 'bg-indigo-400' : 'bg-white/10'
    }`}
  />
);

const LOADING_MSGS = [
  'Architecting your personalized study curriculum…',
  'Analyzing high-yield exam patterns & concepts…',
  'Structuring month-by-month milestone targets…',
  'Finalizing your AI Study Pilot roadmap…',
];

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

interface QuizResult {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

/* ================= MAIN ================= */
const AssessmentPage: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMsg, setLoadingMsg] = useState<number>(0);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState<boolean>(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [userResults, setUserResults] = useState<QuizResult[]>([]);

  const [formData, setFormData] = useState<FormDataType>({
    domainId: 'Competitive Exams',
    stackCategory: 'JEE Main & Advanced (Physics, Chemistry, Math)',
    skillLevel: 'Beginner (Foundations)',
    interests: [],
    customSubject: '',
    goals: '',
    dailyStudyTime: 3,
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

  const activeDomain = DOMAIN_CATEGORIES.find(d => d.id === formData.domainId) || DOMAIN_CATEGORIES[0];

  /* ================= FUNCTIONS ================= */
  const toggleInterest = (label: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(label)
        ? prev.interests.filter((i) => i !== label)
        : [...prev.interests, label],
    }));
  };

  const getCombinedInterests = () => {
    const selected = [formData.stackCategory, ...formData.interests];
    if (formData.customSubject.trim() && !selected.includes(formData.customSubject.trim())) {
      selected.push(formData.customSubject.trim());
    }
    return selected;
  };

  const startQuiz = async () => {
    const allInterests = getCombinedInterests();
    setQuizLoading(true);
    setStep(5);
    try {
      const questions = await roadmapService.generateAssessment(formData.skillLevel, allInterests);
      setQuizQuestions(questions || []);
    } catch (e) {
      console.error(e);
      setStep(6);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleQuizAnswer = (answer: string) => {
    const question = quizQuestions[currentQuizIndex];
    const isCorrect = answer === question.answer;
    
    const result = {
      question: question.question,
      userAnswer: answer,
      correctAnswer: question.answer,
      isCorrect: isCorrect
    };

    setUserResults(prev => [...prev, result]);
    
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      setStep(6);
    }
  };

  const handleSubmit = async () => {
    if (!formData.goals.trim()) {
      toast.error("Please enter your study or exam goals.");
      return;
    }

    setLoading(true);
    try {
      const allInterests = getCombinedInterests();
      const roadmapData = {
        studentCategory: `${formData.domainId} — ${formData.stackCategory}`,
        skillLevel: formData.skillLevel,
        interests: allInterests,
        goals: formData.goals,
        dailyStudyTime: formData.dailyStudyTime,
        assessmentResults: userResults
      };
      await roadmapService.generate(roadmapData);
      await fetchRoadmap();
      toast.success("Personalized AI Learning Roadmap generated successfully!");
      navigate('/dashboard');
    } catch (e: any) {
      console.error("[AssessmentPage] Roadmap generation error:", e);
      const errMsg = e.response?.data?.message || e.message || "Failed to generate roadmap";
      toast.error(`Error: ${errMsg}`);
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[500px] h-[500px] bg-emerald-600/20 blur-[120px] rounded-full"
        />

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-emerald-400" />
          </div>
          
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingMsg}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-emerald-400 font-medium text-lg text-center px-4"
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
                className="w-2 h-2 bg-emerald-400 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-background bg-grid-pattern bg-radial-gradient text-foreground transition-colors duration-300 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="animate-orb-1 absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[140px]" />
        <div className="animate-orb-2 absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-indigo-500/10 blur-[140px]" />
      </div>

      <div className="w-full max-w-3xl relative z-10">

        {/* HEADER */}
        <h1 className="text-3xl font-extrabold text-center mb-2 font-display text-gradient">
          Omni-Subject AI Study Setup
        </h1>
        <p className="text-muted-foreground text-center text-sm mb-6">
          Personalized AI roadmap & study mentor for School Boards, Competitive Entrance Exams, Sciences, Math & Tech.
        </p>

        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <StepDot key={i} active={step === i} done={step > i} />
          ))}
        </div>

        {/* STEP 1: Main Study Category */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold mb-4 text-center text-foreground font-display">Select Your Primary Study Goal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[440px] overflow-y-auto pr-1">
              {DOMAIN_CATEGORIES.map((domain) => {
                const Icon = domain.icon;
                const selected = formData.domainId === domain.id;
                return (
                  <button
                    key={domain.id}
                    className={`group relative w-full p-4 text-left bg-card/80 border rounded-2xl transition-all duration-300 ${
                      selected ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'border-border hover:border-emerald-500/50 hover:bg-card'
                    }`}
                    onClick={() => {
                      setFormData(p => ({
                        ...p,
                        domainId: domain.id,
                        stackCategory: domain.tracks[0]?.id || ''
                      }));
                      setStep(2);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: `${domain.color}20`, color: domain.color }}
                      >
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-sm text-foreground truncate">{domain.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold uppercase shrink-0">{domain.tag}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{domain.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STEP 2: Sub-Track & Specific Subject / Exam */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold mb-2 text-center text-foreground font-display">
              Select Your Target Exam / Subject Track
            </h2>
            <p className="text-xs text-muted-foreground text-center mb-4">
              Category: <span className="text-emerald-400 font-semibold">{activeDomain.title}</span>
            </p>

            <div className="grid gap-3 max-h-[420px] overflow-y-auto pr-1">
              {activeDomain.tracks.map(({ id, desc, tag, icon: Icon }) => (
                <button
                  key={id}
                  className={`group relative w-full p-4 text-left bg-card/80 border rounded-2xl hover:bg-card hover:border-emerald-500/50 transition-all duration-300 ${
                    formData.stackCategory === id ? 'border-emerald-500 bg-emerald-500/10' : 'border-border'
                  }`}
                  onClick={() => {
                    setFormData(p => ({ ...p, stackCategory: id }));
                    setStep(3);
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold uppercase tracking-wider">{tag}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="ghost" onClick={() => setStep(1)} className="text-muted-foreground hover:text-foreground">
                <ChevronLeft size={18} className="mr-1" /> Back
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Experience / Preparation Level */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-3"
          >
            <h2 className="text-xl font-bold mb-6 text-center text-foreground font-display">Select Your Current Preparation Level</h2>
            <div className="grid gap-3">
              {LEVELS.map(({ id, desc, tag, icon: Icon }) => (
                <button
                  key={id}
                  className={`group relative w-full p-5 text-left bg-card/80 border rounded-2xl hover:bg-card hover:border-emerald-500/50 transition-all duration-300 ${
                    formData.skillLevel === id ? 'border-emerald-500 bg-emerald-500/10' : 'border-border'
                  }`}
                  onClick={() => {
                    setFormData(p => ({ ...p, skillLevel: id }));
                    setStep(4);
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-foreground">{id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold uppercase tracking-wider">{tag}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="ghost" onClick={() => setStep(2)} className="text-muted-foreground hover:text-foreground">
                <ChevronLeft size={18} className="mr-1" /> Back
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Customize Topic Modules & Custom Subject */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl font-bold mb-2 text-center text-foreground font-display">Customize Your Focus Topics</h2>
            <p className="text-xs text-muted-foreground text-center mb-6">Select specific modules or add any custom subject/exam chapter.</p>

            {/* Custom Tech/Subject Box */}
            <div className="mb-6 p-4 rounded-2xl bg-card border border-border shadow-sm">
              <label className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                <Plus size={14} className="text-emerald-400" /> Enter any specific exam, subject, or chapter name:
              </label>
              <Input
                placeholder="e.g. Thermodynamics, Organic Chemistry SN1, UPSC Polity, Linear Algebra, React Hooks..."
                value={formData.customSubject}
                onChange={(e) => setFormData(p => ({ ...p, customSubject: e.target.value }))}
                className="h-12 bg-background rounded-xl border-border text-foreground"
              />
            </div>

            {/* Suggested Modules Grid */}
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Recommended Focus Areas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
              {activeDomain.topicModules.map(({ label, icon: Icon }) => {
                const selected = formData.interests.includes(label);
                return (
                  <button
                    key={label}
                    className={`group relative flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-300 text-left ${
                      selected
                        ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-card/80 border-border hover:border-emerald-500/30'
                    }`}
                    onClick={() => toggleInterest(label)}
                  >
                    <div className="p-2 rounded-xl bg-background text-emerald-400 group-hover:scale-110 shrink-0 transition-transform">
                      <Icon size={18} />
                    </div>
                    <span className={`text-xs leading-tight ${selected ? 'text-foreground font-bold' : 'text-muted-foreground font-medium'}`}>
                      {label}
                    </span>
                    {selected && (
                      <div className="ml-auto shrink-0">
                        <Check size={14} className="text-emerald-400" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={() => setStep(3)} className="text-muted-foreground hover:text-foreground">
                <ChevronLeft size={18} className="mr-1" /> Back
              </Button>
              <Button 
                variant="hero" 
                onClick={startQuiz}
                className="rounded-xl px-8"
              >
                Next <ChevronRight size={18} className="ml-1" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 5: AI Diagnostic Quiz */}
        {step === 5 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {quizLoading ? (
              <div className="py-20 text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-emerald-500 mb-4" />
                <h2 className="text-xl font-bold text-foreground">Preparing Diagnostic Assessment...</h2>
                <p className="text-muted-foreground text-sm mt-1">Gemini AI is crafting baseline questions for {formData.stackCategory}</p>
              </div>
            ) : quizQuestions.length > 0 ? (
              <div>
                <h2 className="text-xl font-bold mb-1 text-center text-foreground font-display">Diagnostic Assessment</h2>
                <p className="text-muted-foreground text-xs text-center mb-6">Question {currentQuizIndex + 1} of {quizQuestions.length}</p>
                
                <div className="bg-card border border-border rounded-3xl p-6 mb-6 shadow-xl">
                  <h3 className="text-base font-semibold mb-6 text-foreground leading-relaxed">{quizQuestions[currentQuizIndex]?.question}</h3>
                  <div className="grid gap-3">
                    {quizQuestions[currentQuizIndex]?.options.map((opt: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => handleQuizAnswer(opt)}
                        className="w-full p-4 text-left rounded-2xl bg-background border border-border text-foreground hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-sm font-medium"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground mb-6">No diagnostic questions generated. Proceeding to target goals.</p>
                <Button variant="hero" onClick={() => setStep(6)}>Continue</Button>
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 6: Goals */}
        {step === 6 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl font-bold mb-2 text-center text-foreground font-display">What is your ultimate study or exam goal?</h2>
            <p className="text-xs text-muted-foreground text-center mb-6">Specify your target rank, score percentage, or learning outcome.</p>

            <div className="relative group">
              <textarea
                className="w-full min-h-[160px] p-5 bg-background border border-border rounded-2xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none"
                placeholder="e.g. Achieve 99+ percentile in JEE Main & Advanced, score 95%+ in CBSE Board exams, rank top 1000 in NEET, crack UPSC CSAT, or master Full-Stack SaaS Development."
                value={formData.goals}
                onChange={(e) =>
                  setFormData(p => ({ ...p, goals: e.target.value }))
                }
              />
              <div className="absolute bottom-4 right-4 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                Be as specific as possible
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={() => setStep(4)} className="text-muted-foreground hover:text-foreground">
                <ChevronLeft size={18} className="mr-1" /> Back
              </Button>
              <Button 
                variant="hero" 
                onClick={() => setStep(7)}
                disabled={!formData.goals.trim()}
                className="rounded-xl px-8"
              >
                Next <ChevronRight size={18} className="ml-1" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 7: Daily Commitment */}
        {step === 7 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center"
          >
            <h2 className="text-xl font-bold mb-2 text-foreground font-display">Daily Study Commitment</h2>
            <p className="text-muted-foreground text-sm mb-10">How many hours can you dedicate each day?</p>

            <div className="flex items-center justify-center gap-8 mb-12">
              <button 
                onClick={() => setFormData(p => ({ ...p, dailyStudyTime: Math.max(1, p.dailyStudyTime - 1) }))}
                className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-2xl text-foreground hover:bg-background transition-all"
              >
                −
              </button>

              <div className="flex flex-col items-center">
                <motion.span 
                  key={formData.dailyStudyTime}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-6xl font-bold text-gradient font-display"
                >
                  {formData.dailyStudyTime}
                </motion.span>
                <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-2">Hours / Day</span>
              </div>

              <button 
                onClick={() => setFormData(p => ({ ...p, dailyStudyTime: Math.min(12, p.dailyStudyTime + 1) }))}
                className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-2xl text-foreground hover:bg-background transition-all"
              >
                +
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-10">
              <p className="text-sm text-emerald-400">
                <Clock className="inline mr-2 h-4 w-4 opacity-70" />
                Estimated time to exam mastery: <span className="font-bold">{estimateTime(formData.dailyStudyTime)}</span>
              </p>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(6)} className="text-muted-foreground hover:text-foreground">
                <ChevronLeft size={18} className="mr-1" /> Back
              </Button>
              <Button 
                variant="hero" 
                onClick={handleSubmit}
                className="rounded-xl px-10 py-6 text-lg group"
              >
                <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Generate AI Study Plan
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AssessmentPage;