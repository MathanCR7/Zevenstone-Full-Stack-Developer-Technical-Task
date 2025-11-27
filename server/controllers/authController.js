// server/controllers/authController.js
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Register Supervisor (Admin only)
// @route   POST /api/auth/create-supervisor
exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.create({
      email,
      password,
      role: 'supervisor'
    });

    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all Supervisors (Admin only)
// @route   GET /api/auth/supervisors
exports.getSupervisors = async (req, res, next) => {
    try {
        // Find users where role is specifically 'supervisor'
        const supervisors = await User.find({ role: 'supervisor' }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: supervisors.length,
            data: supervisors
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete User (Admin only)
// @route   DELETE /api/auth/users/:id
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        // Prevent deleting yourself (Admin)
        if (user._id.toString() === req.user.id) {
            return next(new ErrorResponse('You cannot delete your own admin account', 400));
        }

        await user.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

// Helper to sign token
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