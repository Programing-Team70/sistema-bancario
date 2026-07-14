import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Briefcase,
  CreditCard,
  IdCard,
  UserPlus,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';

import toast from 'react-hot-toast';
import { useUserManagementStore } from '../store/useUserManagementStore.js';

export const AddUserForm = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

  const { registerUser, loading } = useUserManagementStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      dpi: data.dpi,
      monthlyIncome: Number(data.monthlyIncome),
      role: 'USER_ROLE',
    };

    const result = await registerUser(payload);

    if (result?.success) {
      toast.success('Usuario registrado en Banco King');

      reset();
      onClose();
    } else {
      toast.error(result?.error || 'No se pudo registrar');
    }
  };

  if (!isOpen) return null;

  return (
    <section className='modal-overlay'>
      <article className='auth-card wide animate-modal'>
        <button
          type='button'
          className='modal-close-btn'
          onClick={onClose}
          aria-label='Cerrar formulario'
        >
          <X size={24} />
        </button>

        <header className='auth-header'>
          <h2>Registrar Usuario</h2>

          <span>Formulario de Apertura de Cuenta</span>
        </header>

        <main>
          <form onSubmit={handleSubmit(onSubmit)} className='auth-form'>
            <fieldset>
              <legend>Datos Personales</legend>

              <div className='grid-2'>
                <div className='field-group'>
                  <label>Nombre</label>

                  <div className='input-wrapper'>
                    <User className='input-icon' size={18} />

                    <input
                      {...register('name', {
                        required: 'El nombre es obligatorio',
                      })}
                      placeholder='Nombre'
                    />
                  </div>

                  {errors.name && <small className='error-text'>{errors.name.message}</small>}
                </div>

                <div className='field-group'>
                  <label>Apellido</label>

                  <div className='input-wrapper'>
                    <User className='input-icon' size={18} />

                    <input
                      {...register('surname', {
                        required: 'El apellido es obligatorio',
                      })}
                      placeholder='Apellido'
                    />
                  </div>

                  {errors.surname && <small className='error-text'>{errors.surname.message}</small>}
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend>Información de Cuenta</legend>

              <div className='grid-2'>
                <div className='field-group'>
                  <label>Nombre de Usuario</label>

                  <div className='input-wrapper'>
                    <UserPlus className='input-icon' size={18} />

                    <input
                      {...register('username', {
                        required: 'El username es obligatorio',
                      })}
                      placeholder='Username'
                    />
                  </div>

                  {errors.username && (
                    <small className='error-text'>{errors.username.message}</small>
                  )}
                </div>

                <div className='field-group'>
                  <label>Correo Electrónico</label>

                  <div className='input-wrapper'>
                    <Mail className='input-icon' size={18} />

                    <input
                      type='email'
                      {...register('email', {
                        required: 'El correo es obligatorio',
                      })}
                      placeholder='Email'
                    />
                  </div>

                  {errors.email && <small className='error-text'>{errors.email.message}</small>}
                </div>
              </div>

              <div className='grid-2'>
                <div className='field-group'>
                  <label>Teléfono</label>

                  <div className='input-wrapper'>
                    <Phone className='input-icon' size={18} />

                    <input
                      type='tel'
                      {...register('phone', {
                        required: 'El teléfono es obligatorio',
                        minLength: {
                          value: 8,
                          message: 'Mínimo 8 dígitos',
                        },
                      })}
                      placeholder='Teléfono'
                    />
                  </div>

                  {errors.phone && <small className='error-text'>{errors.phone.message}</small>}
                </div>

                <div className='field-group'>
                  <label>Contraseña</label>

                  <div className='input-wrapper'>
                    <Lock className='input-icon' size={18} />

                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', {
                        required: 'La contraseña es obligatoria',
                        minLength: {
                          value: 8,
                          message: 'Mínimo 8 caracteres',
                        },
                      })}
                      placeholder='Password'
                    />

                    <button
                      type='button'
                      className='eye-button'
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label='Mostrar contraseña'
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {errors.password && (
                    <small className='error-text'>{errors.password.message}</small>
                  )}
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend>Información Laboral</legend>

              <div className='grid-2'>
                <div className='field-group'>
                  <label>DPI</label>

                  <div className='input-wrapper'>
                    <IdCard className='input-icon' size={18} />

                    <input
                      {...register('dpi', {
                        required: 'El DPI es obligatorio',
                        minLength: {
                          value: 13,
                          message: 'El DPI debe tener 13 dígitos',
                        },
                        maxLength: {
                          value: 13,
                          message: 'El DPI debe tener 13 dígitos',
                        },
                      })}
                      placeholder='9876545210101'
                    />
                  </div>

                  {errors.dpi && <small className='error-text'>{errors.dpi.message}</small>}
                </div>

                <div className='field-group'>
                  <label>Dirección</label>

                  <div className='input-wrapper'>
                    <MapPin className='input-icon' size={18} />

                    <input
                      {...register('address', {
                        required: 'La dirección es obligatoria',
                      })}
                      placeholder='Ciudad de Guatemala'
                    />
                  </div>

                  {errors.address && <small className='error-text'>{errors.address.message}</small>}
                </div>
              </div>

              <div className='grid-2'>
                <div className='field-group'>
                  <label>Puesto de Trabajo</label>

                  <div className='input-wrapper'>
                    <Briefcase className='input-icon' size={18} />

                    <input
                      {...register('jobName', {
                        required: 'El puesto es obligatorio',
                      })}
                      placeholder='Puesto'
                    />
                  </div>

                  {errors.jobName && <small className='error-text'>{errors.jobName.message}</small>}
                </div>

                <div className='field-group'>
                  <label>Ingresos Mensuales</label>

                  <div className='input-wrapper'>
                    <CreditCard className='input-icon' size={18} />

                    <input
                      type='number'
                      {...register('monthlyIncome', {
                        required: 'Los ingresos son obligatorios',
                        min: {
                          value: 101,
                          message: 'Debe ser mayor a Q100',
                        },
                      })}
                      placeholder='Pago'
                    />
                  </div>

                  {errors.monthlyIncome && (
                    <small className='error-text'>{errors.monthlyIncome.message}</small>
                  )}
                </div>
              </div>
            </fieldset>

            <button type='submit' className='btn-primary' disabled={loading}>
              {loading ? 'Procesando...' : 'Registrar Usuario'}
            </button>
          </form>
        </main>

        <footer className='auth-footer'>SISTEMA DE GESTIÓN BANCARIA • 2026</footer>
      </article>
    </section>
  );
};
