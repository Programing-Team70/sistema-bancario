import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginRequest } from '../../../shared/api/auth.js';

const getLoginErrorMessage = (err) => {
  const msg = err.response?.data?.message;
  if (msg) return msg;
  if (err.code === 'ECONNABORTED' || !err.response) {
    return 'El servidor tardó en responder. Espera 1 minuto e intenta otra vez.';
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
      set({
        loading: true,
        loadingMessage: 'Conectando con el servidor (puede tardar ~1 min)...',
        error: null,
      });

      const credentials = {
        emailOrUsername: emailOrUsername.trim(),
        password: password.trim(),
      };

      try {
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
          setTimeout(() => set({ error: null }), 5000);
          return { success: false, error: permissionMessage };
        }

        set({
          user: data.userDetails,
          token: data.token,
          expiresAt: data.expiresAt,
          isAuthenticated: true,
          loading: false,
          loadingMessage: '',
          error: null,
        });
        return { success: true };
      } catch (err) {
        const msg = getLoginErrorMessage(err);
        set({ error: msg, loading: false, loadingMessage: '' });
        setTimeout(() => set({ error: null }), 6000);
        return { success: false, error: msg };
      }
    },
  })),
  {
    name: 'auth-storage',
  }
);
