import axios from 'axios';
import { AuthResponse, ESGResponse, SummaryData, User } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email: string, password: string): Promise<AuthResponse> =>
    api.post('/auth/login', { email, password }).then(res => res.data),
  
  register: (name: string, email: string, password: string): Promise<AuthResponse> =>
    api.post('/auth/register', { name, email, password }).then(res => res.data),
  
  getCurrentUser: (): Promise<{ user: User }> =>
    api.get('/auth/me').then(res => res.data),
};

export const responseApi = {
  getAll: (): Promise<{ responses: ESGResponse[] }> =>
    api.get('/responses').then(res => res.data),
  
  getByYear: (year: number): Promise<{ response: ESGResponse }> =>
    api.get(`/responses/${year}`).then(res => res.data),
  
  save: (data: ESGResponse): Promise<{ message: string; response: ESGResponse }> =>
    api.post('/responses', data).then(res => res.data),
  
  delete: (year: number): Promise<{ message: string }> =>
    api.delete(`/responses/${year}`).then(res => res.data),
};

export const summaryApi = {
  getSummary: (): Promise<{ summary: SummaryData }> =>
    api.get('/summary').then(res => res.data),
  
  getChartData: (): Promise<{ chartData: Record<string, unknown> }> =>
    api.get('/summary/charts').then(res => res.data),
};

export default api;