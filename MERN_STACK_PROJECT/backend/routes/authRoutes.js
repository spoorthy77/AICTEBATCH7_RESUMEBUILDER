const express = require('express');
const router = express.Router();
const { loginAdmin, registerAdmin } = require('../controllers/authController');

// Login endpoint
router.post('/login', loginAdmin);

// Register endpoint (for development/setup)
router.post('/register', registerAdmin);

module.exports = router;
