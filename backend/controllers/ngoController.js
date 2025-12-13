const NGORequest = require('../models/NGORequest');

const getNGORequests = async (req, res) => {
  try {
    const requests = await NGORequest.findByNGOId(req.user.userId);
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createNGORequest = async (req, res) => {
  try {
    const { food_type, quantity, urgency, notes } = req.body;

    if (!food_type || !quantity || !urgency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const request = await NGORequest.create({
      ngo_id: req.user.userId,
      food_type,
      quantity,
      urgency,
      notes
    });

    res.status(201).json({ message: 'Food request created successfully', request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getNGORequests, createNGORequest };

