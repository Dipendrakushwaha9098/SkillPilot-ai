import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { authService, roadmapService, progressService } from "../services/api";

interface Assessment {
  skillLevel: string;
  interests: string[];
  goals: string;
  dailyStudyTime: number;
}

interface RoadmapTopic {
  title: string;
  explanation: string;
  resources: string[];
  videoLinks: string[];
  exercises: string[];
}

interface RoadmapMonth {
  month: number;
  topics: RoadmapTopic[];
  project: {
    title: string;
    description: string;
  };
}

interface Roadmap {
  title: string;
  description: string;
  months: RoadmapMonth[];
}

interface AuthContextType {
  user: { id: string; name: string; email: string } | null;
  loading: boolean;
  roadmap: Roadmap | null;
  completedTopics: string[];
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  fetchRoadmap: () => Promise<void>;
  toggleTopicComplete: (topicTitle: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      // Fetch initial data if logged in
      fetchInitialData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchInitialData = async () => {
    try {
      const [roadmapRes, progressRes] = await Promise.all([
        roadmapService.get(),
        progressService.get()
      ]);
      setRoadmap(roadmapRes.data);
      setCompletedTopics(progressRes.data.completedLessons || []);
    } catch (error) {
      console.error("Failed to fetch initial data", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const res = await authService.login({ email, password });
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      await fetchInitialData();
      return {};
    } catch (error: any) {
      return { error: error.response?.data?.message || "Login failed" };
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ error?: string }> => {
    try {
      const res = await authService.signup({ name, email, password });
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      setLoading(false);
      return {};
    } catch (error: any) {
      return { error: error.response?.data?.message || "Signup failed" };
    }
  };

  const logout = () => {
    setUser(null);
    setRoadmap(null);
    setCompletedTopics([]);
    localStorage.removeItem('user');
  };

  const fetchRoadmap = async () => {
    const res = await roadmapService.get();
    setRoadmap(res.data);
  };

  const toggleTopicComplete = async (topicTitle: string) => {
    try {
      await progressService.update(topicTitle);
      setCompletedTopics(prev => 
        prev.includes(topicTitle) ? prev : [...prev, topicTitle]
      );
    } catch (error) {
      console.error("Failed to update progress", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      roadmap, 
      completedTopics, 
      login, 
      signup, 
      logout, 
      fetchRoadmap,
      toggleTopicComplete 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
