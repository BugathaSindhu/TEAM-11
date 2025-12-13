const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('donor', 'volunteer', 'ngo', 'admin')),
    phone TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Donations table
  db.run(`CREATE TABLE IF NOT EXISTS donations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_id INTEGER NOT NULL,
    food_name TEXT NOT NULL,
    food_type TEXT NOT NULL,
    quantity TEXT NOT NULL,
    pickup_address TEXT NOT NULL,
    expiry_time TEXT NOT NULL,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'assigned', 'picked', 'delivered')),
    volunteer_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES users(id),
    FOREIGN KEY (volunteer_id) REFERENCES users(id)
  )`);
  
  // Add image_url column if it doesn't exist (for existing databases)
  db.run(`ALTER TABLE donations ADD COLUMN image_url TEXT`, (err) => {
    // Ignore error if column already exists
  });
  
  // Update status constraint if needed (for existing databases)
  // Note: SQLite doesn't support ALTER TABLE for CHECK constraints easily
  // This is handled by the CREATE TABLE IF NOT EXISTS above

  // Contact messages table
  db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Rewards table
  db.run(`CREATE TABLE IF NOT EXISTS rewards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    points_required INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // User rewards table
  db.run(`CREATE TABLE IF NOT EXISTS user_rewards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    reward_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'redeemed',
    redeemed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (reward_id) REFERENCES rewards(id)
  )`);

  // Insert sample rewards
  db.run(`INSERT OR IGNORE INTO rewards (name, description, points_required) VALUES 
    ('Bronze Badge', 'Get recognized for your first donation', 10),
    ('Silver Badge', 'Awarded for 5 successful donations', 50),
    ('Gold Badge', 'Awarded for 10 successful donations', 100),
    ('Platinum Badge', 'Awarded for 20 successful donations', 200)`);

  // Volunteer tasks table
  db.run(`CREATE TABLE IF NOT EXISTS volunteer_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    volunteer_id INTEGER NOT NULL,
    donation_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'assigned' CHECK(status IN ('assigned', 'picked', 'delivered')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (volunteer_id) REFERENCES users(id),
    FOREIGN KEY (donation_id) REFERENCES donations(id)
  )`);

  // NGO requests table
  db.run(`CREATE TABLE IF NOT EXISTS ngo_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ngo_id INTEGER NOT NULL,
    food_type TEXT NOT NULL,
    quantity TEXT NOT NULL,
    urgency TEXT NOT NULL DEFAULT 'medium' CHECK(urgency IN ('low', 'medium', 'high')),
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'fulfilled', 'cancelled')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ngo_id) REFERENCES users(id)
  )`);

  // Admin logs table
  db.run(`CREATE TABLE IF NOT EXISTS admin_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id)
  )`);

  // Note: Admin users can be registered through the /api/auth/register endpoint
});

module.exports = db;

