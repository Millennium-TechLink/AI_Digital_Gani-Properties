import axios from 'axios';

export interface Career {
  id: string;
  title: string;
  category: string;
  description: string;
  requirements?: string[];
  benefits?: string[];
  state?: string;
  city?: string;
  postedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear stale token so the Dashboard shows login screen
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('auth_token');
    }
    return Promise.reject(error);
  }
);

export class CareersApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'CareersApiError';
  }
}

export const careersApi = {
  getAll: async (): Promise<Career[]> => {
    try {
      const response = await api.get<Career[]>('/careers');
      return response.data || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new CareersApiError(error.response?.data?.error || error.message, error.response?.status, error);
      }
      throw error;
    }
  },

  create: async (career: Omit<Career, 'id' | 'postedAt'>): Promise<Career> => {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new CareersApiError('Authentication required. Please log in again.', 401);
    try {
      const response = await api.post<Career>('/careers', career);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new CareersApiError(error.response?.data?.error || error.message, error.response?.status, error);
      }
      throw error;
    }
  },

  update: async (id: string, updates: Partial<Omit<Career, 'id' | 'postedAt'>>): Promise<Career> => {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new CareersApiError('Authentication required. Please log in again.', 401);
    try {
      const response = await api.put<Career>(`/careers/${id}`, updates);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new CareersApiError(error.response?.data?.error || error.message, error.response?.status, error);
      }
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new CareersApiError('Authentication required. Please log in again.', 401);
    try {
      await api.delete(`/careers/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new CareersApiError(error.response?.data?.error || error.message, error.response?.status, error);
      }
      throw error;
    }
  },
};
