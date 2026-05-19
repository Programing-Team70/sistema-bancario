import { X, AlertTriangle, Loader2, Ban } from 'lucide-react';
import { useAccountStore } from '../store/useAccountStore.js';

export const DisableAccountModal = ({ isOpen, onClose, accountNumber }) => {
  const { disableBankAccount, loadingDisable } = useAccountStore();

  if (!isOpen) return null;

  const handleDisable = async () => {
    const result = await disableBankAccount(accountNumber);

    if (result?.success) {
      onClose();
    }
  };

  return (
    <div className='modal-overlay animate-modal'>
      <div className='disable-account-modal'>
        <div className='disable-account-header'>
          <button className='modal-close-btn' onClick={onClose}>
            <X size={20} />
          </button>

          <div className='disable-account-icon'>
            <Ban size={40} />
          </div>

          <h2>Deshabilitar Cuenta</h2>

          <p>
            Estás a punto de deshabilitar la cuenta bancaria. Esta acción puede afectar operaciones
            futuras.
          </p>
        </div>

        <div className='disable-account-body'>
          <div className='disable-account-warning'>
            <AlertTriangle size={20} />

            <div>
              <strong>Número de Cuenta</strong>
              <span>{accountNumber}</span>
            </div>
          </div>

          <div className='disable-account-actions'>
            <button className='btn-secondary' onClick={onClose} disabled={loadingDisable}>
              Cancelar
            </button>

            <button className='btn-danger' onClick={handleDisable} disabled={loadingDisable}>
              {loadingDisable ? (
                <>
                  <Loader2 size={18} className='spin' />
                  Deshabilitando...
                </>
              ) : (
                <>
                  <Ban size={18} />
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
