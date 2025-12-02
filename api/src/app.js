// api/src/app.js

const express = require('express');
const cors = require('cors');
const fixRoutes = require('./routes/fix');
const projectRoutes = require('./routes/projects');
const authRoutes = require('./routes/auth');
// const { initializeFirebase } = require('./lib/firebase'); // Akan diimplementasikan untuk DB

const app = express();

// Konfigurasi CORS
app.use(cors({
    origin: ['http://localhost:3000', process.env.FRONTEND_URL], // Sesuaikan dengan URL Vercel Frontend
    credentials: true,
}));

app.use(express.json()); // Body parser

// initializeFirebase(); // Inisialisasi Firebase Admin

// Routes
app.use('/api/v1/fix', fixRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('FixMate API Gateway Operational');
});

module.exports = app;
