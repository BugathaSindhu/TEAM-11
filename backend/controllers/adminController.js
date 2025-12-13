const User = require('../models/User');
const Donation = require('../models/Donation');
const AdminLog = require('../models/AdminLog');
const db = require('../config/database');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    // Log admin action
    await AdminLog.create({
      admin_id: req.user.userId,
      action: 'view_users',
      details: `Viewed all users (${users.length} total)`
    });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.getAll();
    // Log admin action
    await AdminLog.create({
      admin_id: req.user.userId,
      action: 'view_donations',
      details: `Viewed all donations (${donations.length} total)`
    });
    res.json({ donations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReports = async (req, res) => {
  try {
    // Get counts from database
    const counts = await new Promise((resolve, reject) => {
      db.get(
        `SELECT 
          (SELECT COUNT(*) FROM users) as total_users,
          (SELECT COUNT(*) FROM donations) as total_donations,
          (SELECT COUNT(*) FROM donations WHERE status = 'pending') as pending_donations,
          (SELECT COUNT(*) FROM donations WHERE status = 'delivered') as delivered_donations`,
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    // Log admin action
    await AdminLog.create({
      admin_id: req.user.userId,
      action: 'view_reports',
      details: 'Viewed system reports'
    });

    res.json({
      total_users: counts.total_users || 0,
      total_donations: counts.total_donations || 0,
      pending_donations: counts.pending_donations || 0,
      delivered_donations: counts.delivered_donations || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllUsers, getAllDonations, getReports };


