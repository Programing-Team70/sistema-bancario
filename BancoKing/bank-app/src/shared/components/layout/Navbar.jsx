import React from 'react';
import { Bell, Settings, User } from 'lucide-react';
import { UserMenu } from '../ui/UserMenu';
import '../../../styles/App.css';

export const Navbar = () => {
  return (
    <header className='top-navbar'>
      <div className='navbar-actions'>
        <button className='navbar-icon-btn notification -btn'>
          <Bell size={20} />

          <span className='notification-dot'></span>
        </button>

        <button className='navbar-icon-btn'>
          <Settings size={20} />
        </button>

        <UserMenu />
      </div>
    </header>
  );
};
