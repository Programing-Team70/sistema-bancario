import { create } from 'zustand';
import { createTransfer as createTransferRequest } from '../../../shared/api/coreBank.js';
import { useUserAccountStore } from '../../accountsuser/store/useUserAccountStore.js';

export const useTransferStore = create((set, get) => ({
  loadingTransfer: false,
  errorTransfer: null,
  transferSuccess: false,

  executeTransfer: async (transferData) => {
    set({ loadingTransfer: true, errorTransfer: null, transferSuccess: false });

    try {
      const response = await createTransferRequest(transferData);
      
      const userAccountStore = useUserAccountStore.getState();

      if (typeof userAccountStore.getMyAccounts === 'function') {
        await userAccountStore.getMyAccounts({ force: true });
      }

      set({
        loadingTransfer: false,
        transferSuccess: true,
      });

      return { success: true, data: response?.data ?? response };
    } catch (err) {
      console.log('Error post-transferencia:', err);
      const errorMessage = err?.response?.data?.message || 'Error al procesar la transferencia';

      set({
        errorTransfer: errorMessage,
        loadingTransfer: false,
        transferSuccess: false,
      });

      return { success: false, error: errorMessage };
    }
  },

  resetTransferState: () => {
    set({
      errorTransfer: null,
      loadingTransfer: false,
      transferSuccess: false,
    });
  },
}));