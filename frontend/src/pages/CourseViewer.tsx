import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roadmapService, progressService } from '../services/api';
import {
  ChevronLeft,
  PlayCircle,
  ExternalLink,
  CheckCircle,
  ListTodo
} from 'lucide-react';

/* ================= TYPES ================= */

type Topic = {
  title: string;
  explanation: string;
  resources: string[];
  exercises: string[];
};

type Month = {
  topics: Topic[];
};

type RoadmapResponse = {
  months: Month[];
};

type ProgressResponse = {
  completedLessons: string[];
};

/* ================= COMPONENT ================= */

const CourseViewer: React.FC = () => {
  const { topicTitle } = useParams<{ topicTitle: string }>();

  const [topic, setTopic] = useState<Topic | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        /* 🔥 Get roadmap */
        const roadmapRes = await roadmapService.get();
        const data: RoadmapResponse = roadmapRes;

        const allTopics = data.months.flatMap((m) => m.topics);

        const currentTopic = allTopics.find(
          (t) => t.title === topicTitle
        );

        setTopic(currentTopic || null);

        /* 🔥 Get progress */
        const progressRes = await progressService.get();
        const progress: ProgressResponse = progressRes;

        setIsCompleted(
          progress.completedLessons.includes(topicTitle || '')
        );
      } catch (error) {
        console.error('Error fetching topic:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [topicTitle]);

  /* ================= HANDLE COMPLETE ================= */

  const handleComplete = async () => {
    if (!topicTitle) return;

    try {
      await progressService.update(topicTitle);
      setIsCompleted(true);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  /* ================= UI STATES ================= */

  if (loading)
    return <div className="p-8 text-lg">Loading lesson...</div>;

  if (!topic)
    return <div className="p-8 text-lg">Topic not found.</div>;

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-white">
      
      {/* NAVBAR REMOVED - Using Global Navbar */}

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        <h1 className="text-4xl font-black text-slate-900 mb-8">
          {topic.title}
        </h1>

        {/* OVERVIEW */}
        <section className="bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <PlayCircle className="text-blue-600" />
            Lesson Overview
          </h2>

          <p className="text-lg text-slate-700 leading-relaxed">
            {topic.explanation}
          </p>
        </section>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* RESOURCES */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ExternalLink className="text-indigo-600" />
              Recommended Resources
            </h2>

            <ul className="space-y-3">
              {topic.resources?.map((link, i) => (
                <li key={i}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50 transition text-blue-600 font-medium truncate"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* EXERCISES */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ListTodo className="text-purple-600" />
              Practice Exercises
            </h2>

            <ul className="space-y-3">
              {topic.exercises?.map((ex, i) => (
                <li
                  key={i}
                  className="flex gap-3 p-4 rounded-2xl bg-purple-50 border border-purple-100 text-slate-700 text-sm font-medium"
                >
                  <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  {ex}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseViewer;