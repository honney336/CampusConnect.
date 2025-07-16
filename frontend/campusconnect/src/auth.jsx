import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Auth functions
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/user/login`, {
      email,
      password
    });

    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.user.role || 'student');
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('username', response.data.user.username);
      return response.data;
    }
    throw new Error(response.data.message || 'Login failed');
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Login failed');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

export const getUserId = () => {
  return localStorage.getItem('userId');
};

export const getUsername = () => {
  return localStorage.getItem('username');
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    // Basic JWT expiration check
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const setupAxiosInterceptors = (axiosInstance) => {
  // Request interceptor to add auth header
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor to handle 401 errors
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};