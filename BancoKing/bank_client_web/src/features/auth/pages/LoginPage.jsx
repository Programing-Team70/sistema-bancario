import React from 'react';
import { Card, Typography } from '@material-tailwind/react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { LoginForm } from '../components/LoginForm';
import '../../../styles/App.css';

export const LoginPage = () => {
  return (
    <main className='auth-screen min-h-screen w-full flex items-center justify-center p-4 bg-gray-50'>
      <div className='auth-card w-full max-w-[26rem] shadow-xl rounded-2xl bg-white'>
        <div className='auth-header mb-8 flex flex-col items-center gap-2'>
          <div
            className='bg-blue-600 rounded-xl shadow-lg flex items-center justify-center'
            style={{
              width: '70px',
              height: '70px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheckIcon
              style={{ width: '50px', height: '50px', transform: 'translateX(145px)' }}
              className='text-white'
            />
          </div>

          <div className='text-center'>
            <h2 style={{ fontSize: '1.5rem', margin: '0' }}>Banco King</h2>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.1rem' }}>ACCESO SEGURO</span>
          </div>
        </div>

        <div className='px-2'>
          <LoginForm />
        </div>

        <div className='auth-footer mt-8 border-t border-gray-100 pt-4 text-center text-xs text-gray-400'>
          © {new Date().getFullYear()} Banco King
        </div>
      </div>
    </main>
  );
};
