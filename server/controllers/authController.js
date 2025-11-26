// server/controllers/authController.js
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken'); // <--- Added missing import

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  
  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  try {
    // Check for user and include password in query
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Register user (Admin only -> Create Supervisor)
// @route   POST /api/auth/create-supervisor
exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Create user (Password hashing is handled by User model pre-save hook)
    const user = await User.create({
      email,
      password,
      role: 'supervisor' // Force role to supervisor
    });

    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// Helper to sign token and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });

  res.status(statusCode).json({
    success: true,
    token,
    user: { 
        id: user._id, 
        email: user.email, 
        role: user.role 
    }
  });
};