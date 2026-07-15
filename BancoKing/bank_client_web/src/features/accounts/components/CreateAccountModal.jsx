import { useEffect, useMemo, useState } from 'react';
import { X, Landmark, User, LoaderCircle } from 'lucide-react';
import { useAccountStore } from '../store/useAccountStore.js';
import { useUserManagementStore } from '../../users/store/useUserManagementStore.js';
import { showError, showSuccess } from '../../../shared/utils/toast.js';

export const CreateAccountModal = ({ isOpen, onClose }) => {
  const { createBankAccount, loadingCreate, errorCreate, clearStore } = useAccountStore();
  const { users = [], loading: loadingUsers, getAllUsers } = useUserManagementStore();

  const [formData, setFormData] = useState({
    userId: '',
    type: 'Monetaria',
  });

  useEffect(() => {
    if (isOpen) {
      getAllUsers();
    }
  }, [isOpen, getAllUsers]);

  const activeUsers = useMemo(
    () =>
      users.filter((u) => {
        const status = u.status ?? u.Status;
        return status === true;
      }),
    [users]
  );

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
      return showError('Debes seleccionar un usuario');
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
              <label htmlFor='userId'>USUARIO</label>
              <div className='input-wrapper'>
                <User size={18} className='input-icon' />
                <select
                  id='userId'
                  name='userId'
                  value={formData.userId}
                  onChange={handleChange}
                  className='create-account-select'
                  disabled={loadingUsers}
                >
                  <option value=''>
                    {loadingUsers ? 'Cargando usuarios...' : 'Selecciona un usuario'}
                  </option>
                  {activeUsers.map((u) => {
                    const id = u.id || u._id;
                    const name = `${u.name || u.Name || ''} ${u.surname || u.Surname || ''}`.trim();
                    const email = u.email || u.Email || '';
                    return (
                      <option key={id} value={id}>
                        {name || email} ({id})
                      </option>
                    );
                  })}
                </select>
              </div>
              {!loadingUsers && activeUsers.length === 0 && (
                <p style={{ fontSize: '0.85rem', color: '#b45309', marginTop: '0.5rem' }}>
                  No hay usuarios activos. El usuario debe verificar su correo antes de crear una
                  cuenta.
                </p>
              )}
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

              <button
                type='submit'
                className='btn-primary'
                disabled={loadingCreate || loadingUsers || activeUsers.length === 0}
              >
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
