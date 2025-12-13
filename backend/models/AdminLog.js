const db = require('../config/database');

class AdminLog {
  static async create(logData) {
    const { admin_id, action, details } = logData;

    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO admin_logs (admin_id, action, details) 
         VALUES (?, ?, ?)`,
        [admin_id, action, details || null],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...logData });
        }
      );
    });
  }

  static async getAll() {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT al.*, u.name as admin_name 
         FROM admin_logs al
         LEFT JOIN users u ON al.admin_id = u.id
         ORDER BY al.created_at DESC`,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }
}

module.exports = AdminLog;

