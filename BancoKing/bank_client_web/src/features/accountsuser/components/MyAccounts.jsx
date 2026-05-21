import { useEffect, useMemo, useState } from 'react';
import { ArrowUpDown, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserAccountStore } from '../store/useUserAccountStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { showError } from '../../../shared/utils/toast.js';
import '../../../styles/App.css';

const PAGE_SIZE = 7;

export const MyAccounts = () => {
  const navigate = useNavigate();

  const {
    myAccounts = [],
    loadingAccounts,
    errorAccounts,
    getMyAccounts,
    clearUserStore,
  } = useUserAccountStore();

  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);

  useEffect(() => {
    getMyAccounts();

    return () => {
      clearUserStore();
    };
  }, [getMyAccounts, clearUserStore]);

  useEffect(() => {
    if (errorAccounts) {
      showError(errorAccounts);
    }
  }, [errorAccounts]);

  const filteredAccounts = useMemo(() => {
    return myAccounts.filter((a) => {
      if (!a) return false;
      const accountType = (a.type || '').toUpperCase();
      const status = a.status;
      const matchesType = typeFilter === 'ALL' ? true : accountType === typeFilter.toUpperCase();
      const matchesStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'ACTIVE'
            ? status === true
            : status === false;

      return matchesType && matchesStatus;
    });
  }, [myAccounts, typeFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedAccounts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAccounts.slice(start, start + PAGE_SIZE);
  }, [filteredAccounts, currentPage]);

  if (loadingAccounts && myAccounts.length === 0) {
    return <Spinner />;
  }

  return (
    <section className='users-page'>
      <header className='users-header my-accounts-header'>
        <div>
          <h1>Mis Cuentas Bancarias</h1>
          <p>Resumen y estado de tus cuentas activas e inactivas</p>
        </div>

        <div className='my-accounts-actions'>
          <button
            className='btn-primary refresh-accounts-btn'
            onClick={() => getMyAccounts({ force: true })}
          >
            <ArrowUpDown size={20} />
            Actualizar
          </button>
        </div>
      </header>

      <section className='users-filters'>
        <div className='filters-grid half-columns-grid'>
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
                    No posees cuentas bancarias registradas o que coincidan con los filtros.
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
                          maximumFractionDigits: 2,
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
                        <button
                          title='Ver movimientos de esta cuenta'
                          onClick={() => navigate(`/dashboard/movements-user/${accountId}`)}
                          className='action-view-btn'
                        >
                          <Eye size={20} />
                        </button>
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
            {(currentPage - 1) * PAGE_SIZE + paginatedAccounts.length} de {filteredAccounts.length}
          </p>

          <div className='pagination-buttons'>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
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
  );
};
