// api/src/controllers/authController.js

const axios = require('axios');
// Anda mungkin perlu firebase-admin atau JWT untuk manajemen sesi yang sebenarnya
// const admin = require('../lib/firebase'); 

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

exports.githubLogin = async (req, res) => {
    const { code } = req.body;
    
    if (!code) {
        return res.status(400).json({ message: "Code otorisasi GitHub tidak ditemukan." });
    }

    try {
        // Langkah 1: Tukar code otorisasi menjadi Access Token
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code: code,
        }, {
            headers: {
                'Accept': 'application/json' // Meminta respons JSON
            }
        });

        const accessToken = tokenResponse.data.access_token;

        if (!accessToken) {
            return res.status(401).json({ message: "Gagal mendapatkan Access Token GitHub." });
        }

        // Langkah 2: Gunakan Access Token untuk mendapatkan info user
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${accessToken}`
            }
        });

        const user = userResponse.data;

        // Langkah 3: (Penting) Kembalikan data yang dibutuhkan Frontend
        res.status(200).json({
            message: "Login GitHub berhasil!",
            user: {
                id: user.id,
                username: user.login,
                avatar: user.avatar_url,
                // SIMPAN ACCESS TOKEN INI DENGAN AMAN DI SISI FRONTEND (atau gunakan JWT)
                githubAccessToken: accessToken 
            }
        });

    } catch (error) {
        console.error("GitHub OAuth Error:", error.message);
        res.status(500).json({ message: "Proses login GitHub gagal." });
    }
};

exports.getUserInfo = (req, res) => {
    // Endpoint sederhana untuk verifikasi sesi atau token
    res.status(200).json({ user: req.user });
};
