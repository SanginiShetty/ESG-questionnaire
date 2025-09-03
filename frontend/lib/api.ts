import axios from 'axios';
import { AuthResponse, ESGResponse, SummaryData, User } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
    api.post('/api/auth/login', { email, password }).then(res => res.data),

  register: (name: string, email: string, password: string): Promise<AuthResponse> =>
    api.post('/api/auth/register', { name, email, password }).then(res => res.data),

  getCurrentUser: (): Promise<{ user: User }> =>
    api.get('/api/auth/me').then(res => res.data),
};

export const responseApi = {
  getAll: (): Promise<{ responses: ESGResponse[] }> =>
    api.get('/api/responses').then(res => res.data),

  getByYear: (year: number): Promise<{ response: ESGResponse }> =>
    api.get(`/api/responses/${year}`).then(res => res.data),

  save: (data: ESGResponse): Promise<{ message: string; response: ESGResponse }> =>
    api.post('/api/responses', data).then(res => res.data),

  delete: (year: number): Promise<{ message: string }> =>
    api.delete(`/api/responses/${year}`).then(res => res.data),

  upload: (formData: FormData, token: string): Promise<{ message: string; response: ESGResponse }> => {
    const uploadApi = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return uploadApi.post('/api/responses/upload', formData).then(res => res.data);
  },
};

export const summaryApi = {
  getSummary: (): Promise<{ summary: SummaryData }> =>
    api.get('/api/summary').then(res => res.data),

  getChartData: (): Promise<{ chartData: Record<string, unknown> }> =>
    api.get('/api/summary/charts').then(res => res.data),
};

export default api;