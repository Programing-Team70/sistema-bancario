import { create } from 'zustand';
import { createDeposit as createDepositRequest } from '../../../shared/api/coreBank.js';
import { useAccountStore } from '../../accounts/store/useAccountStore';

export const useDepositStore = create((set, get) => ({
  loadingDeposit: false,
  errorDeposit: null,
  depositSuccess: false,

  executeDeposit: async (depositData) => {
    set({ loadingDeposit: true, errorDeposit: null, depositSuccess: false });

    try {
      const response = await createDepositRequest(depositData);
      const accountStore = useAccountStore.getState();

      await Promise.all([
        accountStore.getAllAccounts({ force: true }),
        accountStore.getFullAdminMoves({ force: true }),
      ]);

      set({
        loadingDeposit: false,
        depositSuccess: true,
      });

      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Error al procesar el depósito';

      set({
        errorDeposit: errorMessage,
        loadingDeposit: false,
        depositSuccess: false,
      });

      return { success: false, error: errorMessage };
    }
  },

  resetDepositState: () => {
    set({
      errorDeposit: null,
      loadingDeposit: false,
      depositSuccess: false,
    });
  },
}));
