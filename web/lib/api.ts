// web/lib/api.ts

import axios from 'axios';

// Mengambil URL dari Environment Variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
    console.error("NEXT_PUBLIC_API_URL tidak terdefinisi!");
}

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
