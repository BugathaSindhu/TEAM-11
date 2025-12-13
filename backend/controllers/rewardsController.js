const Reward = require('../models/Reward');
const UserReward = require('../models/UserReward');

const getRewards = async (req, res) => {
  try {
    const rewards = await Reward.getAll();
    res.json({ rewards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserRewards = async (req, res) => {
  try {
    const rewards = await UserReward.findByUserId(req.user.userId);
    res.json({ rewards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const assignReward = async (req, res) => {
  try {
    const { reward_id } = req.body;

    if (!reward_id) {
      return res.status(400).json({ error: 'Reward ID required' });
    }

    const reward = await Reward.findById(reward_id);
    if (!reward) {
      return res.status(404).json({ error: 'Reward not found' });
    }

    // Mock: In real app, check user points and deduct
    const userReward = await UserReward.create({
      user_id: req.user.userId,
      reward_id
    });

    res.json({ message: 'Reward redeemed successfully', userReward });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getRewards, getUserRewards, assignReward };

