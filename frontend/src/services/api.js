import axios from 'axios';

const api = axios.create({
  baseURL: 'https://neighbourly-flask-app-1.onrender.com',
});

// Automatically add the JWT token to every request if it exists in local storage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;