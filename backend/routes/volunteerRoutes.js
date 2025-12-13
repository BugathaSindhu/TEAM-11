const express = require('express');
const router = express.Router();
const { getVolunteerTasks } = require('../controllers/volunteerController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/tasks', authenticate, authorize('volunteer'), getVolunteerTasks);

module.exports = router;

