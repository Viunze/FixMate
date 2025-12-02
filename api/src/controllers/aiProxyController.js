// api/src/controllers/aiProxyController.js

const axios = require('axios');

// URL dari AI Core Service (harus menjadi Environment Variable saat deployment)
const AI_CORE_URL = process.env.AI_CORE_URL || 'http://localhost:8000/api/v1/fix'; 

exports.processFixRequest = async (req, res) => {
    // Data yang dikirim dari Frontend Next.js
    const { raw_code, error_log, project_dependencies, framework } = req.body;

    if (!raw_code || !error_log) {
        return res.status(400).json({ message: "Kode dan Error Log harus disertakan." });
    }

    // Payload yang sesuai dengan Pydantic model 'FixRequest' di FastAPI
    const aiPayload = {
        raw_code,
        error_log,
        project_dependencies: project_dependencies || {}, 
        framework: framework || "Generic",
    };

    try {
        console.log(`Proxying request to AI Core: ${AI_CORE_URL}`);
        
        // Memanggil endpoint FastAPI /fix
        const response = await axios.post(AI_CORE_URL, aiPayload);

        // Mengirim balik response terstruktur dari AI Core ke Frontend
        // Response.data berisi root_cause, error_translation, fixed_code
        res.status(200).json(response.data);

    } catch (error) {
        console.error("Error saat proxying ke AI Core:", error.message);
        
        // Menangani error dari FastAPI atau koneksi
        const status = error.response ? error.response.status : 503;
        const message = error.response ? error.response.data.detail : 'Service AI Core tidak tersedia atau gagal merespons.';

        res.status(status).json({ 
            message: "Permintaan perbaikan gagal.",
            detail: message
        });
    }
};
