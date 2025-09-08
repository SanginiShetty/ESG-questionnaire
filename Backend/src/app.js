const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const responseRoutes = require('./routes/responses');
const summaryRoutes = require('./routes/summary');

// Import middleware
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/summary', summaryRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Protected health check
app.get('/api/protected-health', authenticateToken, (req, res) => {
  res.status(200).json({ 
    message: 'Protected route is working!',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;