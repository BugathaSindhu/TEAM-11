/**
 * User Controller
 * Provides endpoints for AI service to fetch volunteers and NGOs
 */
const User = require('../models/User');

const getVolunteers = async (req, res) => {
  try {
    // Fetch all users with volunteer role
    const allUsers = await User.getAll();
    const volunteers = allUsers
      .filter(user => user.role === 'volunteer')
      .map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        // Placeholder scores - in production, these would come from a metrics table
        reliability_score: 0.7,
        availability_score: 0.8
      }));
    
    res.json({ volunteers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNGOs = async (req, res) => {
  try {
    // Fetch all users with NGO role
    const allUsers = await User.getAll();
    const ngos = allUsers
      .filter(user => user.role === 'ngo')
      .map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        // Placeholder values - in production, these would come from an NGO profile table
        capacity: 100,
        accepted_food_types: ['Cooked', 'Raw', 'Packaged'],
        trust_score: 0.8
      }));
    
    res.json({ ngos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getVolunteers,
  getNGOs
};

