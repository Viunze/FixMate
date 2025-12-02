# ai-service/modules/gemini_core/model_wrapper.py

import os
from google import genai
from google.genai.errors import APIError
from dotenv import load_dotenv

# Load environment variables from .env file (for local development)
load_dotenv()

class GeminiCore:
    """
    Mengelola inisialisasi dan pemanggilan Gemini API.
    API Key diambil dari environment variable GEMINI_API_KEY.
    """
    def __init__(self, model_name: str = 'gemini-2.5-pro'):
        # Mendapatkan API Key dari environment variable
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY tidak ditemukan di environment variables.")
        
        # Inisialisasi client
        self.client = genai.Client(api_key=api_key)
        self.model_name = model_name

    def generate_fix(self, full_context_prompt: str) -> str:
        """
        Memanggil model Gemini untuk mendapatkan solusi perbaikan (fix).
        """
        try:
            print(f"Memanggil model: {self.model_name}...")
            
            # Menggunakan gemini-2.5-pro karena ini adalah AI Engineer Assistant yang butuh akurasi tinggi
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=full_context_prompt
            )
            
            # Response.text berisi kode perbaikan, penjelasan, atau analisis
            return response.text
            
        except APIError as e:
            print(f"Gemini API Error: {e}")
            return f"Error saat menghubungi Gemini API: {e}"
        except Exception as e:
            print(f"Error tidak terduga: {e}")
            return f"Error tidak terduga: {e}"

# Contoh penggunaan (untuk testing lokal)
if __name__ == '__main__':
    try:
        # Inisialisasi tanpa env var akan melempar ValueError
        # Pastikan Anda memiliki file .env dengan GEMINI_API_KEY="YOUR_KEY"
        gemini = GeminiCore()
        
        test_prompt = "Sebagai AI Engineer, perbaiki kode JavaScript berikut yang mengalami 'ReferenceError: React is not defined'. Kode: function App() { return <div>Hello</div>; }"
        
        fix = gemini.generate_fix(test_prompt)
        print("\n--- Solusi FixMate (Simulasi) ---")
        print(fix)
        
    except ValueError as e:
        print(f"\nSETUP FAILED: {e}")
        print("Pastikan Anda membuat file .env di root /ai-service/ dengan GEMINI_API_KEY.")
