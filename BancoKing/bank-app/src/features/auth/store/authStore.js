import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginRequest } from '../../../shared/api';
import { showError } from '../../../shared/utils/toast.js';

export const useAuthStore = create(
  persist(
    (set, get) => ({
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
        const isValidRole = role === 'USER_ROLE';
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

      logout: async () => {
        await useAuthStore.persist.clearStorage();
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

          console.log('--- ENVIANDO PETICIÓN DE LOGIN ---');
          console.log('Payload enviado:', { emailOrUsername, password });

          const response = await loginRequest({ emailOrUsername, password });
          const { data } = response;

          console.log('--- RESPUESTA EXITOSA DEL BACKEND ---');
          console.log('Data recibida:', data);

          const role = data?.userDetails?.role;
          console.log('Rol detectado:', role);

          if (role !== 'USER_ROLE') {
            const permissionMessage = 'No tienes permisos para acceder';
            console.warn('Acceso denegado por rol no válido:', role);

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
          console.log('--- ERROR EN PETICIÓN DE LOGIN ---');
          console.log('Status Code:', err.response?.status);
          console.log('Respuesta Servidor (data):', err.response?.data);
          console.log('Mensaje Axios/Red:', err.message);

          const msg = err.response?.data?.message || 'Credenciales incorrectas';
          set({ error: msg, loading: false });
          setTimeout(() => set({ error: null }), 2000);
          return { success: false, error: msg };
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);