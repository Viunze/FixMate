# ai-service/endpoints/fix_error.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from modules.gemini_core.model_wrapper import GeminiCore
from modules.gemini_core.prompt_generator import create_fixmate_prompt
# from modules.context_parser.dependency_analyzer import analyze_dependencies # Akan diimplementasikan nanti

router = APIRouter()
gemini_core = GeminiCore() # Inisialisasi Gemini Client saat startup

# Data model untuk request dari Node.js Backend
class FixRequest(BaseModel):
    raw_code: str
    error_log: str
    project_dependencies: dict # Misal: {"react": "17.0.2", "react-router-dom": "6.0.0"}
    framework: str = "Generic"
    file_path: Optional[str] = None # Untuk context error path

# Data model untuk response ke Node.js Backend
class FixResponse(BaseModel):
    root_cause: str
    error_translation: str
    fixed_code: str
    ai_status: str

@router.post("/fix", response_model=FixResponse)
def fix_error_endpoint(request: FixRequest):
    """
    Menerima kode & log, memproses dengan Gemini, dan mengembalikan solusi 3 bagian.
    """
    
    # 1. (Placeholder) Analisis Dependency (Akan diimplementasikan untuk fungsionalitas penuh)
    # Untuk sementara, kita konversi dict dependency menjadi string kontekstual.
    dependency_context = "\n".join([f"- {k}: {v}" for k, v in request.project_dependencies.items()])

    # 2. Membuat Prompt Lengkap
    full_prompt = create_fixmate_prompt(
        raw_code=request.raw_code,
        error_log=request.error_log,
        dependency_context=dependency_context,
        framework=request.framework
    )
    
    # 3. Memanggil Gemini
    gemini_output = gemini_core.generate_fix(full_prompt)
    
    # 4. Parsing Output (Memisahkan 3 Bagian Markdown)
    try:
        # Mencari dan mengekstrak 3 bagian berdasarkan header Markdown yang diminta
        root_cause_start = gemini_output.find('**ROOT CAUSE**')
        translator_start = gemini_output.find('**ERROR TRANSLATOR**')
        fixed_code_start = gemini_output.find('**FIXED CODE**')
        
        # Ekstraksi Root Cause
        root_cause = gemini_output[root_cause_start:translator_start].replace('**ROOT CAUSE**', '').strip()
        
        # Ekstraksi Error Translator
        error_translation = gemini_output[translator_start:fixed_code_start].replace('**ERROR TRANSLATOR**', '').strip()
        
        # Ekstraksi Fixed Code (mencari blok kode markdown)
        code_block_match = gemini_output[fixed_code_start:].find('```')
        fixed_code_end = gemini_output[fixed_code_start + code_block_match + 3:].find('```')
        
        fixed_code = gemini_output[fixed_code_start + code_block_match + 3 : fixed_code_start + code_block_match + 3 + fixed_code_end].strip()

        if not fixed_code:
             fixed_code = "Parsing Fixed Code Gagal. Cek output Gemini mentah."
        
    except Exception as e:
        # Jika parsing gagal, kirim output mentah sebagai root cause
        raise HTTPException(status_code=500, detail=f"Gagal memproses output AI: {e}. Output Mentah: {gemini_output[:200]}")
    
    # 5. Mengembalikan Response Terstruktur
    return FixResponse(
        root_cause=root_cause,
        error_translation=error_translation,
        fixed_code=fixed_code,
        ai_status="SUCCESS"
    )
