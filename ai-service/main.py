# ai-service/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from endpoints import fix_error # Import endpoint yang sudah dibuat

app = FastAPI(title="FixMate AI Core Service", version="1.0.0")

# Konfigurasi CORS: Penting agar Node.js/Frontend bisa mengakses
# Sesuaikan origins dengan URL Vercel/localhost Anda
origins = [
    "http://localhost:3000", # Frontend Next.js
    "http://localhost:8080", # Backend Node.js
    "https://*.vercel.app",  # Jika di-deploy ke Vercel
    "*" # Hapus ini saat production!
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fix_error.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"status": "FixMate AI Core Service is Running"}
