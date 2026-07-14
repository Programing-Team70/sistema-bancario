import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginRequest, wakeAuthService } from '../../../shared/api/auth.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableLoginError = (err) =>
  !err.response || err.code === 'ECONNABORTED' || err.response?.status >= 502;

const getLoginErrorMessage = (err) => {
  const msg = err.response?.data?.message;
  if (msg) return msg;
  if (err.code === 'ECONNABORTED' || !err.response) {
    return 'El servidor tardó demasiado. Toca entrar otra vez y espera ~1 min.';
  }
  return 'Credenciales incorrectas';
};

export const useAuthStore = create(
  persist((set, get) => ({
    user: null,
    token: null,
    expiresAt: null,
    loading: false,
    loadingMessage: '',
    error: null,
    isLoadingAuth: true,
    isAuthenticated: false,

    setUser: (updatedUser) => {
      set({ user: updatedUser });
    },

    checkAuth: () => {
      const { token, user } = get();
      const role = user?.role;
      const isValidRole = role === 'ADMIN_ROLE' || role === 'USER_ROLE';
      if (token && !isValidRole) {
        set({
          user: null,
          token: null,
          expiresAt: null,
          isAuthenticated: false,
          isLoadingAuth: false,
          error: 'No tienes permisos para acceder a esta aplicación',
        });
        return;
      }
      set({
        isLoadingAuth: false,
        isAuthenticated: Boolean(token) && isValidRole,
      });
    },

    logout: () => {
      useAuthStore.persist.clearStorage();
      localStorage.removeItem('auth-storage');
      set({
        user: null,
        token: null,
        expiresAt: null,
        isAuthenticated: false,
        loading: false,
        loadingMessage: '',
        error: null,
      });
    },

    login: async ({ emailOrUsername, password }) => {
      set({ loading: true, loadingMessage: 'Despertando servidor...', error: null });
      const credentials = { emailOrUsername, password };
      let lastError = null;

      const serverReady = await wakeAuthService((attempt) => {
        set({ loadingMessage: `Despertando servidor... (${attempt}/8)` });
      });

      if (!serverReady) {
        set({ loadingMessage: 'Servidor lento, intentando login...' });
        await sleep(5000);
      }

      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          if (attempt > 0) {
            set({ loadingMessage: `Reintentando login... (${attempt + 1}/3)` });
            await sleep(10000);
          } else {
            set({ loadingMessage: 'Validando credenciales...' });
          }

          const { data } = await loginRequest(credentials);
          const role = data?.userDetails?.role;

          if (role !== 'ADMIN_ROLE' && role !== 'USER_ROLE') {
            const permissionMessage = 'No tienes permisos para acceder';
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              loading: false,
              loadingMessage: '',
              error: permissionMessage,
            });

            setTimeout(() => set({ error: null }), 4000);
            return { success: false, error: permissionMessage };
          }

          set({
            user: data.userDetails,
            token: data.token,
            expiresAt: data.expiresIn,
            isAuthenticated: true,
            loading: false,
            loadingMessage: '',
            error: null,
          });
          return { success: true };
        } catch (err) {
          lastError = err;
          if (!isRetryableLoginError(err) || attempt === 2) {
            break;
          }
        }
      }

      const msg = getLoginErrorMessage(lastError);
      set({ error: msg, loading: false, loadingMessage: '' });
      setTimeout(() => set({ error: null }), 6000);
      return { success: false, error: msg };
    },
  })),
  {
    name: 'auth-storage',
  }
);
