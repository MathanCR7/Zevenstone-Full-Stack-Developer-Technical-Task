// server/routes/authRoutes.js
const express = require('express');
const { login, registerAdmin, createSupervisor } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.post('/register', registerAdmin); // Initial seed
router.post('/create-supervisor', protect, authorize('admin'), createSupervisor);

module.exports = router;