import { axiosAuth } from './api';

const getAuthBaseUrl = () => {
  const authUrl =
    import.meta.env.VITE_AUTH_URL || 'https://banco-king-auth.onrender.com/api/v1';
  return authUrl.replace(/\/api\/v1\/?$/, '');
};

export const wakeAuthService = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000);
  try {
    await fetch(`${getAuthBaseUrl()}/health`, {
      method: 'GET',
      mode: 'cors',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
};

export const login = async (data) => {
  return await axiosAuth.post('/Auth/Login', data);
};

export const getAllUsers = async () => {
  const { data } = await axiosAuth.get('/User');
  return { users: data };
};

export const register = async (data) => {
  return await axiosAuth.post('/Auth/register', data);
};

export const verifyEmail = async (token) => {
  return await axiosAuth.post('/Auth/verify-email', { token });
};

export const updateUser = async (id, data) => {
  return await axiosAuth.put(`/user/${id}`, data);
};

export const getMyProfile = async () => {
  const { data } = await axiosAuth.get('/User/me');
  return { perfil: data };
};

export const assignRole = async (data) => {
  return await axiosAuth.post('/user/assign-role', data);
};
