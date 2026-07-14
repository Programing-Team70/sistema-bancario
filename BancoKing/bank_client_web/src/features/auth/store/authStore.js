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
    return 'El servidor está iniciando (puede tardar ~1 min). Intenta de nuevo.';
  }
  return 'Credenciales incorrectas';
};
import { showError } from '../../../shared/utils/toast.js';

export const useAuthStore = create(
  persist((set, get) => ({
    user: null,
    token: null,
    expiresAt: null,
    loading: false,
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
        error: null,
      });
    },

    login: async ({ emailOrUsername, password }) => {
      set({ loading: true, error: null });
      const credentials = { emailOrUsername, password };
      let lastError = null;

      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          if (attempt > 0) {
            await sleep(5000);
          }

          await wakeAuthService().catch(() => {});
          const { data } = await loginRequest(credentials);
          const role = data?.userDetails?.role;

          if (role !== 'ADMIN_ROLE' && role !== 'USER_ROLE') {
            const permissionMessage = 'No tienes permisos para acceder';
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              loading: false,
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
      set({ error: msg, loading: false });
      setTimeout(() => set({ error: null }), 4000);
      return { success: false, error: msg };
    },
  })),
  {
    name: 'auth-storage',
  }
);
