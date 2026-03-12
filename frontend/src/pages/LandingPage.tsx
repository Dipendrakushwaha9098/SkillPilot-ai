import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Brain, Target, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="pt-20 pb-16 px-4 md:px-8 text-center bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
            Master Any Skill with <span className="text-blue-600">AI Precision.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            SkillPilot AI identifies your level and crafts a personalized roadmap to take you from beginner to professional.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              Start Learning Free
            </Link>
            <Link to="/login" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold text-lg hover:bg-slate-50 transition">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                <Brain size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Skill Assessment</h3>
              <p className="text-slate-600">Our AI evaluates your current knowledge and learning style to build the perfect plan.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-6">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Custom Roadmaps</h3>
              <p className="text-slate-600">Get a 3-month structured path with curated resources, projects, and milestones.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Mentor 24/7</h3>
              <p className="text-slate-600">Stuck on a problem? Our AI mentor is always available to explain concepts and debug code.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
