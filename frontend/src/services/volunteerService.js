import api from './api';

export const getVolunteerTasks = async () => {
  const response = await api.get('/volunteer/tasks');
  return response.data;
};

