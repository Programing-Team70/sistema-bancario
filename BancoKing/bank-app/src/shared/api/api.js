import axios from '../utils/axios.js';

const axiosAuth = axios.create({
  baseURL: process.env.EXPO_PUBLIC_AUTH_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const axiosCoreBank = axios.create({
  baseURL: process.env.EXPO_PUBLIC_CORE_BANK_SERVICE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configuración de interceptores para manejar token y headers
axiosAuth.interceptors.request.use((config) => {
  config._axiosClient = 'auth';
  // Importación diferida/dinámica para evitar el Require Cycle
  const { useAuthStore } = require('../../features/auth/store/authStore.js');
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosCoreBank.interceptors.request.use((config) => {
  config._axiosClient = 'core_bank_service';
  // Importación diferida/dinámica para evitar el Require Cycle
  const { useAuthStore } = require('../../features/auth/store/authStore.js');
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosAuth.interceptors.response.use((res) => res);
axiosCoreBank.interceptors.response.use((res) => res);

export { axiosAuth, axiosCoreBank };