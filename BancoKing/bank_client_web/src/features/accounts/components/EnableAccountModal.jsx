import { CheckCircle2, Loader2, ShieldCheck, X } from 'lucide-react';
import { useAccountStore } from '../store/useAccountStore.js';
export const EnableAccountModal = ({ isOpen, onClose, accountNumber }) => {
  const { enableBankAccount, loadingEnable } = useAccountStore();

  if (!isOpen) return null;

  const handleEnable = async () => {
    const result = await enableBankAccount(accountNumber);

    if (result?.success) {
      onClose();
    }
  };

  return (
    <div className='modal-overlay animate-modal'>
      <div className='enable-account-modal'>
        <div className='enable-account-header'>
          <button className='modal-close-btn' onClick={onClose}>
            <X size={20} />
          </button>

          <div className='enable-account-icon'>
            <ShieldCheck size={42} />
          </div>

          <h2>Habilitar Cuenta</h2>

          <p>La cuenta bancaria volverá a estar disponible para operaciones y movimientos.</p>
        </div>

        <div className='enable-account-body'>
          <div className='enable-account-card'>
            <CheckCircle2 size={22} />

            <div>
              <strong>Número de Cuenta</strong>

              <span>{accountNumber}</span>
            </div>
          </div>

          <div className='enable-account-actions'>
            <button className='btn-secondary' onClick={onClose} disabled={loadingEnable}>
              Cancelar
            </button>

            <button className='btn-success' onClick={handleEnable} disabled={loadingEnable}>
              {loadingEnable ? (
                <>
                  <Loader2 size={18} className='spin' />
                  Habilitando...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  Confirmar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
