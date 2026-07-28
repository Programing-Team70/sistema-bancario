import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  PiggyBank,
  LogOut,
  User,
  History,
} from 'lucide-react';
import toast from 'react-hot-toast';
import '../../../styles/App.css';
import { useAuthStore } from '../../../features/auth/store/authStore';

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { logout, user } = useAuthStore();

  const navItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      to: '/dashboard',
      roles: ['ADMIN_ROLE', 'USER_ROLE'],
    },
    {
      icon: User,
      label: 'Usuarios',
      to: '/dashboard/users',
      roles: ['ADMIN_ROLE'],
    },
    {
      icon: Wallet,
      label: 'Cuentas',
      to: '/dashboard/accounts',
      roles: ['ADMIN_ROLE', 'USER_ROLE'],
    },
    {
      icon: History,
      label: 'Movimientos',
      to: '/dashboard/movements',
      roles: ['ADMIN_ROLE'],
    },
    {
      icon: PiggyBank,
      label: 'Depósitos',
      to: '/dashboard/deposits',
      roles: ['ADMIN_ROLE'],
    },
    {
      icon: ArrowLeftRight,
      label: 'Transferencias',
      to: '/dashboard/transfers',
      roles: ['ADMIN_ROLE', 'USER_ROLE'],
    },
  ];

  const filteredNavItems = navItems.filter((item) => item.roles.includes(user?.role));

  const handleLogout = () => {
    toast.success('Sesión cerrada con éxito');

    logout();

    navigate('/');
  };

  return (
    <aside className='sidebar'>
      <div className='sidebar-logo'>
        <div className='logo-icon'>
          <Wallet size={20} />
        </div>

        <span
          style={{
            fontSize: '18px',
            fontWeight: '700',
            color: 'var(--text-main)',
          }}
        >
          Banco King
        </span>
      </div>

      <nav className='sidebar-nav'>
        <p className='nav-label'>Menú Principal</p>

        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.label}
              to={item.to}
              className={`nav-button ${isActive ? 'active' : ''}`}
              style={{ textDecoration: 'none' }}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className='btn-logout'>
        <button onClick={handleLogout} className='nav-button logout'>
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
