import { create } from 'zustand';
import { createWithdrawal as createWithdrawalRequest } from '../../../shared/api/coreBank.js';
import { useAccountStore } from '../../accounts/store/useAccountStore';

export const useWithdrawalStore = create((set, get) => ({
  loadingWithdrawal: false,
  errorWithdrawal: null,
  withdrawalSuccess: false,

  executeWithdrawal: async (withdrawalData) => {
    set({ loadingWithdrawal: true, errorWithdrawal: null, withdrawalSuccess: false });

    try {
      const response = await createWithdrawalRequest(withdrawalData);
      const accountStore = useAccountStore.getState();

      await Promise.all([
        accountStore.getAllAccounts({ force: true }),
        accountStore.getFullAdminMoves({ force: true }),
      ]);

      set({
        loadingWithdrawal: false,
        withdrawalSuccess: true,
      });

      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Error al procesar el retiro';

      set({
        errorWithdrawal: errorMessage,
        loadingWithdrawal: false,
        withdrawalSuccess: false,
      });

      return { success: false, error: errorMessage };
    }
  },

  resetWithdrawalState: () => {
    set({
      errorWithdrawal: null,
      loadingWithdrawal: false,
      withdrawalSuccess: false,
    });
  },
}));
