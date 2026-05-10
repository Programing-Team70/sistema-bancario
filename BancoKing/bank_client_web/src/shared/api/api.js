import axios from '../utils/axios.js';
import { useAuthStore } from '../../features/auth/store/authStore.js';

const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const axiosCoreBank = axios.create({
  baseURL: import.meta.env.VITE_CORE_BANK_SERVICE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configuración de interceptores para manejar token y headers
// Token
axiosAuth.interceptors.request.use((config) => {
  config._axiosClient = 'auth';
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosCoreBank.interceptors.request.use((config) => {
  config._axiosClient = 'core_bank_service';
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosAuth.interceptors.response.use((res) => res);
axiosCoreBank.interceptors.response.use((res) => res);

export { axiosAuth, axiosCoreBank };
