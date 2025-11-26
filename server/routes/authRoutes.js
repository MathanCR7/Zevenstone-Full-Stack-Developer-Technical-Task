const express = require('express');
const router = express.Router();
const { login, registerAdmin } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', registerAdmin); // Temp route to create first user

module.exports = router;