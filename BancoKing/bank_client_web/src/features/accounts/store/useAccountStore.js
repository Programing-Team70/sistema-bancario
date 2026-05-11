import { create } from 'zustand';
import { getAllAccounts as getAllAccountsRequest } from '../../../shared/api/coreBank.js';

export const useAccountStore = create((set, get) => ({
  accounts: [],
  loading: false,
  error: null,
  filters: {
    order: 'ASC',
  },

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  getAllAccounts: async (options = {}) => {
    const { force = false } = options;
    const state = get();

    if (state.loading) return;
    if (!force && state.accounts.length > 0) return;

    set({ loading: true, error: null });

    try {
      const response = await getAllAccountsRequest(state.filters.order);

      const rawData = response?.data ?? response;
      const movementsData = rawData?.movements || (Array.isArray(rawData) ? rawData : []);

      set({
        accounts: movementsData,
        loading: false,
      });

      return { success: true };
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Error al obtener los movimientos';
      set({
        error: errorMessage,
        loading: false,
        accounts: [],
      });
      return { success: false, error: errorMessage };
    }
  },

  clearAccounts: () => set({ accounts: [], error: null, loading: false }),
}));
