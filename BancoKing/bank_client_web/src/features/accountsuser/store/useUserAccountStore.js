import { create } from 'zustand';
import {
  getMyAccounts as getMyAccountsRequest,
  getAccountStatement as getAccountStatementRequest,
} from '../../../shared/api/coreBank.js';

export const useUserAccountStore = create((set, get) => ({
  myAccounts: [],
  loadingAccounts: false,
  errorAccounts: null,

  selectedStatement: null,
  loadingStatement: false,
  errorStatement: null,

  filters: {
    orderAccounts: 'DESC',
    currencyStatement: 'GTQ',
  },

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  getMyAccounts: async (options = {}) => {
    const { force = false } = options;
    const state = get();

    if (state.loadingAccounts) return;
    if (!force && state.myAccounts.length > 0) return;

    set({ loadingAccounts: true, errorAccounts: null });

    try {
      const response = await getMyAccountsRequest(state.filters.orderAccounts);
      const rawData = response?.data ?? response;
      const accountsData = rawData?.accounts || (Array.isArray(rawData) ? rawData : []);

      set({
        myAccounts: accountsData,
        loadingAccounts: false,
      });

      return { success: true };
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Error al obtener tus cuentas';
      set({
        errorAccounts: errorMessage,
        loadingAccounts: false,
        myAccounts: [],
      });
      return { success: false, error: errorMessage };
    }
  },

  getAccountStatement: async (id, options = {}) => {
    const { force = false } = options;
    const state = get();

    if (state.loadingStatement) return;

    const currentStatementId = state.selectedStatement?.id || state.selectedStatement?._id;
    if (!force && currentStatementId === id) return;

    set({ loadingStatement: true, errorStatement: null });

    try {
      const response = await getAccountStatementRequest(id, state.filters.currencyStatement);
      const statementData = response?.data ?? response;

      set({
        selectedStatement: statementData,
        loadingStatement: false,
      });

      return { success: true, data: statementData };
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Error al obtener el estado de cuenta';
      set({
        errorStatement: errorMessage,
        loadingStatement: false,
        selectedStatement: null,
      });
      return { success: false, error: errorMessage };
    }
  },

  clearSelectedStatement: () => set({ selectedStatement: null, errorStatement: null }),

  clearUserStore: () =>
    set({
      myAccounts: [],
      errorAccounts: null,
      loadingAccounts: false,
      selectedStatement: null,
      loadingStatement: false,
      errorStatement: null,
      filters: {
        orderAccounts: 'DESC',
        currencyStatement: 'GTQ',
      },
    }),
}));
