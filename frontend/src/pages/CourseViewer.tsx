import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roadmapService, progressService } from '../services/api';
import { ChevronLeft, PlayCircle, ExternalLink, CheckCircle, ListTodo } from 'lucide-react';

const CourseViewer = () => {
  const { topicTitle } = useParams();
  const [topic, setTopic] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const res = await roadmapService.get();
        const allTopics = res.data.months.flatMap((m: any) => m.topics);
        const currentTopic = allTopics.find((t: any) => t.title === topicTitle);
        setTopic(currentTopic);
        
        const progRes = await progressService.get();
        setIsCompleted(progRes.data.completedLessons.includes(topicTitle));
      } catch (error) {
        console.error('Error fetching topic:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopic();
  }, [topicTitle]);

  const handleComplete = async () => {
    try {
      await progressService.update(topicTitle as string);
      setIsCompleted(true);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (loading) return <div className="p-8">Loading lesson...</div>;
  if (!topic) return <div className="p-8">Topic not found.</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="p-4 border-b border-slate-100 flex items-center justify-between">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition font-medium">
          <ChevronLeft size={20} />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-4">
          {isCompleted ? (
            <span className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-full">
              <CheckCircle size={18} />
              Completed
            </span>
          ) : (
            <button 
              onClick={handleComplete}
              className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition"
            >
              Mark as Complete
            </button>
          )}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-black text-slate-900 mb-8">{topic.title}</h1>
        
        <div className="prose prose-slate max-w-none">
          <section className="bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <PlayCircle className="text-blue-600" />
              Lesson Overview
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-0">
              {topic.explanation}
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ExternalLink className="text-indigo-600" />
                Recommended Resources
              </h2>
              <ul className="space-y-3">
                {topic.resources.map((link: string, i: number) => (
                  <li key={i} className="list-none">
                    <a href={link} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50 transition text-blue-600 font-medium truncate">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ListTodo className="text-purple-600" />
                Practice Exercises
              </h2>
              <ul className="space-y-3">
                {topic.exercises.map((ex: string, i: number) => (
                  <li key={i} className="flex gap-3 p-4 rounded-2xl bg-purple-50/50 border border-purple-100 text-slate-700 text-sm font-medium">
                    <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center flex-shrink-0 text-xs font-bold">{i+1}</span>
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
