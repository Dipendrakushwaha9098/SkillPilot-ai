import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roadmapService } from '../services/api';
import { Sparkles, Loader2, Brain, Target, Zap, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const AssessmentPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    skillLevel: 'Beginner',
    interests: [] as string[],
    goals: '',
    dailyStudyTime: 2
  });
  const navigate = useNavigate();

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await roadmapService.generate(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error generating roadmap:', error);
    } finally {
      setLoading(false);
    }
  };

  const interestsList = ['Web Development', 'AI & Machine Learning', 'Data Science', 'App Development', 'Cybersecurity', 'Cloud Computing'];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
        >
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
                <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10 mx-auto" />
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-2">Architecting Your Path...</h2>
            <p className="text-muted-foreground text-lg">Our AI is curated the perfect curriculum based on your goals.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold mb-4 tracking-tight">Tailor Your Experience</h1>
            <p className="text-muted-foreground text-lg">Step {step} of 4</p>
            <div className="flex gap-2 max-w-xs mx-auto mt-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-primary' : 'bg-muted'}`} />
                ))}
            </div>
        </div>

        <div className="bg-card rounded-[2rem] border shadow-elevated p-8 md:p-12 relative overflow-hidden">
            <AnimatePresence mode="wait">
                {step === 1 && (
                <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                >
                    <div className="space-y-2">
                        <h2 className="text-3xl font-display font-bold">What's your current level?</h2>
                        <p className="text-muted-foreground">This helps us starting you at the right point.</p>
                    </div>
                    <div className="grid gap-4">
                    {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                        <button
                        key={level}
                        onClick={() => { setFormData({...formData, skillLevel: level}); setStep(2); }}
                        className={`group p-6 rounded-2xl border-2 text-left transition-all ${
                            formData.skillLevel === level 
                            ? 'border-primary bg-primary/5 shadow-sm' 
                            : 'border-border hover:border-primary/30 hover:bg-muted/50'
                        }`}
                        >
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-xl font-bold block mb-1">{level}</span>
                                <span className="text-muted-foreground text-sm">
                                    {level === 'Beginner' && 'I am starting from scratch.'}
                                    {level === 'Intermediate' && 'I have foundational knowledge.'}
                                    {level === 'Advanced' && 'I want to master expert concepts.'}
                                </span>
                            </div>
                            <ChevronRight className={`h-6 w-6 transition-transform ${formData.skillLevel === level ? 'text-primary' : 'text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />
                        </div>
                        </button>
                    ))}
                    </div>
                </motion.div>
                )}

                {step === 2 && (
                <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                >
                    <div className="space-y-2">
                        <h2 className="text-3xl font-display font-bold">What excites you?</h2>
                        <p className="text-muted-foreground">Select your areas of interest.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    {interestsList.map(interest => (
                        <button
                        key={interest}
                        onClick={() => handleInterestToggle(interest)}
                        className={`p-4 rounded-xl border-2 transition-all font-bold text-sm text-center ${
                            formData.interests.includes(interest) 
                            ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                            : 'border-border text-muted-foreground hover:border-primary/30'
                        }`}
                        >
                        {interest}
                        </button>
                    ))}
                    </div>
                    <Button 
                    disabled={formData.interests.length === 0}
                    onClick={() => setStep(3)}
                    variant="hero"
                    className="w-full h-14 rounded-2xl text-lg font-bold mt-4 shadow-lg"
                    >
                    Next Step <ChevronRight className="ml-2" />
                    </Button>
                </motion.div>
                )}

                {step === 3 && (
                <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                >
                    <div className="space-y-2">
                        <h2 className="text-3xl font-display font-bold">What's your vision?</h2>
                        <p className="text-muted-foreground">Tell us about your ultimate career goal.</p>
                    </div>
                    <textarea
                    className="w-full p-6 rounded-2xl border-2 bg-muted/30 border-border focus:border-primary focus:ring-0 outline-none transition-all h-40 text-lg"
                    placeholder="e.g. Master React and Node.js to build a scalable SaaS product and land a Senior role..."
                    value={formData.goals}
                    onChange={(e) => setFormData({...formData, goals: e.target.value})}
                    />
                    <Button 
                    disabled={!formData.goals}
                    onClick={() => setStep(4)}
                    variant="hero"
                    className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg"
                    >
                    Nearly there <ChevronRight className="ml-2" />
                    </Button>
                </motion.div>
                )}

                {step === 4 && (
                <motion.div 
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8 text-center"
                >
                    <div className="space-y-2">
                        <h2 className="text-3xl font-display font-bold">Time Commitment</h2>
                        <p className="text-muted-foreground">How many hours can you give each day?</p>
                    </div>
                    <div className="flex justify-center items-center gap-12 py-8">
                    <button onClick={() => setFormData(p => ({...p, dailyStudyTime: Math.max(1, p.dailyStudyTime - 1)}))} className="w-14 h-14 rounded-2xl border-2 border-border text-3xl font-light hover:border-primary hover:text-primary transition-all">-</button>
                    <div className="flex flex-col">
                        <span className="text-7xl font-display font-black text-primary">{formData.dailyStudyTime}</span>
                        <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Hours</span>
                    </div>
                    <button onClick={() => setFormData(p => ({...p, dailyStudyTime: p.dailyStudyTime + 1}))} className="w-14 h-14 rounded-2xl border-2 border-border text-3xl font-light hover:border-primary hover:text-primary transition-all">+</button>
                    </div>
                    <Button 
                    onClick={handleSubmit}
                    variant="hero"
                    className="w-full h-16 rounded-2xl text-xl font-bold shadow-xl shadow-primary/20 gap-3 group"
                    >
                    <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                    Generate My Roadmap
                    </Button>
                </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;
