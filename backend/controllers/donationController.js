const Donation = require('../models/Donation');

const createDonation = async (req, res) => {
  try {
    const { food_name, food_type, quantity, pickup_address, expiry_time, image_url } = req.body;

    if (!food_name || !food_type || !quantity || !pickup_address || !expiry_time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const donation = await Donation.create({
      donor_id: req.user.userId,
      food_name,
      food_type,
      quantity,
      pickup_address,
      expiry_time,
      image_url
    });

    res.status(201).json({ message: 'Donation created successfully', donation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDonorDonations = async (req, res) => {
  try {
    const donations = await Donation.findByDonorId(req.user.userId);
    res.json({ donations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAvailableDonations = async (req, res) => {
  try {
    const donations = await Donation.findAvailable();
    res.json({ donations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVolunteerDonations = async (req, res) => {
  try {
    const donations = await Donation.findByVolunteerId(req.user.userId);
    res.json({ donations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const assignDonation = async (req, res) => {
  try {
    const { donation_id } = req.body;

    if (!donation_id) {
      return res.status(400).json({ error: 'Donation ID required' });
    }

    const result = await Donation.assign(donation_id, req.user.userId);

    if (result.changes === 0) {
      return res.status(400).json({ error: 'Donation not available or already assigned' });
    }

    res.json({ message: 'Donation assigned successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const completeDonation = async (req, res) => {
  try {
    const { donation_id } = req.body;

    if (!donation_id) {
      return res.status(400).json({ error: 'Donation ID required' });
    }

    const result = await Donation.complete(donation_id, req.user.userId);

    if (result.changes === 0) {
      return res.status(400).json({ error: 'Donation not found or not assigned to you' });
    }

    res.json({ message: 'Donation completed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNearbyDonations = async (req, res) => {
  try {
    const address = req.query.address || '';
    const donations = await Donation.findNearby(address);
    res.json({ donations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.getAll();
    res.json({ donations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createDonation,
  getDonorDonations,
  getAvailableDonations,
  getVolunteerDonations,
  assignDonation,
  completeDonation,
  getNearbyDonations,
  getAllDonations
};

