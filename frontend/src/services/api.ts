import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Auth API
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  
  logout: () => api.post('/auth/logout'),
  
  getMe: () => api.get('/auth/me'),
};

// Quiz API
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