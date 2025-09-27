const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'farmiQ.db');
const db = new sqlite3.Database(dbPath);

// Initialize database with users table
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          role TEXT NOT NULL CHECK (role IN ('farmer','vendor','admin')),
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          aadhar TEXT NOT NULL,
          username TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          UNIQUE (role, username)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating users table:', err);
          reject(err);
          return;
        }
        console.log('Users table created successfully');
      });

      // Create index on (role, username) for faster lookups
      db.run(`
        CREATE INDEX IF NOT EXISTS idx_users_role_username 
        ON users (role, username)
      `, (err) => {
        if (err) {
          console.error('Error creating index:', err);
          reject(err);
          return;
        }
        console.log('Index created successfully');
        resolve();
      });
    });
  });
};

// Database helper functions
const dbHelpers = {
  // Insert a new user
  insertUser: (userData) => {
    return new Promise((resolve, reject) => {
      const { role, name, phone, aadhar, username, password_hash } = userData;
      db.run(
        `INSERT INTO users (role, name, phone, aadhar, username, password_hash) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [role, name, phone, aadhar, username, password_hash],
        function(err) {
          if (err) {
            if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
              reject(new Error('Username already exists for this role'));
            } else {
              reject(err);
            }
            return;
          }
          resolve({ id: this.lastID });
        }
      );
    });
  },

  // Find user by role and username
  findUserByRoleAndUsername: (role, username) => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM users WHERE role = ? AND username = ?`,
        [role, username],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row);
        }
      );
    });
  },

  // Find user by ID
  findUserById: (id) => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT id, role, name, phone, aadhar, username, created_at FROM users WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row);
        }
      );
    });
  }
};

module.exports = {
  db,
  initDatabase,
  dbHelpers
};
