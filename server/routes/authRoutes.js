// server/routes/authRoutes.js
const express = require('express');
const { login, register } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/login', login);
router.post('/create-supervisor', protect, authorize('admin'), register);

module.exports = router;