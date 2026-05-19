import { useEffect, useState } from 'react';
import { ShieldCheck, Crown, User, X, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUserManagementStore } from '../store/useUserManagementStore.js';

export const AssignRoleModal = ({ isOpen, onClose, user }) => {
  const { assingRole, loading } = useUserManagementStore();
  const [selectedRole, setSelectedRole] = useState('USER_ROLE');

  useEffect(() => {
    if (user) {
      setSelectedRole(user.role || user.Role || 'USER_ROLE');
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleAssignRole = async () => {
    const payload = { userId: user._id || user.id, roleName: selectedRole };
    const result = await assingRole(payload);

    if (result?.success) {
      toast.success('Rol actualizado correctamente');
      onClose();
    } else {
      toast.error(result?.error || 'No se pudo actualizar el rol');
    }
  };

  return (
    <section className='assign-role-overlay'>
      <article className='assign-role-modal'>
        <button className='assign-role-close' onClick={onClose}>
          <X size={20} />
        </button>

        <div className='assign-role-header'>
          <div className='assign-role-avatar'>{user.name?.charAt(0)}</div>

          <div>
            <h2>
              {user.name} {user.surname}
            </h2>

            <p>{user.email}</p>
          </div>
        </div>

        <div className='assign-role-body'>
          <h3>Selecciona un rol</h3>

          <div className='assign-role-options'>
            <button
              className={`assign-role-option ${selectedRole === 'USER_ROLE' ? 'active' : ''}`}
              onClick={() => setSelectedRole('USER_ROLE')}
            >
              <div className='assign-role-icon user'>
                <User size={22} />
              </div>

              <div className='assign-role-info'>
                <strong>Usuario</strong>

                <span>Acceso normal al sistema</span>
              </div>

              {selectedRole === 'USER_ROLE' && <CheckCircle2 size={22} />}
            </button>

            <button
              className={`assign-role-option ${selectedRole === 'ADMIN_ROLE' ? 'active' : ''}`}
              onClick={() => setSelectedRole('ADMIN_ROLE')}
            >
              <div className='assign-role-icon admin'>
                <Crown size={22} />
              </div>

              <div className='assign-role-info'>
                <strong>Administrador</strong>

                <span>Control total del sistema</span>
              </div>

              {selectedRole === 'ADMIN_ROLE' && <CheckCircle2 size={22} />}
            </button>
          </div>

          <button className='assign-role-save' onClick={handleAssignRole} disabled={loading}>
            <ShieldCheck size={18} />

            {loading ? 'Actualizando...' : 'Guardar Rol'}
          </button>
        </div>
      </article>
    </section>
  );
};
