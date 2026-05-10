import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { User, Phone, MapPin, Briefcase, CreditCard, X, Pencil } from 'lucide-react';

import toast from 'react-hot-toast';
import { useUserManagementStore } from '../store/useUserManagementStore.js';

export const UpdateUserForm = ({ isOpen, onClose, user }) => {
  const { updateUser, loading } = useUserManagementStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        surname: user.surname || '',
        phone: user.phone || '',
        address: user.address || '',
        jobName: user.jobName || '',
        monthlyIncome: user.monthlyIncome || '',
      });
    }
  }, [user, reset]);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      monthlyIncome: parseFloat(data.monthlyIncome),
    };

    const result = await updateUser(user.id, formattedData);

    if (result?.success) {
      toast.success('Usuario actualizado correctamente');
      onClose();
    } else {
      toast.error(result?.error || 'No se pudo actualizar');
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
          <h2>Actualizar Usuario</h2>

          <span>MODIFICACIÓN DE INFORMACIÓN</span>
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

                  {errors.name && <span className='error-text'>{errors.name.message}</span>}
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

                  {errors.surname && <span className='error-text'>{errors.surname.message}</span>}
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend>Información de Contacto</legend>

              <div className='grid-2'>
                <div className='field-group'>
                  <label>Teléfono</label>

                  <div className='input-wrapper'>
                    <Phone className='input-icon' size={18} />

                    <input
                      type='tel'
                      {...register('phone', {
                        required: 'El teléfono es obligatorio',
                      })}
                      placeholder='Teléfono'
                    />
                  </div>

                  {errors.phone && <span className='error-text'>{errors.phone.message}</span>}
                </div>

                <div className='field-group'>
                  <label>Dirección</label>

                  <div className='input-wrapper'>
                    <MapPin className='input-icon' size={18} />

                    <input
                      {...register('address', {
                        required: 'La dirección es obligatoria',
                      })}
                      placeholder='Dirección'
                    />
                  </div>

                  {errors.address && <span className='error-text'>{errors.address.message}</span>}
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend>Información Laboral</legend>

              <div className='grid-2'>
                <div className='field-group'>
                  <label>Puesto de Trabajo</label>

                  <div className='input-wrapper'>
                    <Briefcase className='input-icon' size={18} />

                    <input
                      {...register('jobName', {
                        required: 'El puesto de trabajo es obligatorio',
                      })}
                      placeholder='Puesto'
                    />
                  </div>

                  {errors.jobName && <span className='error-text'>{errors.jobName.message}</span>}
                </div>

                <div className='field-group'>
                  <label>Ingresos Mensuales</label>

                  <div className='input-wrapper'>
                    <CreditCard className='input-icon' size={18} />

                    <input
                      type='number'
                      step='0.001'
                      {...register('monthlyIncome', {
                        required: 'Los ingresos mensuales son obligatorios',
                      })}
                      placeholder='Ingresos'
                    />
                  </div>

                  {errors.monthlyIncome && (
                    <span className='error-text'>{errors.monthlyIncome.message}</span>
                  )}
                </div>
              </div>
            </fieldset>

            <button type='submit' className='btn-primary' disabled={loading}>
              {loading ? (
                'Actualizando...'
              ) : (
                <>
                  <Pencil size={18} style={{ marginRight: '8px' }} />
                  Actualizar Usuario
                </>
              )}
            </button>
          </form>
        </main>

        <footer className='auth-footer'>SISTEMA DE GESTIÓN BANCARIA • 2026</footer>
      </article>
    </section>
  );
};
