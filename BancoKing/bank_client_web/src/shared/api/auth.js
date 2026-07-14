import { axiosAuth } from './api';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getAuthBaseUrl = () => {
  const authUrl =
    import.meta.env.VITE_AUTH_URL || 'https://banco-king-auth.onrender.com/api/v1';
  return authUrl.replace(/\/api\/v1\/?$/, '');
};

export const wakeAuthService = async (onProgress) => {
  const baseUrl = getAuthBaseUrl();

  for (let attempt = 1; attempt <= 8; attempt += 1) {
    onProgress?.(attempt);

    try {
      await fetch(`${baseUrl}/health`, { method: 'GET', mode: 'no-cors' });
    } catch {
      // no-cors still sends the request and helps wake Render.
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 90000);

      try {
        const response = await fetch(`${baseUrl}/health`, {
          method: 'GET',
          mode: 'cors',
          signal: controller.signal,
        });

        if (response.ok) {
          return true;
        }
      } finally {
        clearTimeout(timeout);
      }
    } catch {
      // During cold start Render may return 502 without CORS headers.
    }

    if (attempt < 8) {
      await sleep(20000);
    }
  }

  return false;
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
