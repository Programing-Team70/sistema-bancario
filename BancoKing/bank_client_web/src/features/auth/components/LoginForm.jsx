import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import toast from 'react-hot-toast';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const res = await login({
      emailOrUsername: data.emailOrUsername,
      password: data.password,
    });

    if (res.success) {
      toast.success('¡Bienvenido a Banco King!');
      navigate('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='auth-form'>
      <div className='field-group'>
        <label className='field-label'>CORREO O USERNAME</label>
        <div className={`input-wrapper ${errors.emailOrUsername ? 'input-error-border' : ''}`}>
          <Mail className='input-icon' size={18} />
          <input
            {...register('emailOrUsername', { required: 'El usuario es obligatorio' })}
            type='text'
            placeholder='email@example.com'
          />
        </div>
        {errors.emailOrUsername && (
          <p className='validation-text'>{errors.emailOrUsername.message}</p>
        )}
      </div>

      <div className='field-group'>
        <label className='field-label'>CONTRASEÑA</label>
        <div className={`input-wrapper ${errors.password ? 'input-error-border' : ''}`}>
          <Lock className='input-icon' size={18} />
          <input
            {...register('password', { required: 'La contraseña es obligatoria' })}
            type={showPassword ? 'text' : 'password'}
            placeholder='********'
          />
          <button type='button' onClick={() => setShowPassword(!showPassword)} className='eye-btn'>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className='validation-text'>{errors.password.message}</p>}
      </div>

      {error && (
        <div className='error-alert-box'>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <button type='submit' disabled={loading} className='btn-primary'>
        {loading ? 'Conectando servidor...' : 'Entrar a mi cuenta'}
      </button>
    </form>
  );
};
