import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL + '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Categories
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getOne: (id: string) => api.get(`/categories/${id}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Businesses
export const businessesAPI = {
  getAll: (params?: { category_id?: string; search?: string }) =>
    api.get('/businesses', { params }),
  getFeatured: () => api.get('/businesses/featured'),
  getOne: (id: string) => api.get(`/businesses/${id}`),
  create: (data: any) => api.post('/businesses', data),
  update: (id: string, data: any) => api.put(`/businesses/${id}`, data),
  delete: (id: string) => api.delete(`/businesses/${id}`),
  toggleFeatured: (id: string) => api.patch(`/businesses/${id}/featured`),
};

// Reviews
export const reviewsAPI = {
  getByBusiness: (businessId: string) =>
    api.get(`/reviews/business/${businessId}`),
  getAll: () => api.get('/reviews/all'),
  create: (data: any) => api.post('/reviews', data),
  update: (id: string, data: any) => api.put(`/reviews/${id}`, data),
  delete: (id: string) => api.delete(`/reviews/${id}`),
  approve: (id: string, approved: boolean) =>
    api.patch(`/reviews/${id}/approve`, null, { params: { approved } }),
};

// Contact
export const contactAPI = {
  sendMessage: (data: any) => api.post('/contact/message', data),
  getMessages: () => api.get('/contact/messages'),
  markRead: (id: string, read: boolean) =>
    api.patch(`/contact/messages/${id}/read`, null, { params: { read } }),
};

// Contact Info
export const contactInfoAPI = {
  get: () => api.get('/contact-info'),
  update: (data: any) => api.put('/contact-info', data),
};

// Stats
export const statsAPI = {
  get: () => api.get('/stats'),
};

export default api;
