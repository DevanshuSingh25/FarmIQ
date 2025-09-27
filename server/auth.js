const bcrypt = require('bcryptjs');
const { dbHelpers } = require('./database');

// Password hashing configuration
const SALT_ROUNDS = 10;

// Authentication helper functions
const authHelpers = {
  // Hash password
  hashPassword: async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
  },

  // Compare password with hash
  comparePassword: async (password, hash) => {
    return await bcrypt.compare(password, hash);
  },

  // Register a new user
  register: async (userData) => {
    try {
      const { role, name, phone, aadhar, username, password } = userData;

      // Validate input
      if (!role || !name || !phone || !aadhar || !username || !password) {
        throw new Error('All fields are required');
      }

      if (!['farmer', 'vendor', 'admin'].includes(role)) {
        throw new Error('Invalid role');
      }

      if (!/^\d{10}$/.test(phone)) {
        throw new Error('Phone number must be 10 digits');
      }

      if (!/^\d{12}$/.test(aadhar)) {
        throw new Error('Aadhar number must be 12 digits');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Hash password
      const password_hash = await authHelpers.hashPassword(password);

      // Insert user into database
      const result = await dbHelpers.insertUser({
        role,
        name,
        phone,
        aadhar,
        username,
        password_hash
      });

      return { success: true, userId: result.id };
    } catch (error) {
      throw error;
    }
  },

  // Login user
  login: async (role, username, password) => {
    try {
      // Find user by role and username
      const user = await dbHelpers.findUserByRoleAndUsername(role, username);
      
      if (!user) {
        throw new Error('Invalid username or password for selected role');
      }

      // Compare password
      const isValidPassword = await authHelpers.comparePassword(password, user.password_hash);
      
      if (!isValidPassword) {
        throw new Error('Invalid username or password for selected role');
      }

      // Return user data (without password hash)
      return {
        id: user.id,
        role: user.role,
        name: user.name,
        username: user.username,
        phone: user.phone,
        aadhar: user.aadhar,
        created_at: user.created_at
      };
    } catch (error) {
      throw error;
    }
  },

  // Get user by ID (for session validation)
  getUserById: async (id) => {
    try {
      const user = await dbHelpers.findUserById(id);
      return user;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = authHelpers;
