import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Base API URL - update this to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL;



// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth
      localStorage.removeItem('token');
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authApi = {
  register: (data: { fullName: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// KYC API calls
export const kycApi = {
  submit: (formData: FormData) =>
    api.post('/kyc/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getStatus: () => api.get('/kyc/status'),
};

// Admin API calls
export const adminApi = {
  getAllSubmissions: () => api.get("/admin/all"),
  getSubmission: (id: string) => api.get(`/admin/submission/${id}`),
  updateStatus: (id: string, status: "verified" | "rejected") =>
    api.put(`/admin/update/${id}`, { status }),
};


export default api;
