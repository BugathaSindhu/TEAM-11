const VolunteerTask = require('../models/VolunteerTask');

const getVolunteerTasks = async (req, res) => {
  try {
    const tasks = await VolunteerTask.findByVolunteerId(req.user.userId);
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getVolunteerTasks };

