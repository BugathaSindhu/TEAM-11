const db = require('../config/database');

class VolunteerTask {
  static async create(taskData) {
    const { volunteer_id, donation_id, notes } = taskData;

    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO volunteer_tasks (volunteer_id, donation_id, notes, status) 
         VALUES (?, ?, ?, 'assigned')`,
        [volunteer_id, donation_id, notes || null],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...taskData, status: 'assigned' });
        }
      );
    });
  }

  static async findByVolunteerId(volunteerId) {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM volunteer_tasks WHERE volunteer_id = ? ORDER BY created_at DESC',
        [volunteerId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }
}

module.exports = VolunteerTask;

