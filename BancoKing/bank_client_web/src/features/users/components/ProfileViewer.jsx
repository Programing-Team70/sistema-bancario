import React, { useEffect } from 'react';

import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  CreditCard,
  ShieldCheck,
  BadgeCheck,
  Pencil,
  X,
} from 'lucide-react';

import { useUserManagementStore } from '../store/useUserManagementStore.js';
import { useAuthStore } from '../../auth/store/authStore.js';

export const ProfileViewer = ({ isOpen, onClose, onEdit }) => {
  const authUser = useAuthStore((state) => state.user);

  const { myProfile, profile, loading } = useUserManagementStore();

  useEffect(() => {
    if (isOpen) {
      myProfile();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const user = profile || authUser;

  const initials = `${user?.name?.[0] || ''}${user?.surname?.[0] || ''}`;

  return (
    <section className='modal-overlay'>
      <article className='profile-card animate-modal'>
        <button type='button' className='modal-close-btn' onClick={onClose}>
          <X size={22} />
        </button>

        <header className='profile-header'>
          <div className='profile-avatar'>{initials || 'U'}</div>

          <h2>
            {user?.name} {user?.surname}
          </h2>

          <p>@{user?.username}</p>

          <div className='profile-role'>
            <ShieldCheck size={14} />
            {user?.role === 'ADMIN_ROLE' ? 'Administrador' : 'Cliente Bancario'}
          </div>
        </header>

        <main className='profile-body'>
          {loading ? (
            <div className='profile-loading'>
              <div className='loader-spinner'></div>
              <span>Cargando perfil...</span>
            </div>
          ) : (
            <>
              <section className='profile-grid'>
                <article className='profile-info-card'>
                  <div className='profile-icon-wrapper'>
                    <Mail size={18} />
                  </div>

                  <div>
                    <span>Correo Electrónico</span>
                    <h4>{user?.email || 'No disponible'}</h4>
                  </div>
                </article>

                <article className='profile-info-card'>
                  <div className='profile-icon-wrapper'>
                    <Phone size={18} />
                  </div>

                  <div>
                    <span>Teléfono</span>
                    <h4>{user?.phone || 'No disponible'}</h4>
                  </div>
                </article>

                <article className='profile-info-card'>
                  <div className='profile-icon-wrapper'>
                    <MapPin size={18} />
                  </div>

                  <div>
                    <span>Dirección</span>
                    <h4>{user?.address || 'No disponible'}</h4>
                  </div>
                </article>

                <article className='profile-info-card'>
                  <div className='profile-icon-wrapper'>
                    <Briefcase size={18} />
                  </div>

                  <div>
                    <span>Puesto</span>
                    <h4>{user?.job_name || user?.jobName || 'No disponible'}</h4>
                  </div>
                </article>

                <article className='profile-info-card'>
                  <div className='profile-icon-wrapper'>
                    <CreditCard size={18} />
                  </div>

                  <div>
                    <span>Ingresos Mensuales</span>
                    <h4>
                      Q.
                      {Number(user?.monthly_income || user?.monthlyIncome || 0).toLocaleString()}
                    </h4>
                  </div>
                </article>

                <article className='profile-info-card'>
                  <div className='profile-icon-wrapper'>
                    <BadgeCheck size={18} />
                  </div>

                  <div>
                    <span>Estado de Cuenta</span>
                    <h4 className='verified-status'>Cuenta Verificada</h4>
                  </div>
                </article>
              </section>

              <div className='profile-actions'>
                <button className='btn-profile-edit' onClick={onEdit}>
                  <Pencil size={18} />
                  Editar Perfil
                </button>
              </div>
            </>
          )}
        </main>

        <footer className='profile-footer'>SISTEMA BANCARIO • PERFIL DE USUARIO</footer>
      </article>
    </section>
  );
};
