import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode
} from "react";
import {
  authService,
  roadmapService,
  progressService,
  AuthUser,
  Roadmap,
  ProgressData
} from "../services/api";

// ================= TYPES =================

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  roadmap: Roadmap | null;
  completedTopics: string[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  fetchRoadmap: () => Promise<void>;
  toggleTopicComplete: (topicTitle: string) => Promise<void>;
}

// ================= CONTEXT =================

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

// ================= PROVIDER =================

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

  // ================= INIT =================

  useEffect(() => {
    const init = async () => {
      try {
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");

        if (savedUser && savedToken) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setToken(savedToken);
          
          // Pre-fetch data if we have a session
          await fetchInitialData();
        }
      } catch (error) {
        console.error("[AuthContext] Initialization failed:", error);
        // Clear corrupt session
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // ================= FETCH INITIAL =================

  const fetchInitialData = async () => {
    try {
      const [roadmapRes, progressRes] = await Promise.allSettled([
        roadmapService.get(),
        progressService.get()
      ]);

      if (roadmapRes.status === 'fulfilled') setRoadmap(roadmapRes.value || null);
      if (progressRes.status === 'fulfilled') setCompletedTopics(progressRes.value?.completedLessons || []);
      
    } catch (error) {
      console.error("[AuthContext] Failed to fetch initial data:", error);
    }
  };

  // ================= LOGIN =================

  const login = async (email: string, password: string) => {
    try {
      const res = await authService.login({ email, password });

      // Consistent storage
      setUser(res.user);
      setToken(res.token);

      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("token", res.token);

      // Refresh data after login
      await fetchInitialData();

      return {};
    } catch (error: unknown) {
      console.error("[AuthContext] Login error:", error);
      const message = error instanceof Error ? error.message : "Login failed";
      return { error: message };
    }
  };

  // ================= SIGNUP =================

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await authService.signup({ name, email, password });

      setUser(res.user);
      setToken(res.token);

      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("token", res.token);

      return {};
    } catch (error: any) {
      console.error("[AuthContext] Signup error:", error);
      
      // Extract backend error message if available
      const backendMessage = error.response?.data?.error || error.response?.data?.message;
      const message = backendMessage || error.message || "Signup failed";
      
      return { error: message };
    }

  };

  // ================= LOGOUT =================

  const logout = () => {
    setUser(null);
    setToken(null);
    setRoadmap(null);
    setCompletedTopics([]);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // ================= FETCH ROADMAP =================

  const fetchRoadmap = async () => {
    try {
      const res = await roadmapService.get();
      const roadmapData = res;

      setRoadmap(roadmapData);
    } catch (error) {
      console.error("Failed to fetch roadmap", error);
    }
  };

  // ================= TOGGLE TOPIC =================

  const toggleTopicComplete = async (topicTitle: string) => {
    try {
      await progressService.update(topicTitle);

      setCompletedTopics(prev =>
        prev.includes(topicTitle)
          ? prev.filter(t => t !== topicTitle)
          : [...prev, topicTitle]
      );
    } catch (error) {
      console.error("Failed to update progress", error);
    }
  };

  // ================= PROVIDER VALUE =================

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        roadmap,
        completedTopics,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        fetchRoadmap,
        toggleTopicComplete
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};