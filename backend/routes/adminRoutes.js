const express = require('express');
const router = express.Router();
const { getAllUsers, getAllDonations, getReports } = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/users', authenticate, authorize('admin'), getAllUsers);
router.get('/donations', authenticate, authorize('admin'), getAllDonations);
router.get('/reports', authenticate, authorize('admin'), getReports);

module.exports = router;


