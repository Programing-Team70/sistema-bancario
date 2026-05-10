import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, MailCheck } from 'lucide-react';

import { useVerifyEmail } from '../hooks/useVerifyEmail';

export const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = new URLSearchParams(location.search).get('token');

  const handleFinish = useCallback(() => {
    setTimeout(() => navigate('/'), 2500);
  }, [navigate]);

  const { status, message } = useVerifyEmail(token, handleFinish);

  const renderIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 size={70} className='verify-icon loading' />;

      case 'success':
        return <CheckCircle2 size={70} className='verify-icon success' />;

      case 'error':
        return <XCircle size={70} className='verify-icon error' />;

      default:
        return <MailCheck size={70} className='verify-icon' />;
    }
  };

  return (
    <main className='verify-page'>
      <section className='verify-card animate-modal'>
        <header className='verify-header'>
          <div className='verify-logo'>
            <MailCheck size={42} />
          </div>

          <h1>Banco King</h1>

          <span>VERIFICACIÓN DE CORREO</span>
        </header>

        <section className='verify-body'>
          {renderIcon()}

          <h2>
            {status === 'loading' && 'Verificando Correo'}
            {status === 'success' && 'Correo Verificado'}
            {status === 'error' && 'Verificación Fallida'}
          </h2>

          <p>{message}</p>

          {status === 'loading' && (
            <div className='verify-loader-bar'>
              <div className='verify-loader-progress'></div>
            </div>
          )}
        </section>

        <footer className='verify-footer'>SISTEMA DE GESTIÓN BANCARIA • 2026</footer>
      </section>
    </main>
  );
};
