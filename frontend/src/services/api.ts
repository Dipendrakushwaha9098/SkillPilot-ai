import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const authService = {
  signup: (userData: any) => api.post('/auth/signup', userData),
  login: (userData: any) => api.post('/auth/login', userData),
};

export const roadmapService = {
  generate: (data: any) => api.post('/roadmap/generate', data),
  get: () => api.get('/roadmap'),
};

export const mentorService = {
  chat: (data: any) => api.post('/mentor/chat', data),
};

export const progressService = {
  update: (topicId: string) => api.post('/progress/update', { topicId }),
  get: () => api.get('/progress'),
};

export default api;
