// web/lib/auth.ts

import api from './api';

// URL GitHub yang akan dikunjungi user
const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=repo`; 

// Catatan: NEXT_PUBLIC_GITHUB_CLIENT_ID harus diatur di Vercel/Environment Variables

export const loginWithGitHub = () => {
    window.location.href = GITHUB_AUTH_URL;
};

export const handleGitHubCallback = async (code: string) => {
    // Kirim code otorisasi ke Backend API untuk ditukar dengan Access Token
    try {
        const response = await api.post('/auth/github/login', { code });
        // Simpan token ke LocalStorage atau Context
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
    } catch (error) {
        console.error("Login Gagal:", error);
        alert("Login GitHub gagal. Cek konsol dan konfigurasi Client ID.");
        return null;
    }
};
