import axios from 'axios';

/**
 * Axios instance for backend API calls
 */
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000', // FastAPI backend
  withCredentials: true,
});

/**
 * Request interceptor → attach JWT token
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor → handle 401 globally
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // window.location.href = '/login'; // force re-login
    }
    return Promise.reject(error);
  }
);

export default API;
