import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://quizapp-j7bk.onrender.com/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  // Remove withCredentials since we're using tokens
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  
  logout: () => {
    localStorage.removeItem('auth_token');
    return Promise.resolve(); // No need for backend call if using tokens
  },
  
  getMe: () => api.get('/auth/me'),
};

// Quiz API (no changes needed)
export const quizAPI = {
  getAll: () => api.get('/quizzes'),
  getById: (id: string) => api.get(`/quizzes/${id}`),
  getMyQuizzes: () => api.get('/quizzes/admin/my-quizzes'),
  create: (data: any) => api.post('/quizzes', data),
  update: (id: string, data: any) => api.put(`/quizzes/${id}`, data),
  delete: (id: string) => api.delete(`/quizzes/${id}`),
  submit: (id: string, answers: any) => 
    api.post(`/quizzes/${id}/submit`, { answers }),
};