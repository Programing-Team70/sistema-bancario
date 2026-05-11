import { useEffect, useMemo, useState } from 'react';
import { useAccountStore } from '../store/useAccountStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { showError } from '../../../shared/utils/toast.js';
import '../../../styles/App.css';

const PAGE_SIZE = 8;

export const Accounts = () => {
  const { accounts, loading, error, getAllAccounts } = useAccountStore();
  const [page, setPage] = useState(1);

  useEffect(() => {
    getAllAccounts({ force: true });
  }, []);

  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  const totalPages = Math.max(1, Math.ceil(accounts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedMovements = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return accounts.slice(start, start + PAGE_SIZE);
  }, [accounts, currentPage]);

  if (loading && accounts.length === 0) return <Spinner />;

  return (
    <main className='users-page'>
      <header className='users-header'>
        <section>
          <h1>Movimientos Bancarios</h1>
          <p>Listado general de movimientos registrados en Banco King</p>
        </section>
      </header>

      <section className='users-table-card' aria-labelledby='movements-table-title'>
        <h2 id='movements-table-title' className='sr-only'>
          Tabla de transacciones detallada
        </h2>

        <div className='users-table-wrapper'>
          <table className='users-table'>
            <thead>
              <tr>
                <th scope='col'>#</th>
                <th scope='col'>Fecha</th>
                <th scope='col'>Tipo</th>
                <th scope='col'>Cuenta / Destino</th>
                <th scope='col'>Monto</th>
              </tr>
            </thead>

            <tbody>
              {paginatedMovements.length === 0 ? (
                <tr>
                  <td className='empty-state' colSpan={5}>
                    No existen movimientos registrados.
                  </td>
                </tr>
              ) : (
                paginatedMovements.map((movement, index) => (
                  <tr key={movement._id || index}>
                    <th scope='row' className='user-name'>
                      {(currentPage - 1) * PAGE_SIZE + (index + 1)}
                    </th>

                    <td>
                      {movement.date ? (
                        <time dateTime={movement.date}>
                          {new Date(movement.date).toLocaleDateString('es-GT', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </time>
                      ) : (
                        '-'
                      )}
                    </td>

                    <td>
                      <mark
                        className={`role-badge ${
                          movement.type === 'DEPOSIT' || movement.type === 'TRANSFERENCIA'
                            ? 'role-admin'
                            : 'role-user'
                        }`}
                      >
                        {movement.type}
                      </mark>
                    </td>

                    <td>{movement.account || movement.to || movement.from || 'N/A'}</td>

                    <td
                      style={{
                        fontWeight: 'bold',
                        color: movement.amount < 0 ? '#d32f2f' : '#2e7d32',
                      }}
                    >
                      <data value={movement.amount}>
                        {movement.amount < 0 ? '-' : ''} Q{' '}
                        {Math.abs(movement.amount).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </data>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <nav className='pagination' aria-label='Navegación de movimientos'>
          <p>
            Mostrando{' '}
            <strong>{(currentPage - 1) * PAGE_SIZE + (paginatedMovements.length ? 1 : 0)}</strong> -{' '}
            <strong>{(currentPage - 1) * PAGE_SIZE + paginatedMovements.length}</strong> de{' '}
            <strong>{accounts.length}</strong>
          </p>
          <div className='pagination-buttons'>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label='Ir a la página anterior'
            >
              Anterior
            </button>
            <span aria-current='page'>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label='Ir a la página siguiente'
            >
              Siguiente
            </button>
          </div>
        </nav>
      </section>
    </main>
  );
};
