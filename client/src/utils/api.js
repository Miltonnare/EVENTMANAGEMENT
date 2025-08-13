import axios from 'axios';

// Vite dev uses proxy for "/api" → http://localhost:5000 per vite.config.js
// In production, this will call relative "/api" on the same origin.

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;


