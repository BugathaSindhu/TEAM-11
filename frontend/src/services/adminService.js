import api from './api';

export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const getAllDonations = async () => {
  const response = await api.get('/admin/donations');
  return response.data;
};

export const getAdminReports = async () => {
  const response = await api.get('/admin/reports');
  return response.data;
};


