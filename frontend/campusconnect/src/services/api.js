import axios from 'axios';
import { setupAxiosInterceptors } from '../auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup interceptors
setupAxiosInterceptors(api);

export default api;