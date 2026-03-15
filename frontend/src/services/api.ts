import axios from "axios";

/* Base URL */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* Axios Instance */
const api = axios.create({
  baseURL: API_URL,
});

/* Request Interceptor (Attach Token) */
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* Response Interceptor (Global Error Handling) */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

/* ================= AUTH ================= */

export interface AuthData {
  email: string;
  password: string;
  name?: string;
}

export const authService = {
  signup: (userData: AuthData) => api.post("/auth/signup", userData),
  login: (userData: AuthData) => api.post("/auth/login", userData),
};

/* ================= ROADMAP ================= */

export interface RoadmapRequest {
  goal: string;
  level: string;
}

export const roadmapService = {
  generate: (data: RoadmapRequest) => api.post("/roadmap/generate", data),
  get: () => api.get("/roadmap"),
};

/* ================= AI MENTOR ================= */

export interface ChatRequest {
  message: string;
}

export const mentorService = {
  chat: (data: ChatRequest) => api.post("/mentor/chat", data),
};

/* ================= PROGRESS ================= */

export const progressService = {
  update: (topicId: string) =>
    api.post("/progress/update", { topicId }),

  get: () => api.get("/progress"),
};

export default api;
