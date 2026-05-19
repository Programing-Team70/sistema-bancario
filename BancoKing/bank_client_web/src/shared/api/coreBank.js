import { axiosCoreBank } from './api';

export const getFullAdminMoves = async (order = 'ASC') => {
  const response = await axiosCoreBank.get('/accounts/admin/all-movements', {
    params: { order },
  });
  return response.data;
};

export const getAllAccounts = async (order = 'DESC') => {
  const response = await axiosCoreBank.get('/accounts/admin/all', {
    params: { order },
  });
  return response.data;
};

export const createBankAccount = async ({ userId, type }) => {
  const response = await axiosCoreBank.post('/accounts/', {
    userId,
    type,
  });
  return response.data;
};

export const disableBankAccount = async ({ accountNumber }) => {
  const response = await axiosCoreBank.patch('/accounts/disable', {
    accountNumber,
  });
  return response.data;
};

export const enableBankAccount = async ({ accountNumber }) => {
  const response = await axiosCoreBank.patch('/accounts/enable', {
    accountNumber,
  });
  return response.data;
};

export const getAdminAccountStatement = async (id, order = 'DESC') => {
  const response = await axiosCoreBank.get(`/accounts/admin/statement/${id}`, {
    params: { order },
  });
  return response.data;
};

export const createTransfer = async (data) => {
  const response = await axiosCoreBank.post('/transfers/', data);
  return response.data;
};

export const createWithdrawal = async (data) => {
  const response = await axiosCoreBank.post('/withdrawals/', data);
  return response.data;
};
