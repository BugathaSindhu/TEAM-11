const db = require('../config/database');

class NGORequest {
  static async create(requestData) {
    const { ngo_id, food_type, quantity, urgency, notes } = requestData;

    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO ngo_requests (ngo_id, food_type, quantity, urgency, notes, status) 
         VALUES (?, ?, ?, ?, ?, 'pending')`,
        [ngo_id, food_type, quantity, urgency, notes || null],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...requestData, status: 'pending' });
        }
      );
    });
  }

  static async findByNGOId(ngoId) {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM ngo_requests WHERE ngo_id = ? ORDER BY created_at DESC',
        [ngoId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }
}

module.exports = NGORequest;

