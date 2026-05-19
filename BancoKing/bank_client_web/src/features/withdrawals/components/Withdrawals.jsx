import { useEffect, useState } from 'react';
import { Wallet, BanknoteArrowDown, ArrowLeft, ShieldAlert, BadgeDollarSign } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWithdrawalStore } from '../store/useWithdrawalStore';
import { showError, showSuccess } from '../../../shared/utils/toast';
import '../../../styles/App.css';

export const Withdrawals = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preloadedAccountNumber = location.state?.accountNumber || '';

  const {
    executeWithdrawal,
    loadingWithdrawal,
    errorWithdrawal,
    withdrawalSuccess,
    resetWithdrawalState,
  } = useWithdrawalStore();

  const [form, setForm] = useState({
    accountNumber: preloadedAccountNumber,
    amount: '',
  });

  useEffect(() => {
    if (errorWithdrawal) {
      showError(errorWithdrawal);
      resetWithdrawalState();
    }
  }, [errorWithdrawal, resetWithdrawalState]);

  useEffect(() => {
    if (withdrawalSuccess) {
      showSuccess('Retiro realizado correctamente');

      setForm({
        accountNumber: preloadedAccountNumber,
        amount: '',
      });

      resetWithdrawalState();
    }
  }, [withdrawalSuccess, resetWithdrawalState, preloadedAccountNumber]);

  useEffect(() => {
    return () => {
      resetWithdrawalState();
    };
  }, [resetWithdrawalState]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.accountNumber || !form.amount) {
      return showError('Todos los campos son obligatorios');
    }

    const result = await executeWithdrawal({
      accountNumber: form.accountNumber,
      amount: Number(form.amount),
    });

    if (result?.success) {
      navigate('/dashboard/accounts');
    }
  };

  return (
    <section className='users-page'>
      <div className='withdrawals-layout'>
        <div className='withdrawals-main-card'>
          <div className='withdrawals-header'>
            <div className='withdrawals-header-icon'>
              <BanknoteArrowDown size={38} />
            </div>

            <div>
              <div className='withdrawals-badge'>
                <BadgeDollarSign size={14} />
                BANK WITHDRAWALS
              </div>

              <h2>Procesar Retiro</h2>

              <p>
                Realiza retiros seguros desde cuentas bancarias registradas dentro del sistema
                administrativo.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='withdrawals-form'>
            <div className='withdrawals-grid'>
              <div className='field-group'>
                <label>Número de Cuenta</label>

                <div className='input-wrapper'>
                  <Wallet size={18} className='input-icon' />

                  <input
                    type='text'
                    name='accountNumber'
                    value={form.accountNumber}
                    onChange={handleChange}
                    placeholder='0000 0000 0000'
                  />
                </div>
              </div>

              <div className='field-group'>
                <label>Monto a Retirar</label>

                <div className='input-wrapper'>
                  <BanknoteArrowDown size={18} className='input-icon' />

                  <input
                    type='number'
                    min='1'
                    step='0.01'
                    name='amount'
                    value={form.amount}
                    onChange={handleChange}
                    placeholder='500.00'
                  />
                </div>
              </div>
            </div>

            <div className='withdrawals-amount-card'>
              <span>Total del retiro</span>

              <strong>Q {form.amount ? Number(form.amount).toFixed(2) : '0.00'}</strong>
            </div>

            <div className='withdrawals-warning-box'>
              <ShieldAlert size={20} />

              <div>
                Verifica cuidadosamente el número de cuenta y el monto antes de confirmar el retiro.
              </div>
            </div>

            <div className='withdrawals-actions'>
              <button
                type='button'
                className='btn-secondary'
                onClick={() => navigate('/dashboard/accounts')}
              >
                <ArrowLeft size={18} />
                Cancelar
              </button>

              <button type='submit' className='btn-withdraw' disabled={loadingWithdrawal}>
                <BanknoteArrowDown size={18} />

                {loadingWithdrawal ? 'Procesando retiro...' : 'Confirmar Retiro'}
              </button>
            </div>
          </form>
        </div>

        <aside className='withdrawals-side-card'>
          <div className='withdrawals-side-top'>
            <div className='withdrawals-side-icon'>
              <Wallet size={34} />
            </div>

            <h3>Información</h3>

            <p>
              Los retiros procesados se reflejan inmediatamente en el balance de la cuenta bancaria
              seleccionada.
            </p>
          </div>

          <div className='withdrawals-info-list'>
            <div className='withdrawals-info-item'>
              <span>Estado</span>
              <strong className='success-text'>Sistema Activo</strong>
            </div>

            <div className='withdrawals-info-item'>
              <span>Tipo de operación</span>
              <strong>Retiro Bancario</strong>
            </div>

            <div className='withdrawals-info-item'>
              <span>Seguridad</span>
              <strong>Validación Administrativa</strong>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};
