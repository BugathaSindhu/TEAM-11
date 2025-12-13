import api from './api';

export const getRewards = async () => {
  const response = await api.get('/rewards');
  return response.data;
};

export const getUserRewards = async () => {
  const response = await api.get('/rewards/my-rewards');
  return response.data;
};

export const redeemReward = async (rewardId) => {
  const response = await api.post('/rewards/assign', { reward_id: rewardId });
  return response.data;
};

