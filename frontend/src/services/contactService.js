import api from './api';

export const submitContact = async (contactData) => {
  const response = await api.post('/contact', contactData);
  return response.data;
};

