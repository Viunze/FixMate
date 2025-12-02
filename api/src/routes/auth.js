// api/src/routes/auth.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 1. Menerima code dari GitHub (setelah user login dan otorisasi)
router.post('/github/login', authController.githubLogin);

// 2. Endpoint untuk memverifikasi token dan mengembalikan info user
router.get('/user', authController.getUserInfo);

module.exports = router;
