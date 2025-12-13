const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { name, email, password, role, phone, address } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (name, email, password, role, phone, address) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, hashedPassword, role, phone || null, address || null],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...userData, password: undefined });
        }
      );
    });
  }

  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT id, name, email, role, phone, address, created_at FROM users WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static async getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT id, name, email, role, phone, address, created_at FROM users', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static async update(id, updateData) {
    const { name, phone, address } = updateData;
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?',
        [name, phone || null, address || null, id],
        function(err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    });
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;


