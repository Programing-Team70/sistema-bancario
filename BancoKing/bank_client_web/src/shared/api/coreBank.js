import { axiosCoreBank } from './api';

export const getAllAccounts = async (order = 'ASC') => {
  const response = await axiosCoreBank.get('/accounts/admin/all-movements', {
    params: { order },
  });
  return response.data;
};
