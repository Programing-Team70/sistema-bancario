import { useEffect, useMemo, useState } from 'react';
import { useUserManagementStore } from '../store/useUserManagementStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { showError } from '../../../shared/utils/toast.js';
import { AddUserForm } from './AddUserForm.jsx';
import { UpdateUserForm } from './UpdateUserForm.jsx';
import { UserPlus, Eye } from 'lucide-react';
import '../../../styles/App.css';

const PAGE_SIZE = 8;

export const Users = () => {
  const { users, loading, error, getAllUsers } = useUserManagementStore();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return users.filter((u) => {
      const fullName = `${u.name || u.Name || ''} ${u.surname || u.Surname || ''}`
        .trim()
        .toLowerCase();
      const email = (u.email || u.Email || '').toLowerCase();
      const role = (u.role || u.Role || '').toUpperCase();

      const matchesSearch =
        !normalizedSearch ||
        fullName.includes(normalizedSearch) ||
        email.includes(normalizedSearch);
      const matchesRole = roleFilter === 'ALL' ? true : role === roleFilter.toUpperCase();
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, currentPage]);

  if (loading && users.length === 0) return <Spinner />;

  return (
    <div className='users-page'>
      <div
        className='users-header'
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div>
          <h1>Usuarios</h1>
          <p>Listado de usuarios registrados en el sistema</p>
        </div>

        <button
          className='btn-primary'
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
        >
          <UserPlus size={20} />
          Nuevo Usuario
        </button>
      </div>

      <div className='users-filters'>
        <div className='filters-grid'>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder='Buscar por nombre o email...'
            className='users-input'
          />

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className='users-select'
          >
            <option value='ALL'>Todos los roles</option>
            <option value='ADMIN_ROLE'>ADMIN_ROLE</option>
            <option value='USER_ROLE'>USER_ROLE</option>
          </select>
        </div>
      </div>

      <div className='users-table-card'>
        <div className='users-table-wrapper'>
          <table className='users-table'>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>DPI</th>
                <th>Ingresos</th>
                <th>Trabajo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td className='empty-state' colSpan={8}>
                    No se encontraron usuarios con esos criterios.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => (
                  <tr key={u.id || u._id}>
                    <td className='user-name'>{u.name || u.Name || '-'}</td>
                    <td>{u.surname || u.Surname || '-'}</td>
                    <td>{u.email || u.Email || '-'}</td>
                    <td>{u.phone || u.Phone || '-'}</td>
                    <td>{u.dpi || u.Dpi || '-'}</td>
                    <td>
                      {u.monthlyIncome || u.MonthlyIncome
                        ? `Q ${Number(u.monthlyIncome || u.MonthlyIncome).toLocaleString()}`
                        : '-'}
                    </td>
                    <td>{u.jobName || u.JobName || '-'}</td>
                    <td>
                      <span
                        className={`role-badge ${(u.role || u.Role) === 'ADMIN_ROLE' ? 'role-admin' : 'role-user'}`}
                      >
                        {u.role || u.Role}
                      </span>
                    </td>
                    <td>
                      <button
                        className='table-action-btn'
                        onClick={() => {
                          setSelectedUser(u);
                          setIsUpdateModalOpen(true);
                        }}
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className='pagination'>
          <p>
            Mostrando {(currentPage - 1) * PAGE_SIZE + (paginatedUsers.length ? 1 : 0)} -{' '}
            {(currentPage - 1) * PAGE_SIZE + paginatedUsers.length} de {filteredUsers.length}
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
        </div>
      </div>

      <AddUserForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <UpdateUserForm
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};
