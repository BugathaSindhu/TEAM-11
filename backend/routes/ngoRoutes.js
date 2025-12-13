const express = require('express');
const router = express.Router();
const { getNearbyDonations } = require('../controllers/donationController');
const { getNGORequests, createNGORequest } = require('../controllers/ngoController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/nearby-donations', authenticate, authorize('ngo'), getNearbyDonations);
router.get('/requests', authenticate, authorize('ngo'), getNGORequests);
router.post('/request-food', authenticate, authorize('ngo'), createNGORequest);

module.exports = router;
