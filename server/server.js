// server/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

// Load env vars
require('dotenv').config();

// Connect to Database
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Custom Request Logger Middleware
app.use((req, res, next) => {
  logger.info(`${req.method} request to ${req.url}`);
  next();
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

// Health Check
app.get('/', (req, res) => res.send('API is running...'));

// Global Error Handler (Must be last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.success(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
   logger.error(`Uncaught Exception: ${err.message}`);
   process.exit(1);
});