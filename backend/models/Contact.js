const db = require('../config/database');

class Contact {
  static async create(contactData) {
    const { name, email, subject, message } = contactData;

    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO contact_messages (name, email, subject, message) 
         VALUES (?, ?, ?, ?)`,
        [name, email, subject, message],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...contactData });
        }
      );
    });
  }

  static async getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM contact_messages ORDER BY created_at DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

module.exports = Contact;

