import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Phone, MapPin, Briefcase, CreditCard, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

import { useUserManagementStore } from '../store/useUserManagementStore.js';
import { useAuthStore } from '../../auth/store/authStore.js';

export const UpdateProfile = ({ isOpen, onClose }) => {
  const authUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const { myProfile, profile, updateUser, loading, clearError } = useUserManagementStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const loadUserData = async () => {
      if (!isOpen) return;

      clearError();

      let currentProfile = profile;

      if (!currentProfile) {
        const result = await myProfile();
        if (result.success) {
          currentProfile = result.data;
        }
      }

      if (currentProfile) {
        reset({
          name: currentProfile.name || '',
          surname: currentProfile.surname || '',
          phone: currentProfile.phone || '',
          address: currentProfile.address || '',
          jobName: currentProfile.jobName || currentProfile.job_name || '',
          monthlyIncome: currentProfile.monthlyIncome || currentProfile.monthly_income || '',
        });
      }
    };

    loadUserData();
  }, [isOpen, profile, reset, clearError]);

  const onSubmit = async (data) => {
    const formattedData = {
      name: data.name,
      surname: data.surname,
      phone: data.phone,
      address: data.address,
      jobName: data.jobName,
      monthlyIncome: Number(data.monthlyIncome),
    };

    const userId = authUser?._id || authUser?.id;

    if (!userId) {
      toast.error('No se encontró el ID del usuario');
      return;
    }
    const result = await updateUser(userId, formattedData);

    if (result.success) {
      setUser({
        ...authUser,
        ...formattedData,
        fullName: `${data.name} ${data.surname}`,
      });

      await myProfile();

      toast.success('Perfil actualizado con éxito');
      onClose();
    } else {
      toast.error(result.error || 'Error al actualizar');
    }
  };

  const handleClose = () => {
    clearError();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <section className='modal-overlay'>
      <article className='auth-card wide animate-modal'>
        <button type='button' className='modal-close-btn' onClick={handleClose}>
          <X size={22} />
        </button>
        <header className='auth-header'>
          <h2>Actualizar Perfil</h2>
          <span>ID: {authUser?._id || authUser?.id}</span>
        </header>
        <main>
          <form onSubmit={handleSubmit(onSubmit)} className='auth-form'>
            <div className='grid-2'>
              <div className='field-group'>
                <label>Primer Nombre</label>
                <div className='input-wrapper'>
                  <User size={18} className='input-icon' />
                  <input {...register('name', { required: true })} placeholder='First Name' />
                </div>
              </div>
              <div className='field-group'>
                <label>Apellido</label>
                <div className='input-wrapper'>
                  <User size={18} className='input-icon' />
                  <input {...register('surname', { required: true })} placeholder='Last Name' />
                </div>
              </div>
            </div>

            <div className='grid-2'>
              <div className='field-group'>
                <label>Telefono</label>
                <div className='input-wrapper'>
                  <Phone size={18} className='input-icon' />
                  <input {...register('phone')} placeholder='Phone' />
                </div>
              </div>
              <div className='field-group'>
                <label>Dirección</label>
                <div className='input-wrapper'>
                  <MapPin size={18} className='input-icon' />
                  <input {...register('address')} placeholder='Address' />
                </div>
              </div>
            </div>

            <div className='grid-2'>
              <div className='field-group'>
                <label>Trabajo</label>
                <div className='input-wrapper'>
                  <Briefcase size={18} className='input-icon' />
                  <input {...register('jobName')} placeholder='Job Position' />
                </div>
              </div>
              <div className='field-group'>
                <label>Ingreso Mensual</label>
                <div className='input-wrapper'>
                  <CreditCard size={18} className='input-icon' />
                  <input
                    type='number'
                    step='0.01'
                    {...register('monthlyIncome')}
                    placeholder='Income'
                  />
                </div>
              </div>
            </div>

            <button type='submit' className='btn-primary' disabled={loading}>
              {loading ? (
                'Cargando...'
              ) : (
                <>
                  <Save size={18} /> Save Changes
                </>
              )}
            </button>
          </form>
        </main>
      </article>
    </section>
  );
};
