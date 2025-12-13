const db = require('../config/database');

class Reward {
  static async getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM rewards ORDER BY points_required ASC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM rewards WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
}

module.exports = Reward;

