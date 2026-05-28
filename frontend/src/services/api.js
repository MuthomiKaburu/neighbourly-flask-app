import axios from 'axios';

const api = axios.create({
  // Clean URL without trailing slash
  baseURL: 'https://neighbourly-flask-app-1.onrender.com', 
});

// Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle Global Errors (Like Expired Tokens)
api.interceptors.response.use(
  (response) => response, // If request is successful, do nothing
  (error) => {
    // If the server returns 401 (Unauthorized), the token is likely expired
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token'); // Clear the dead token
      window.location.href = '/login';   // Force redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;