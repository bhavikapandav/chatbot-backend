const express = require('express');
const router = express.Router();
const authController = require('../controllers/v1/user/auth.controller');

// User Registration Route
router.post('/register', authController.register);

// User Login Route
router.post('/login', authController.login);

module.exports = router;
