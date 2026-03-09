import { useState, createContext, useContext, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Assessment {
  skillLevel: string;
  interest: string;
  goal: string;
  dailyTime: string;
}

interface RoadmapTopic {
  id: string;
  title: string;
  description: string;
  week: number;
  completed: boolean;
  resources: string[];
  exercises: string[];
  project?: string;
}

interface Roadmap {
  title: string;
  duration: string;
  topics: RoadmapTopic[];
}

interface AuthContextType {
  user: User | null;
  assessment: Assessment | null;
  roadmap: Roadmap | null;
  completedTopics: string[];
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
  setAssessment: (a: Assessment) => void;
  setRoadmapDirectly: (r: Roadmap) => void;
  toggleTopicComplete: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [assessment, setAssessmentState] = useState<Assessment | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

  const login = (email: string, _password: string) => {
    setUser({ id: "1", name: email.split("@")[0], email });
  };

  const signup = (name: string, email: string, _password: string) => {
    setUser({ id: "1", name, email });
  };

  const logout = () => {
    setUser(null);
    setAssessmentState(null);
    setRoadmap(null);
    setCompletedTopics([]);
  };

  const setAssessment = (a: Assessment) => {
    setAssessmentState(a);
  };

  const setRoadmapDirectly = (r: Roadmap) => {
    setRoadmap(r);
  };

  const toggleTopicComplete = (id: string) => {
    setCompletedTopics(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  return (
    <AuthContext.Provider value={{ user, assessment, roadmap, completedTopics, login, signup, logout, setAssessment, setRoadmapDirectly, toggleTopicComplete }}>
      {children}
    </AuthContext.Provider>
  );
};
