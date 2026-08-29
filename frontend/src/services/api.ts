import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

/* ─────────────────────────────────────────
   Config & Constants
───────────────────────────────────────── */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const CACHE_TTL_MS = 60_000;

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */

export interface ApiError {
  message: string;
  status?: number;
}

/* ── Auth ── */
export interface AuthData {
  email: string;
  password: string;
  name?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

/* ── Roadmap ── */
export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

export interface Topic {
  title: string;
  explanation: string;
  notes: string[];
  resources: string[];
  videoLinks: string[];
  exercises: string[];
  quizzes?: QuizQuestion[];
}

export interface Phase {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
}

export interface Month {
  month: number;
  topics: Topic[];
  project: {
    title: string;
    description: string;
  };
}

export interface Roadmap {
  title: string;
  description: string;
  months: Month[];
}

/* ─────────────────────────────────────────
   Token Helper
───────────────────────────────────────── */
const tokenStore = {
  get(): string | null {
    return localStorage.getItem("token");
  },
  clear() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

/* ─────────────────────────────────────────
   Cache
───────────────────────────────────────── */
class RequestCache {
  private store = new Map<string, { data: unknown; expires: number }>();

  set(key: string, data: unknown) {
    this.store.set(key, {
      data,
      expires: Date.now() + CACHE_TTL_MS,
    });
  }

  get(key: string) {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expires) {
      this.store.delete(key);
      return null;
    }
    return item.data;
  }

  clear() {
    this.store.clear();
  }
}

export const cache = new RequestCache();

/* ─────────────────────────────────────────
   Axios Instance
───────────────────────────────────────── */
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");
    if (error.response && error.response.status === 401 && !isLoginRequest) {
      // Auto logout on 401, but not on login attempts
      authService.logout();
    }
    return Promise.reject(error);
  }
);

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function normaliseError(error: AxiosError): ApiError {
  return {
    message: error.message,
    status: error.response?.status,
  };
}

async function cachedGet<T>(url: string): Promise<T> {
  const cached = cache.get(url);
  if (cached) return cached;

  const { data } = await api.get<T>(url);
  cache.set(url, data);
  return data;
}

/* ─────────────────────────────────────────
   ================= AUTH =================
───────────────────────────────────────── */
export const authService = {
  async signup(userData: AuthData): Promise<AuthResponse & { message?: string }> {
    const { data } = await api.post<AuthResponse & { message?: string }>("/auth/signup", userData);
    return data;
  },

  async login(userData: AuthData): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/login", userData);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  },

  async googleLogin(token: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/google", { token });
    
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    
    return data;
  },

  logout() {
    tokenStore.clear();
    cache.clear();
    window.location.href = "/login";
  },

  async me(): Promise<AuthUser> {
    return cachedGet<AuthUser>("/auth/me");
  },

  isAuthenticated(): boolean {
    return !!tokenStore.get();
  },
};

/* ─────────────────────────────────────────
   =============== ROADMAP ================
───────────────────────────────────────── */
export const roadmapService = {
  async generate(request: unknown): Promise<Roadmap> {
    const { data } = await api.post<Roadmap>("/roadmap/generate", request);
    return data;
  },

  async get(): Promise<Roadmap> {
    return cachedGet<Roadmap>("/roadmap");
  },

  async getPhase(phaseId: string): Promise<Phase> {
    return cachedGet<Phase>(`/roadmap/phases/${phaseId}`);
  },

  async getTopic(topicId: string): Promise<Topic> {
    return cachedGet<Topic>(`/roadmap/topics/${topicId}`);
  },

  async generateAssessment(skillLevel: string, interests: string[]): Promise<unknown[]> {
    const { data } = await api.post("/roadmap/assessment", { skillLevel, interests });
    return data;
  },

  /* 🔥 FIXED WEEKLY TEST */
  async getWeeklyTest(): Promise<{ week: number; title: string; questions: { question: string; options: string[]; answer: string }[] } | null> {
    try {
      const data = await cachedGet<{ week: number; title: string; questions: { question: string; options: string[]; answer: string }[] }>("/roadmap/weekly-test");

      console.log("✅ Weekly Test API Response:", data);

      // Safety validation
      if (!data || !data.questions || data.questions.length === 0) {
        console.warn("⚠️ Invalid weekly test format:", data);
        return null;
      }

      return data;
    } catch (error) {
      const err = normaliseError(error as AxiosError);
      console.error("❌ Weekly Test Error:", err);
      return null;
    }
  }
};

/* ─────────────────────────────────────────
   ============== PROGRESS ================
───────────────────────────────────────── */
export interface ProgressData {
  completedLessons: string[];
  quizResults: { topic: string; score: number }[];
  streak: number;
  lastActive: string;
}

export const progressService = {
  async get(): Promise<ProgressData> {
    const { data } = await api.get<ProgressData>("/progress");
    return data;
  },

  async update(topicId: string): Promise<ProgressData> {
    const { data } = await api.post<ProgressData>("/progress/update", { topicId });
    return data;
  },
};

/* ─────────────────────────────────────────
   =============== MENTOR =================
───────────────────────────────────────── */
export const mentorService = {
  async chat(payload: { message: string; history: { role: string; parts: string | { text: string }[] }[]; conciseMode?: boolean; mode?: string }): Promise<{ reply: string; learnedProfile?: any }> {
    const { data } = await api.post("/mentor/chat", payload);
    return data;
  },
};

/* ─────────────────────────────────────────
   ================ NOTES =================
   ───────────────────────────────────────── */
export const notesService = {
  async generate(topic: string): Promise<{ notes: string }> {
    const { data } = await api.post("/notes/generate", { topic });
    return data;
  },
};

export default api;