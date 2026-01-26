const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const fs = require('fs');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✓ MongoDB Connected"))
  .catch(err => {
    console.error("✗ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Routes
const agentRoutes = require('./routes/agentRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

app.use('/api/agents', agentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Running...',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Server error',
    status: 'error'
  });
});

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════╗`);
  console.log(`║  MERN Stack Server Started         ║`);
  console.log(`╠════════════════════════════════════╣`);
  console.log(`║  Environment: ${NODE_ENV.padEnd(25)}║`);
  console.log(`║  Port: ${PORT.toString().padEnd(27)}║`);
  console.log(`║  URL: http://localhost:${PORT.toString().padEnd(20)}║`);
  console.log(`╚════════════════════════════════════╝\n`);
});
