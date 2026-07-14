import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginRequest } from '../../../shared/api';
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
      try {
        set({ loading: true, error: null });
        const { data } = await loginRequest({ emailOrUsername, password });
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

          setTimeout(() => set({ error: null }), 2000);

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
        let msg = err.response?.data?.message;
        if (!msg && err.code === 'ECONNABORTED') {
          msg =
            'El servidor está despertando (puede tardar ~1 min). Espera e intenta de nuevo.';
        } else if (!msg && !err.response) {
          msg =
            'No se pudo conectar al servidor. Verifica tu internet e intenta de nuevo.';
        } else if (!msg) {
          msg = 'Credenciales incorrectas';
        }
        set({ error: msg, loading: false });
        setTimeout(() => set({ error: null }), 2000);
        return { success: false, error: msg };
      }
    },
  })),
  {
    name: 'auth-storage',
  }
);
