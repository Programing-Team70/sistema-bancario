import { useEffect, useState } from 'react';
import { ArrowDownCircle, CreditCard, Wallet, FileText, Send, CheckCircle2 } from 'lucide-react';
import { useDepositStore } from '../store/useDepositStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { showError, showSuccess } from '../../../shared/utils/toast.js';
import '../../../styles/App.css';

export const Deposits = () => {
  const { executeDeposit, loadingDeposit, errorDeposit, depositSuccess, resetDepositState } =
    useDepositStore();

  const [form, setForm] = useState({
    accountNumber: '',
    amount: '',
    description: '',
  });

  useEffect(() => {
    if (errorDeposit) {
      showError(errorDeposit);
      resetDepositState();
    }
  }, [errorDeposit]);

  useEffect(() => {
    if (depositSuccess) {
      showSuccess('Depósito realizado correctamente');

      setForm({
        accountNumber: '',
        amount: '',
        description: '',
      });

      resetDepositState();
    }
  }, [depositSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.accountNumber.trim() || !form.amount) {
      showError('Completa todos los campos obligatorios');
      return;
    }

    if (Number(form.amount) <= 0) {
      showError('El monto debe ser mayor a 0');
      return;
    }

    await executeDeposit({
      accountNumber: form.accountNumber.trim(),
      amount: Number(form.amount),
      description: form.description.trim(),
    });
  };

  return (
    <main className='users-page'>
      <header className='users-header'>
        <section>
          <h1>Depósitos Bancarios</h1>
          <p>Registra abonos y activa cuentas dentro del sistema bancario (Solo Administrador)</p>
        </section>
      </header>

      <section className='transfer-layout'>
        <div className='transfer-main-card'>
          <div className='transfer-header'>
            <div
              className='transfer-header-icon'
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}
            >
              <ArrowDownCircle size={30} />
            </div>

            <div>
              <span
                className='transfer-badge'
                style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}
              >
                BANCO KING • DEPÓSITO
              </span>

              <h2>Nuevo Depósito</h2>
              <p>Completa la información necesaria para abonar fondos a la cuenta destino.</p>
            </div>
          </div>

          <form className='transfer-form' onSubmit={handleSubmit}>
            <div className='field-group'>
              <label>Cuenta Destino</label>
              <div className='input-wrapper'>
                <CreditCard size={18} className='input-icon' />
                <input
                  type='text'
                  name='accountNumber'
                  placeholder='7812 6789 42 13'
                  value={form.accountNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='field-group'>
              <label>Monto</label>
              <div className='input-wrapper'>
                <Wallet size={18} className='input-icon' />
                <input
                  type='number'
                  min='1'
                  step='0.01'
                  name='amount'
                  placeholder='0.00'
                  value={form.amount}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='field-group'>
              <label>Descripción</label>
              <div className='input-wrapper textarea-wrapper'>
                <FileText size={18} className='input-icon textarea-icon' />
                <textarea
                  rows='4'
                  name='description'
                  placeholder='Depósito de casa, abono inicial, etc...'
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='transfer-actions'>
              <button
                type='button'
                className='btn-secondary'
                disabled={loadingDeposit}
                onClick={() => {
                  setForm({
                    accountNumber: '',
                    amount: '',
                    description: '',
                  });
                  resetDepositState();
                }}
              >
                Limpiar
              </button>

              <button
                type='submit'
                className='btn-transfer'
                style={{ backgroundColor: '#10b981' }}
                disabled={loadingDeposit}
              >
                {loadingDeposit ? (
                  <Spinner />
                ) : (
                  <>
                    <Send size={18} />
                    Realizar Depósito
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <aside className='transfer-side-card'>
          <div className='transfer-side-top'>
            <div
              className='side-icon-success'
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}
            >
              <CheckCircle2 size={28} />
            </div>

            <h3>Depósitos Autorizados</h3>
            <p>
              Como administrador, puedes registrar abonos directos. Si la cuenta destino está
              inactiva, se activará automáticamente al cumplir el monto mínimo.
            </p>
          </div>

          <div className='transfer-info-list'>
            <div className='transfer-info-item'>
              <span>Mínimo Activación</span>
              <strong>Q 50.00</strong>
            </div>

            <div className='transfer-info-item'>
              <span>Procesamiento</span>
              <strong>Instantáneo</strong>
            </div>

            <div className='transfer-info-item'>
              <span>Rol Requerido</span>
              <strong style={{ color: '#10b981' }}>Solo Admin</strong>
            </div>
          </div>

          {depositSuccess && (
            <div
              className='transfer-success-box'
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid #10b981',
                color: '#047857',
              }}
            >
              <CheckCircle2 size={18} />
              <span>El depósito fue realizado correctamente.</span>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
};
