// api/src/routes/fix.js

const express = require('express');
const router = express.Router();
const aiProxyController = require('../controllers/aiProxyController');
// const { protect } = require('../middleware/authMiddleware'); // Middleware otentikasi

// Endpoint utama untuk memecahkan error
// Di masa depan, proteksi (protect) akan ditambahkan untuk memastikan user login dan premium
router.post('/', /* protect, */ aiProxyController.processFixRequest);

module.exports = router;
