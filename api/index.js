// api/index.js

require('dotenv').config();
const app = require('./src/app');

// Menggunakan port dari environment variable (untuk Vercel/Deployment) atau 8080 default
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`FixMate API Gateway running on port ${PORT}`);
    console.log(`AI Core URL: ${process.env.AI_CORE_URL}`);
});
