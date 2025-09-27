const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./database');
const authHelpers = require('./auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Update CORS for production
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://farmiq-frontend.onrender.com', 'https://farmiq-frontend.onrender.com/']
  : ['http://localhost:8080', 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // Log the origin for debugging
    console.log('CORS request from origin:', origin);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Middleware (CORS already configured above)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: 'farmiq-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'Authentication required' });
  }
};

// Role-based middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (req.session.userId && req.session.role && roles.includes(req.session.role)) {
      next();
    } else {
      res.status(403).json({ message: 'Insufficient permissions' });
    }
  };
};

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    cors_origin: req.headers.origin || 'no-origin'
  });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin
  });
});

// Authentication routes

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { role, name, phone, aadhar, username, password } = req.body;

    const result = await authHelpers.register({
      role,
      name,
      phone,
      aadhar,
      username,
      password
    });

    res.status(201).json({ ok: true, userId: result.userId });
  } catch (error) {
    if (error.message === 'Username already exists for this role') {
      res.status(409).json({ message: error.message });
    } else {
      console.error('Registration error:', error);
      res.status(400).json({ message: error.message });
    }
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { role, username, password } = req.body;

    const user = await authHelpers.login(role, username, password);

    // Set session
    req.session.userId = user.id;
    req.session.role = user.role;
    req.session.username = user.username;

    // Determine redirect URL based on role
    let redirectUrl;
    switch (user.role) {
      case 'farmer':
        redirectUrl = '/farmer/dashboard';
        break;
      case 'vendor':
        redirectUrl = '/vendor/dashboard';
        break;
      case 'admin':
        redirectUrl = '/admin/dashboard';
        break;
      default:
        redirectUrl = '/login';
    }

    res.json({ 
      success: true, 
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        username: user.username,
        phone: user.phone,
        aadhar: user.aadhar
      },
      redirectUrl 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ message: error.message });
  }
});

// Get current session
app.get('/api/auth/session', async (req, res) => {
  try {
    if (req.session.userId) {
      const user = await authHelpers.getUserById(req.session.userId);
      if (user) {
        res.json({
          authenticated: true,
          user: {
            id: user.id,
            role: user.role,
            name: user.name,
            username: user.username,
            phone: user.phone,
            aadhar: user.aadhar
          }
        });
      } else {
        // User not found, clear session
        req.session.destroy();
        res.json({ authenticated: false });
      }
    } else {
      res.json({ authenticated: false });
    }
  } catch (error) {
    console.error('Session check error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user details by ID (for profile page)
app.get('/api/auth/user/:id', requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Ensure user can only access their own data
    if (req.session.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const user = await authHelpers.getUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      res.status(500).json({ message: 'Could not log out' });
    } else {
      res.json({ ok: true });
    }
  });
});

// Protected routes for testing
app.get('/api/farmer/dashboard', requireAuth, requireRole(['farmer']), (req, res) => {
  res.json({ message: 'Farmer dashboard data' });
});

app.get('/api/vendor/dashboard', requireAuth, requireRole(['vendor']), (req, res) => {
  res.json({ message: 'Vendor dashboard data' });
});

app.get('/api/admin/dashboard', requireAuth, requireRole(['admin']), (req, res) => {
  res.json({ message: 'Admin dashboard data' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('Database initialized successfully');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
