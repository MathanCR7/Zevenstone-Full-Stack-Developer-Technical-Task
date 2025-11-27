// server/routes/authRoutes.js
const express = require('express');
const { login, register, getSupervisors, deleteUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Route
router.post('/login', login);

// Admin Protected Routes
router.post('/create-supervisor', protect, authorize('admin'), register);
router.get('/supervisors', protect, authorize('admin'), getSupervisors); // <--- NEW
router.delete('/users/:id', protect, authorize('admin'), deleteUser);   // <--- NEW

module.exports = router;