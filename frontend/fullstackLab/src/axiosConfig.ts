import axios from 'axios';

export const apiAuth = axios.create({
  baseURL: 'http://localhost:3000/api/auth',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAuthToken = () => {
  return localStorage.getItem('sessionToken');
};

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
