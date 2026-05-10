import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const { logout } = useAuthStore();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
    { icon: User, label: 'Usuarios', to: '/dashboard/users' },
    { icon: Wallet, label: 'Cuentas', to: '/dashboard/movements' },
    { icon: History, label: 'Movimientos', to: '/dashboard/accounts' },
    { icon: ArrowLeftRight, label: 'Transferencias', to: '/dashboard/transfers' },
    { icon: PiggyBank, label: 'Ahorros', to: '/dashboard/savings' },
  ];

  const handleLogout = () => {
    toast.success('Sesión cerrada con éxito');
    logout();
  };

  return (
    <aside className='sidebar'>
      <div className='sidebar-logo'>
        <div className='logo-icon'>
          <Wallet size={20} />
        </div>
        <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>
          Banco King
        </span>
      </div>

      <nav className='sidebar-nav'>
        <p className='nav-label'>Menú Principal</p>

        {navItems.map((item) => {
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
