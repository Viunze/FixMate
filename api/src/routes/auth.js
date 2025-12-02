// api/src/routes/auth.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route untuk menerima POST request dari Frontend dengan 'code'
router.post('/github/login', authController.githubLogin);

// Route untuk mendapatkan info user (opsional)
router.get('/user', authController.getUserInfo);

module.exports = router;
