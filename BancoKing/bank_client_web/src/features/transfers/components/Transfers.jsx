import { useEffect, useState } from 'react';
import { ArrowRightLeft, CreditCard, Wallet, FileText, Send, CheckCircle2 } from 'lucide-react';
import { useTransferStore } from '../store/useTransferStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { showError, showSuccess } from '../../../shared/utils/toast.js';
import '../../../styles/App.css';

export const Transfers = () => {
  const { executeTransfer, loadingTransfer, errorTransfer, transferSuccess, resetTransferState } =
    useTransferStore();

  const [form, setForm] = useState({
    senderAccountNumber: '',
    receiverAccountNumber: '',
    amount: '',
    description: '',
  });

  useEffect(() => {
    if (errorTransfer) {
      showError(errorTransfer);
      resetTransferState();
    }
  }, [errorTransfer]);

  useEffect(() => {
    if (transferSuccess) {
      showSuccess('Transferencia realizada correctamente');

      setForm({
        senderAccountNumber: '',
        receiverAccountNumber: '',
        amount: '',
        description: '',
      });

      resetTransferState();
    }
  }, [transferSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.senderAccountNumber.trim() || !form.receiverAccountNumber.trim() || !form.amount) {
      showError('Completa todos los campos obligatorios');
      return;
    }

    if (Number(form.amount) <= 0) {
      showError('El monto debe ser mayor a 0');
      return;
    }

    await executeTransfer({
      senderAccountNumber: form.senderAccountNumber.trim(),
      receiverAccountNumber: form.receiverAccountNumber.trim(),
      amount: Number(form.amount),
      description: form.description.trim(),
    });
  };

  return (
    <main className='users-page'>
      <header className='users-header'>
        <section>
          <h1>Transferencias Bancarias</h1>
          <p>Envía dinero entre cuentas registradas dentro del sistema bancario</p>
        </section>
      </header>

      <section className='transfer-layout'>
        <div className='transfer-main-card'>
          <div className='transfer-header'>
            <div className='transfer-header-icon'>
              <ArrowRightLeft size={30} />
            </div>

            <div>
              <span className='transfer-badge'>BANCO KING • TRANSFERENCIA</span>

              <h2>Nueva Transferencia</h2>

              <p>Completa la información necesaria para realizar el movimiento bancario.</p>
            </div>
          </div>

          <form className='transfer-form' onSubmit={handleSubmit}>
            <div className='transfer-grid'>
              <div className='field-group'>
                <label>Cuenta Emisora</label>

                <div className='input-wrapper'>
                  <CreditCard size={18} className='input-icon' />

                  <input
                    type='text'
                    name='senderAccountNumber'
                    placeholder='0000 0000 00 00'
                    value={form.senderAccountNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className='field-group'>
                <label>Cuenta Receptora</label>

                <div className='input-wrapper'>
                  <CreditCard size={18} className='input-icon' />

                  <input
                    type='text'
                    name='receiverAccountNumber'
                    placeholder='0000 0000 00 00'
                    value={form.receiverAccountNumber}
                    onChange={handleChange}
                  />
                </div>
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
                  placeholder='Pago de servicios, transferencia personal, compra, etc...'
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='transfer-actions'>
              <button
                type='button'
                className='btn-secondary'
                disabled={loadingTransfer}
                onClick={() => {
                  setForm({
                    senderAccountNumber: '',
                    receiverAccountNumber: '',
                    amount: '',
                    description: '',
                  });

                  resetTransferState();
                }}
              >
                Limpiar
              </button>

              <button type='submit' className='btn-transfer' disabled={loadingTransfer}>
                {loadingTransfer ? (
                  <Spinner />
                ) : (
                  <>
                    <Send size={18} />
                    Realizar Transferencia
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <aside className='transfer-side-card'>
          <div className='transfer-side-top'>
            <div className='side-icon-success'>
              <CheckCircle2 size={28} />
            </div>

            <h3>Transferencias Seguras</h3>

            <p>
              Todas las transferencias son verificadas y procesadas de forma segura dentro del
              sistema bancario.
            </p>
          </div>

          <div className='transfer-info-list'>
            <div className='transfer-info-item'>
              <span>Monto mínimo</span>
              <strong>Q 1.00</strong>
            </div>

            <div className='transfer-info-item'>
              <span>Procesamiento</span>
              <strong>Instantáneo</strong>
            </div>

            <div className='transfer-info-item'>
              <span>Estado</span>
              <strong className='success-text'>Disponible</strong>
            </div>
          </div>

          {transferSuccess && (
            <div className='transfer-success-box'>
              <CheckCircle2 size={18} />

              <span>La transferencia fue realizada correctamente.</span>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
};
