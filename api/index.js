// api/src/index.js (atau file utama server Anda)

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import routers
const authRouter = require('./routes/auth'); // Pastikan path ini benar!
// const fixRouter = require('./routes/fix'); // Router FixMate utama

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- INTEGRASI ROUTE UTAMA ---
// Endpoint yang dipanggil Frontend adalah: POST /api/v1/auth/github/login
app.use('/api/v1/auth', authRouter); // Awalan 'auth' akan menambahkan /api/v1/auth ke route di atas
// app.use('/api/v1/fix', fixRouter); // Contoh route fix

// Endpoint utama (health check)
app.get('/', (req, res) => {
    res.status(200).json({ message: "FixMate API Gateway running." });
});
// -----------------------------

const PORT = process.env.PORT || 8000; 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
