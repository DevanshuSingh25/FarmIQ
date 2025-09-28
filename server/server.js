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
  ? ['https://farm-frontend-jb39.onrender.com', 'https://farm-frontend-jb39.onrender.com/']
  : ['http://localhost:8080', 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Log the origin for debugging
    console.log('CORS request from origin:', origin);
    
    // Temporarily allow all origins for debugging
    if (process.env.NODE_ENV === 'production') {
      // In production, allow all origins temporarily
      callback(null, true);
    } else {
      // In development, use strict CORS
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
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

// IoT Sensor API endpoints
// Mock technician data
const technicians = [
  { id: 'T1', name: 'Ravi Kumar', phone: '9876543210', activeJobsCount: 2 },
  { id: 'T2', name: 'Simran Kaur', phone: '9876501234', activeJobsCount: 1 },
  { id: 'T3', name: 'Arjun Mehta', phone: '9876512345', activeJobsCount: 0 },
];

// Mock data storage (in production, this would be in database)
let mockRequests = [];
let mockReadings = [];
let mockAlerts = [];

// Generate mock readings for the last 24 hours
const generateMockReadings = () => {
  const readings = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    readings.push({
      timestamp: timestamp.toISOString(),
      temperatureC: Math.round((28 + Math.sin(i / 4) * 5 + Math.random() * 2) * 10) / 10,
      humidityPct: Math.round((65 + Math.cos(i / 3) * 10 + Math.random() * 5)),
      soilMoisturePct: Math.round((45 + Math.sin(i / 2) * 15 + Math.random() * 10)),
      lightLevel: i >= 6 && i <= 18 ? 
        (Math.random() > 0.5 ? 'High' : 'Medium') : 'Low'
    });
  }
  
  return readings;
};

// Generate mock alerts
const generateMockAlerts = () => {
  return [
    {
      id: 'A1',
      type: 'moisture',
      message: 'Low moisture detected — consider light irrigation',
      severity: 'medium'
    },
    {
      id: 'A2',
      type: 'temperature',
      message: 'High temperature in afternoon — monitor crop stress',
      severity: 'low'
    }
  ];
};

// Initialize mock data
mockReadings = generateMockReadings();
mockAlerts = generateMockAlerts();

// Allocate technician (mock logic)
const allocateTechnician = () => {
  const technician = technicians.reduce((min, tech) => 
    tech.activeJobsCount < min.activeJobsCount ? tech : min
  );
  
  technician.activeJobsCount++;
  
  return {
    id: technician.id,
    name: technician.name,
    phone: technician.phone,
    rating: 4.5
  };
};

// GET /api/iot/status - Get current installation request status
app.get('/api/iot/status', (req, res) => {
  try {
    const activeRequest = mockRequests.length > 0 ? mockRequests[0] : null;
    res.json(activeRequest);
  } catch (error) {
    console.error('Error getting IoT status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/iot/request - Create new installation request
app.post('/api/iot/request', (req, res) => {
  try {
    const requestData = req.body;
    
    // Validate required fields
    if (!requestData.farmerName || !requestData.phone || !requestData.preferredDate || !requestData.preferredWindow) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create new request
    const newRequest = {
      id: `IOT-2025-${String(mockRequests.length + 1).padStart(6, '0')}`,
      ...requestData,
      status: 'allocated',
      technician: allocateTechnician(),
      appointment: {
        date: requestData.preferredDate,
        window: requestData.preferredWindow
      },
      createdAt: new Date().toISOString()
    };
    
    // Store request (replace existing if any)
    mockRequests = [newRequest];
    
    res.json(newRequest);
  } catch (error) {
    console.error('Error creating IoT request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/iot/reschedule - Reschedule appointment
app.post('/api/iot/reschedule', (req, res) => {
  try {
    const { id, newDate, newWindow } = req.body;
    
    if (!id || !newDate || !newWindow) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const request = mockRequests.find(r => r.id === id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    request.appointment = { date: newDate, window: newWindow };
    request.status = 'scheduled';
    
    res.json(request);
  } catch (error) {
    console.error('Error rescheduling IoT request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/iot/cancel - Cancel request
app.post('/api/iot/cancel', (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Missing request ID' });
    }
    
    mockRequests = mockRequests.filter(r => r.id !== id);
    res.json({ ok: true });
  } catch (error) {
    console.error('Error cancelling IoT request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/iot/readings - Get sensor readings
app.get('/api/iot/readings', (req, res) => {
  try {
    const since = req.query.since;
    let readings = mockReadings;
    
    if (since) {
      const sinceDate = new Date(since);
      readings = mockReadings.filter(r => new Date(r.timestamp) >= sinceDate);
    }
    
    res.json(readings);
  } catch (error) {
    console.error('Error getting IoT readings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/iot/alerts - Get farm alerts
app.get('/api/iot/alerts', (req, res) => {
  try {
    res.json(mockAlerts);
  } catch (error) {
    console.error('Error getting IoT alerts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/iot/mark-installed - Mark sensor as installed (for testing)
app.post('/api/iot/mark-installed', (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Missing request ID' });
    }
    
    const request = mockRequests.find(r => r.id === id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    request.status = 'installed';
    res.json(request);
  } catch (error) {
    console.error('Error marking IoT as installed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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
