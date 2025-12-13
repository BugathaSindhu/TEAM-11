import api from './api';

export const getNGORequests = async () => {
  const response = await api.get('/ngo/requests');
  return response.data;
};

export const createNGORequest = async (requestData) => {
  const response = await api.post('/ngo/request-food', requestData);
  return response.data;
};

