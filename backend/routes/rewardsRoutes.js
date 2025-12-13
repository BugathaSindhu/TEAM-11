const express = require('express');
const router = express.Router();
const { getRewards, getUserRewards, assignReward } = require('../controllers/rewardsController');
const { authenticate } = require('../middleware/auth');

router.get('/', getRewards);
router.get('/my-rewards', authenticate, getUserRewards);
router.post('/assign', authenticate, assignReward);

module.exports = router;

