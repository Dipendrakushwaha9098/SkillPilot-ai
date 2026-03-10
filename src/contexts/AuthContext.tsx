import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

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
  user: { id: string; name: string; email: string } | null;
  session: Session | null;
  loading: boolean;
  assessment: Assessment | null;
  roadmap: Roadmap | null;
  completedTopics: string[];
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessmentState] = useState<Assessment | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

  useEffect(() => {
    // Set up auth state listener BEFORE getting initial session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
        email: session.user.email || "",
      }
    : null;

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  };

  const signup = async (name: string, email: string, password: string): Promise<{ error?: string }> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) return { error: error.message };
    return {};
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAssessmentState(null);
    setRoadmap(null);
    setCompletedTopics([]);
  };

  const setAssessment = (a: Assessment) => setAssessmentState(a);
  const setRoadmapDirectly = (r: Roadmap) => setRoadmap(r);

  const toggleTopicComplete = (id: string) => {
    setCompletedTopics(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, assessment, roadmap, completedTopics, login, signup, logout, setAssessment, setRoadmapDirectly, toggleTopicComplete }}>
      {children}
    </AuthContext.Provider>
  );
};
