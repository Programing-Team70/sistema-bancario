import { create } from 'zustand';
import {
  getFullAdminMoves as getFullAdminMovesRequest,
  getAllAccounts as getAllAccountsRequest,
  createBankAccount as createBankAccountRequest,
  disableBankAccount as disableBankAccountRequest,
  enableBankAccount as enableBankAccountRequest,
  getAdminAccountStatement as getAdminAccountStatementRequest,
} from '../../../shared/api/coreBank.js';

export const useAccountStore = create((set, get) => ({
  movements: [],
  accounts: [],
  activeStatement: [],

  loadingMovements: false,
  loadingAccounts: false,
  loadingCreate: false,
  loadingDisable: false,
  loadingEnable: false,
  loadingStatement: false,

  errorMovements: null,
  errorAccounts: null,
  errorCreate: null,
  errorDisable: null,
  errorEnable: null,
  errorStatement: null,

  filters: {
    orderMovements: 'DESC',
    orderAccounts: 'DESC',
    orderStatements: 'DESC',
  },

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  getFullAdminMoves: async (options = {}) => {
    const { force = false } = options;
    const state = get();

    if (state.loadingMovements) return;
    if (!force && state.movements.length > 0) return;

    set({ loadingMovements: true, errorMovements: null });

    try {
      const response = await getFullAdminMovesRequest(state.filters.orderMovements);
      const rawData = response?.data ?? response;
      const movementsData = rawData?.movements || (Array.isArray(rawData) ? rawData : []);

      set({
        movements: movementsData,
        loadingMovements: false,
      });

      return { success: true };
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Error al obtener los movimientos';
      set({
        errorMovements: errorMessage,
        loadingMovements: false,
        movements: [],
      });
      return { success: false, error: errorMessage };
    }
  },

  getAllAccounts: async (options = {}) => {
    const { force = false } = options;
    const state = get();

    if (state.loadingAccounts) return;
    if (!force && state.accounts.length > 0) return;

    set({ loadingAccounts: true, errorAccounts: null });

    try {
      const response = await getAllAccountsRequest(state.filters.orderAccounts);
      const rawData = response?.data ?? response;
      const accountsData = rawData?.accounts || (Array.isArray(rawData) ? rawData : []);

      set({
        accounts: accountsData,
        loadingAccounts: false,
      });

      return { success: true };
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Error al obtener las cuentas';
      set({
        errorAccounts: errorMessage,
        loadingAccounts: false,
        accounts: [],
      });
      return { success: false, error: errorMessage };
    }
  },

  getAdminAccountStatement: async (id, options = {}) => {
    const state = get();

    const cleanId = id?.toString().replace(/\s+/g, '');

    if (!cleanId) return { success: false, error: 'El ID (UUID) de la cuenta es requerido' };
    if (state.loadingStatement) return;

    set({
      loadingStatement: true,
      errorStatement: null,
      activeStatement: [],
    });

    try {
      const response = await getAdminAccountStatementRequest(
        cleanId,
        state.filters.orderStatements
      );
      const rawData = response?.data ?? response;

      const statementData =
        rawData?.statement?.movements ||
        (Array.isArray(rawData?.statement) ? rawData.statement : []);

      set({
        activeStatement: statementData,
        loadingStatement: false,
      });

      return { success: true, data: statementData };
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Error al obtener el estado de cuenta';
      set({
        errorStatement: errorMessage,
        loadingStatement: false,
        activeStatement: [],
      });
      return { success: false, error: errorMessage };
    }
  },

  createBankAccount: async (userId, type) => {
    set({ loadingCreate: true, errorCreate: null });
    try {
      const response = await createBankAccountRequest({ userId, type });
      await get().getAllAccounts({ force: true });
      set({ loadingCreate: false });
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Error al crear la cuenta bancaria';
      set({ errorCreate: errorMessage, loadingCreate: false });
      return { success: false, error: errorMessage };
    }
  },

  disableBankAccount: async (accountNumber) => {
    set({ loadingDisable: true, errorDisable: null });
    try {
      const response = await disableBankAccountRequest({ accountNumber });
      await get().getAllAccounts({ force: true });
      set({ loadingDisable: false });
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || 'Error al deshabilitar la cuenta bancaria';
      set({ errorDisable: errorMessage, loadingDisable: false });
      return { success: false, error: errorMessage };
    }
  },

  enableBankAccount: async (accountNumber) => {
    set({ loadingEnable: true, errorEnable: null });
    try {
      const response = await enableBankAccountRequest({ accountNumber });
      await get().getAllAccounts({ force: true });
      set({ loadingEnable: false });
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Error al habilitar la cuenta bancaria';
      set({ errorEnable: errorMessage, loadingEnable: false });
      return { success: false, error: errorMessage };
    }
  },

  clearStore: () =>
    set({
      accounts: [],
      movements: [],
      activeStatement: [],
      errorMovements: null,
      errorAccounts: null,
      errorCreate: null,
      errorDisable: null,
      errorEnable: null,
      errorStatement: null,
      loadingMovements: false,
      loadingAccounts: false,
      loadingDisable: false,
      loadingEnable: false,
      loadingStatement: false,
    }),
}));
