import { useEffect, useState } from 'react';
import { X, Landmark, User, LoaderCircle } from 'lucide-react';
import { useAccountStore } from '../store/useAccountStore.js';
import { showError, showSuccess } from '../../../shared/utils/toast.js';

export const CreateAccountModal = ({ isOpen, onClose }) => {
  const { createBankAccount, loadingCreate, errorCreate, clearStore } = useAccountStore();

  const [formData, setFormData] = useState({
    userId: '',
    type: 'Monetaria',
  });

  useEffect(() => {
    if (errorCreate) {
      showError(errorCreate);
    }
  }, [errorCreate]);

  useEffect(() => {
    return () => {
      clearStore();
    };
  }, [clearStore]);

  const handleChange = ({ target }) => {
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userId.trim()) {
      return showError('Debes ingresar un ID de usuario');
    }

    const result = await createBankAccount(formData.userId.trim(), formData.type);

    if (!result?.success) return;

    showSuccess('Cuenta creada correctamente');

    setFormData({
      userId: '',
      type: 'Monetaria',
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <section className='modal-overlay'>
      <article className='create-account-modal animate-modal'>
        <header className='create-account-header'>
          <div>
            <span className='modal-tag'>
              <Landmark size={12} />
              BANCO KING ACCOUNTS
            </span>
            <h2>Crear Nueva Cuenta</h2>
            <p>Registra una nueva cuenta bancaria para un usuario del sistema.</p>
          </div>

          <button type='button' className='modal-close-btn' onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <main className='create-account-body'>
          <form className='create-account-form' onSubmit={handleSubmit}>
            <div className='field-group'>
              <label htmlFor='userId'>ID DEL USUARIO</label>
              <div className='input-wrapper'>
                <User size={18} className='input-icon' />
                <input
                  id='userId'
                  name='userId'
                  type='text'
                  placeholder='Ingresa el ID del usuario'
                  value={formData.userId}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='field-group'>
              <label htmlFor='type'>TIPO DE CUENTA</label>
              <div className='input-wrapper'>
                <Landmark size={18} className='input-icon' />
                <select
                  id='type'
                  name='type'
                  value={formData.type}
                  onChange={handleChange}
                  className='create-account-select'
                >
                  <option value='Monetaria'>Monetaria</option>
                  <option value='Ahorro'>Ahorro</option>
                </select>
              </div>
            </div>

            <footer className='create-account-footer'>
              <button type='button' className='btn-secondary' onClick={onClose}>
                Cancelar
              </button>

              <button type='submit' className='btn-primary' disabled={loadingCreate}>
                {loadingCreate ? (
                  <>
                    <LoaderCircle size={18} className='spin' />
                    Creando...
                  </>
                ) : (
                  'Crear Cuenta'
                )}
              </button>
            </footer>
          </form>
        </main>
      </article>
    </section>
  );
};
