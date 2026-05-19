import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useAccountStore } from '../store/useAccountStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { showError } from '../../../shared/utils/toast.js';
import '../../../styles/App.css';

const PAGE_SIZE = 8;

export const Movements = () => {
  const {
    movements,
    activeStatement,
    loadingMovements,
    loadingStatement,
    errorMovements,
    errorStatement,
    getFullAdminMoves,
    getAdminAccountStatement,
    filters,
    setFilters,
  } = useAccountStore();

  const [page, setPage] = useState(1);
  const [uuidSearch, setUuidSearch] = useState('');
  const [isSearchingStatement, setIsSearchingStatement] = useState(false);

  useEffect(() => {
    const cleanSearchStr = uuidSearch.replace(/\s+/g, '');
    if (isSearchingStatement && cleanSearchStr) {
      getAdminAccountStatement(cleanSearchStr, { force: true });
    } else {
      getFullAdminMoves({ force: true });
    }
  }, [filters.orderMovements, isSearchingStatement]);

  useEffect(() => {
    if (errorMovements) showError(errorMovements);
  }, [errorMovements]);

  useEffect(() => {
    if (errorStatement) showError(errorStatement);
  }, [errorStatement]);

  const displayedMovements = isSearchingStatement ? activeStatement : movements;
  const totalPages = Math.max(1, Math.ceil(displayedMovements.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedMovements = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return displayedMovements.slice(start, start + PAGE_SIZE);
  }, [displayedMovements, currentPage]);

  const handleSearchStatement = async () => {
    const cleanSearch = uuidSearch.replace(/\s+/g, '');
    if (!cleanSearch) return;

    const response = await getAdminAccountStatement(cleanSearch, {
      force: true,
    });

    if (response?.success) {
      setIsSearchingStatement(true);
      setPage(1);
    }
  };

  const handleClearSearch = async () => {
    setIsSearchingStatement(false);
    setUuidSearch('');
    setPage(1);
    await getFullAdminMoves({ force: true });
  };

  if (
    (loadingMovements && movements.length === 0) ||
    (loadingStatement && activeStatement.length === 0 && isSearchingStatement)
  ) {
    return <Spinner />;
  }

  return (
    <main className='users-page'>
      <header className='users-header'>
        <section>
          <h1>Movimientos Bancarios</h1>
          <p>Listado general de movimientos registrados en Banco King</p>
        </section>
      </header>

      <div className='filter-container'>
        <label htmlFor='order'>Orden:</label>

        <select
          id='order'
          value={filters.orderMovements}
          onChange={(e) => {
            const newOrder = e.target.value;
            setFilters({
              orderMovements: newOrder,
              orderStatements: newOrder,
            });
            setPage(1);
          }}
        >
          <option value='DESC'>Descendente</option>
          <option value='ASC'>Ascendente</option>
        </select>

        <div className='movements-search-group'>
          <input
            type='text'
            placeholder='Buscar estado de cuenta por UUID'
            value={uuidSearch}
            onChange={(e) => setUuidSearch(e.target.value)}
            className='movements-search-input'
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchStatement();
              }
            }}
          />

          <button
            onClick={handleSearchStatement}
            disabled={loadingStatement}
            className='movements-search-btn'
          >
            <Search size={18} />
            {loadingStatement ? 'Buscando...' : 'Buscar'}
          </button>

          {isSearchingStatement && (
            <button onClick={handleClearSearch} className='movements-clear-btn'>
              Mostrar todos
            </button>
          )}
        </div>
      </div>

      <section className='users-table-card' aria-labelledby='movements-table-title'>
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
                    No existen movimientos registrados para esta cuenta.
                  </td>
                </tr>
              ) : (
                paginatedMovements.map((movement, index) => (
                  <tr key={movement._id || movement.id || index}>
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
                          movement.type === 'DEPOSIT' ||
                          movement.type === 'DEPOSITO' ||
                          movement.type === 'TRANSFERENCIA'
                            ? 'role-admin'
                            : 'role-user'
                        }`}
                      >
                        {movement.type}
                      </mark>
                    </td>

                    <td>
                      {movement.accountNumber ||
                        movement.account ||
                        movement.to ||
                        movement.from ||
                        'N/A'}
                    </td>

                    <td
                      style={{
                        fontWeight: 'bold',
                        color:
                          movement.amount < 0 || movement.type === 'RETIRO' ? '#d32f2f' : '#2e7d32',
                      }}
                    >
                      <data value={movement.amount}>
                        {movement.amount < 0 || movement.type === 'RETIRO' ? '-' : ''} Q{' '}
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
            <strong>{displayedMovements.length}</strong>
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
