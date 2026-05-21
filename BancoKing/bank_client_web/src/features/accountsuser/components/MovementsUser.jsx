import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useUserAccountStore } from '../store/useUserAccountStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { showError } from '../../../shared/utils/toast.js';
import '../../../styles/App.css';

const PAGE_SIZE = 8;

export const MovementsUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    selectedStatement,
    loadingStatement,
    errorStatement,
    getAccountStatement,
    clearSelectedStatement,
    filters,
    setFilters,
  } = useUserAccountStore();

  const [page, setPage] = useState(1);

  useEffect(() => {
    if (id) {
      getAccountStatement(id, { force: true });
    }
    return () => {
      clearSelectedStatement();
    };
  }, [id, filters.currencyStatement]);

  useEffect(() => {
    if (errorStatement) showError(errorStatement);
  }, [errorStatement]);

  const movementsList = useMemo(() => {
    if (!selectedStatement) return [];
    if (Array.isArray(selectedStatement)) return selectedStatement;

    if (selectedStatement.statement && Array.isArray(selectedStatement.statement.movements)) {
      return selectedStatement.statement.movements;
    }

    return (
      selectedStatement.movements ||
      selectedStatement.transactions ||
      selectedStatement.history ||
      selectedStatement.data ||
      (Array.isArray(selectedStatement.account?.movements)
        ? selectedStatement.account.movements
        : []) ||
      []
    );
  }, [selectedStatement]);

  const accountHeaderInfo = useMemo(() => {
    return selectedStatement?.statement || null;
  }, [selectedStatement]);

  const totalPages = Math.max(1, Math.ceil(movementsList.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedMovements = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return movementsList.slice(start, start + PAGE_SIZE);
  }, [movementsList, currentPage]);

  if (loadingStatement && movementsList.length === 0) {
    return <Spinner />;
  }

  return (
    <main className='users-page'>
      <header className='users-header movements-header-container'>
        <button onClick={() => navigate(-1)} className='movements-clear-btn return-button-layout'>
          <ArrowLeft size={18} />
          Regresar
        </button>
        <section>
          <h1>Tu Historial de Movimientos</h1>
          <p>Detalle completo de transacciones asociadas a tu cuenta bancaria</p>
        </section>
      </header>

      {accountHeaderInfo && (
        <section className='account-summary-card'>
          <div className='account-summary-details'>
            <p className='summary-label'>Número de Cuenta</p>
            <h3 className='summary-value'>
              {accountHeaderInfo.accountNumber}
              <span className='role-badge role-user account-type-badge'>
                {accountHeaderInfo.accountType}
              </span>
            </h3>
          </div>
          <div className='account-summary-balance'>
            <p className='summary-label'>Saldo Disponible</p>
            <h2 className='balance-value'>
              {accountHeaderInfo.currency || filters.currencyStatement || 'GTQ'}{' '}
              {Number(accountHeaderInfo.balance || 0).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
          </div>
        </section>
      )}

      <div className='filter-container'>
        <div className='filter-select-group'>
          <label htmlFor='currency'>Moneda visualización:</label>
          <select
            id='currency'
            value={filters.currencyStatement || 'GTQ'}
            onChange={(e) => {
              setFilters({ currencyStatement: e.target.value });
              setPage(1);
            }}
            className='users-select currency-dropdown'
          >
            <option value='GTQ'>Quetzales (GTQ)</option>
            <option value='USD'>Dólares (USD)</option>
          </select>
        </div>

        <button
          className='btn-primary refresh-button-layout'
          onClick={() => getAccountStatement(id, { force: true })}
          disabled={loadingStatement}
        >
          <RefreshCw size={16} className={loadingStatement ? 'spin-animation' : ''} />
          {loadingStatement ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      <section className='users-table-card'>
        <div className='users-table-wrapper'>
          <table className='users-table'>
            <thead>
              <tr>
                <th scope='col'>#</th>
                <th scope='col'>Fecha</th>
                <th scope='col'>Tipo Transacción</th>
                <th scope='col'>Detalle / Destino</th>
                <th scope='col'>Monto</th>
              </tr>
            </thead>

            <tbody>
              {paginatedMovements.length === 0 ? (
                <tr>
                  <td className='empty-state' colSpan={5}>
                    No existen movimientos registrados para esta cuenta bancaria.
                  </td>
                </tr>
              ) : (
                paginatedMovements.map((movement, index) => {
                  const isNegative =
                    movement.amount < 0 || movement.type === 'RETIRO' || movement.type === 'DEBITO';

                  return (
                    <tr key={movement.id || movement._id || index}>
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
                        <span
                          className={`role-badge ${
                            movement.type === 'DEPOSIT' ||
                            movement.type === 'DEPOSITO' ||
                            movement.type === 'TRANSFERENCIA_RECIBIDA'
                              ? 'role-admin'
                              : 'role-user'
                          }`}
                        >
                          {movement.type}
                        </span>
                      </td>

                      <td>
                        {movement.accountNumber ||
                          movement.to ||
                          movement.description ||
                          'Operación en cuenta'}
                      </td>

                      <td className={isNegative ? 'amount-negative' : 'amount-positive'}>
                        <span>
                          {`${isNegative ? '-' : ''} ${filters.currencyStatement || 'GTQ'} ${Math.abs(
                            movement.amount
                          ).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <nav className='pagination'>
          <p>
            Mostrando{' '}
            <strong>{(currentPage - 1) * PAGE_SIZE + (paginatedMovements.length ? 1 : 0)}</strong> -{' '}
            <strong>{(currentPage - 1) * PAGE_SIZE + paginatedMovements.length}</strong> de{' '}
            <strong>{movementsList.length}</strong>
          </p>

          <div className='pagination-buttons'>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
              Anterior
            </button>

            <span>
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        </nav>
      </section>
    </main>
  );
};
