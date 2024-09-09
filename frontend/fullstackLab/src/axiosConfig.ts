import axios from 'axios';

// Criação da instância axios padrão
export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função para obter o token do localStorage
const getAuthToken = () => {
  return localStorage.getItem('sessionToken'); // Corrija 'seesionToken' para 'sessionToken'
};

// Criação da instância axios para API protegida
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
