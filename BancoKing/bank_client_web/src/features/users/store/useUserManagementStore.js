import { create } from 'zustand';
import {
  getAllUsers as getAllUsersRequest,
  register as createUserRequest,
  updateUser as updateUserRequest,
} from '../../../shared/api';

export const useUserManagementStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,
  filters: {},

  setFilters: (filters) => set({ filters }),

  setUsers: (users) => set({ users }),

  getAllUsers: async (apiFn = getAllUsersRequest, options = {}) => {
    try {
      const { force = false } = options;
      const state = get();

      if (state.loading) return;
      if (!force && state.users.length > 0) return;

      set({ loading: true, error: null });

      const fetcher = typeof apiFn === 'function' ? apiFn : getAllUsersRequest;

      const response = await fetcher();

      set({
        users: response.users || response,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error al obtener los usuarios',
        loading: false,
      });
    }
  },

  registerUser: async (userData) => {
    set({ loading: true, error: null });

    try {
      const response = await createUserRequest(userData);
      set({ loading: false });

      await get().getAllUsers(undefined, {
        force: true,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (err) {
      console.log(err.response?.data);

      const errorMessage = err.response?.data?.message || 'Error al registrar el usuario';

      set({
        error: errorMessage,
        loading: false,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  updateUser: async (id, userData) => {
    set({ loading: true, error: null });

    try {
      const response = await updateUserRequest(id, userData);

      const currentUsers = get().users;
      const updatedUsers = currentUsers.map((u) => (u.id === id ? { ...u, ...userData } : u));

      set({
        users: updatedUsers,
        loading: false,
        error: null,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar el usuario';

      set({
        error: errorMessage,
        loading: false,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  },
}));
