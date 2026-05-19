import { useEffect, useMemo, useState } from 'react';
import { ArrowUpDown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAccountStore } from '../store/useAccountStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { CreateAccountModal } from '../components/CreateAccountModal.jsx';
import { DisableAccountModal } from '../components/DisableAccountModal.jsx';
import { EnableAccountModal } from '../components/EnableAccountModal.jsx';
import { showError } from '../../../shared/utils/toast.js';
import '../../../styles/App.css';

const PAGE_SIZE = 7;

export const Accounts = () => {
  const navigate = useNavigate();
  const { accounts = [], loadingAccounts, errorAccounts, getAllAccounts } = useAccountStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [isEnableModalOpen, setIsEnableModalOpen] = useState(false);
  const [selectedAccountNumber, setSelectedAccountNumber] = useState(null);

  useEffect(() => {
    getAllAccounts();
  }, [getAllAccounts]);

  useEffect(() => {
    if (errorAccounts) {
      showError(errorAccounts);
    }
  }, [errorAccounts]);

  const handleOpenDisableModal = (accountNumber) => {
    setSelectedAccountNumber(accountNumber);
    setIsDisableModalOpen(true);
  };

  const handleOpenEnableModal = (accountNumber) => {
    setSelectedAccountNumber(accountNumber);
    setIsEnableModalOpen(true);
  };

  const filteredAccounts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return accounts.filter((a) => {
      if (!a) return false;

      const accountId = String(a.id || a._id || '').toLowerCase();
      const accountNumber = (a.accountNumber || a.accountnumber || '').toString().toLowerCase();
      const userId = (a.userId || '').toLowerCase();
      const accountType = (a.type || '').toUpperCase();
      const status = a.status;

      const matchesSearch =
        !normalizedSearch ||
        accountId.includes(normalizedSearch) ||
        accountNumber.includes(normalizedSearch) ||
        userId.includes(normalizedSearch);

      const matchesType = typeFilter === 'ALL' ? true : accountType === typeFilter.toUpperCase();

      const matchesStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'ACTIVE'
            ? status === true
            : status === false;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [accounts, search, typeFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedAccounts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;

    return filteredAccounts.slice(start, start + PAGE_SIZE);
  }, [filteredAccounts, currentPage]);

  if (loadingAccounts && accounts.length === 0) {
    return <Spinner />;
  }

  return (
    <>
      <section className='users-page'>
        <header
          className='users-header'
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h1>Cuentas</h1>

            <p>Listado de cuentas registradas en el sistema</p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <button
              className='btn-primary'
              onClick={() => setIsCreateModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
              }}
            >
              <Plus size={20} />
              Nueva Cuenta
            </button>

            <button
              className='btn-primary'
              onClick={() =>
                getAllAccounts({
                  force: true,
                })
              }
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
              }}
            >
              <ArrowUpDown size={20} />
              Actualizar
            </button>
          </div>
        </header>

        <section className='users-filters'>
          <div className='filters-grid'>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder='Buscar por cuenta, usuario o id...'
              className='users-input'
            />

            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className='users-select'
            >
              <option value='ALL'>Todos los tipos</option>

              <option value='MONETARIA'>Monetaria</option>

              <option value='AHORRO'>Ahorro</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className='users-select'
            >
              <option value='ALL'>Todos los estados</option>

              <option value='ACTIVE'>Activas</option>

              <option value='INACTIVE'>Inactivas</option>
            </select>
          </div>
        </section>

        <section className='users-table-card'>
          <div className='users-table-wrapper'>
            <table className='users-table'>
              <thead>
                <tr>
                  <th>No. Cuenta</th>
                  <th>Usuario</th>
                  <th>Tipo</th>
                  <th>Saldo</th>
                  <th>Moneda</th>
                  <th>Estado</th>
                  <th>Fecha creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {paginatedAccounts.length === 0 ? (
                  <tr>
                    <td className='empty-state' colSpan={8}>
                      No se encontraron cuentas.
                    </td>
                  </tr>
                ) : (
                  paginatedAccounts.map((a) => {
                    const accountId = a.id || a._id;

                    return (
                      <tr key={accountId}>
                        <td className='user-name'>{a.accountNumber || '-'}</td>

                        <td>{a.userId || '-'}</td>

                        <td>
                          <span
                            className={`role-badge ${
                              a.type === 'MONETARIA' ? 'role-admin' : 'role-user'
                            }`}
                          >
                            {a.type || '-'}
                          </span>
                        </td>

                        <td>
                          Q{' '}
                          {Number(a.balance || 0).toLocaleString('es-GT', {
                            minimumFractionDigits: 2,
                          })}
                        </td>

                        <td>{a.currency || '-'}</td>

                        <td>
                          <span className={`role-badge ${a.status ? 'role-admin' : 'role-user'}`}>
                            {a.status ? 'ACTIVA' : 'INACTIVA'}
                          </span>
                        </td>

                        <td>{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '-'}</td>

                        <td>
                          <div
                            style={{
                              display: 'flex',
                              gap: '10px',
                              flexWrap: 'wrap',
                            }}
                          >
                            {a.status ? (
                              <>
                                <button
                                  className='table-action-btn'
                                  onClick={() =>
                                    navigate('/dashboard/withdrawals', {
                                      state: { accountNumber: a.accountNumber },
                                    })
                                  }
                                  style={{
                                    background: '#eff6ff',
                                    color: '#2563eb',
                                    width: 'auto',
                                    padding: '0 16px',
                                    fontWeight: '700',
                                  }}
                                >
                                  Retirar
                                </button>

                                <button
                                  className='table-action-btn'
                                  onClick={() => handleOpenDisableModal(a.accountNumber)}
                                  style={{
                                    background: '#fef2f2',
                                    color: '#dc2626',
                                    width: 'auto',
                                    padding: '0 16px',
                                    fontWeight: '700',
                                  }}
                                >
                                  Deshabilitar
                                </button>
                              </>
                            ) : (
                              <button
                                className='table-action-btn'
                                onClick={() => handleOpenEnableModal(a.accountNumber)}
                                style={{
                                  background: '#ecfdf5',
                                  color: '#16a34a',
                                  width: 'auto',
                                  padding: '0 16px',
                                  fontWeight: '700',
                                }}
                              >
                                Habilitar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <footer className='pagination'>
            <p>
              Mostrando {(currentPage - 1) * PAGE_SIZE + (paginatedAccounts.length ? 1 : 0)} -{' '}
              {(currentPage - 1) * PAGE_SIZE + paginatedAccounts.length} de{' '}
              {filteredAccounts.length}
            </p>

            <div className='pagination-buttons'>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </button>

              <span>
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
          </footer>
        </section>
      </section>

      <CreateAccountModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      <DisableAccountModal
        isOpen={isDisableModalOpen}
        onClose={() => setIsDisableModalOpen(false)}
        accountNumber={selectedAccountNumber}
      />

      <EnableAccountModal
        isOpen={isEnableModalOpen}
        onClose={() => setIsEnableModalOpen(false)}
        accountNumber={selectedAccountNumber}
      />
    </>
  );
};
