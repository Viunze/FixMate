// api/src/controllers/authController.js

const axios = require('axios');

// Ambil variabel dari Railway Environment
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

exports.githubLogin = async (req, res) => {
    const { code } = req.body;
    
    if (!code) {
        // Jika kode otorisasi hilang, ini adalah permintaan yang buruk.
        return res.status(400).json({ message: "Authorization code (code) not found in request body." });
    }

    try {
        // Langkah 1: Tukar code otorisasi menjadi Access Token dari GitHub
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code: code,
        }, {
            headers: {
                'Accept': 'application/json' // Penting: meminta respons JSON
            }
        });

        const accessToken = tokenResponse.data.access_token;

        if (!accessToken) {
            // GitHub tidak mengembalikan token (biasanya karena code sudah digunakan atau secret salah)
            console.error("Failed to get GitHub Access Token. Response:", tokenResponse.data);
            return res.status(401).json({ message: "Failed to get GitHub Access Token. Check Client Secret." });
        }

        // Langkah 2: Gunakan Access Token untuk mendapatkan info user
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${accessToken}`
            }
        });

        const user = userResponse.data;

        // Langkah 3: Kembalikan data user dan Access Token ke Frontend
        res.status(200).json({
            message: "GitHub Login successful!",
            user: {
                id: user.id,
                username: user.login,
                avatar: user.avatar_url,
                // Access Token ini akan disimpan oleh Frontend (Client-side)
                githubAccessToken: accessToken 
            }
        });

    } catch (error) {
        console.error("GitHub OAuth Error:", error.message);
        // Tangkap error jaringan atau error lainnya
        res.status(500).json({ message: "GitHub login process failed on the server side.", error: error.message });
    }
};

exports.getUserInfo = (req, res) => {
    // Endpoint placeholder, dapat digunakan untuk memverifikasi sesi
    res.status(200).json({ message: "User info placeholder." });
};
