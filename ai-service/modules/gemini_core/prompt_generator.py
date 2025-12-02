# ai-service/modules/gemini_core/prompt_generator.py

def create_fixmate_prompt(
    raw_code: str,
    error_log: str,
    dependency_context: str,
    framework: str
) -> str:
    """
    Menghasilkan prompt terstruktur untuk AI Engineer Assistant.

    Args:
        raw_code: Kode sumber yang memiliki error.
        error_log: Log error yang dihasilkan saat runtime/compile.
        dependency_context: Hasil analisis versi library (dari dependency_analyzer).
        framework: Framework yang digunakan (e.g., 'React', 'Node.js').

    Returns:
        String prompt yang siap dikirim ke Gemini.
    """
    
    # SYSTEM INSTRUCTION: Memastikan Gemini bertindak sebagai AI Engineer FixMate
    system_instruction = (
        "Anda adalah FixMate, seorang AI Engineer Assistant yang canggih. "
        "Tugas Anda adalah menyelesaikan error secara real-time. "
        "Hasilkan 3 output terpisah dengan format Markdown: "
        "1. **ROOT CAUSE**: Penjelasan singkat mengapa error terjadi. "
        "2. **ERROR TRANSLATOR**: Terjemahan log error ke bahasa manusia (simple). "
        "3. **FIXED CODE**: Blok kode lengkap yang sudah diperbaiki (hanya kode, tanpa komentar atau penjelasan tambahan)."
    )
    
    # USER PROMPT: Menyediakan semua konteks yang diperlukan
    user_prompt = f"""
    ANALISIS KONTEKS PROYEK DAN PERBAIKI ERROR INI.
    
    --- KONTEKS PROYEK ---
    Framework Digunakan: {framework}
    Dependency Version Check: {dependency_context}
    
    --- RAW CODE (Kode Asli) ---
    ```
    {raw_code}
    ```
    
    --- ERROR LOG ---
    {error_log}
    
    TUGAS: Selesaikan error berdasarkan konteks di atas. Berikan output hanya dalam 3 bagian format Markdown: **ROOT CAUSE**, **ERROR TRANSLATOR**, dan **FIXED CODE**.
    """
    
    # Menggabungkan instruksi sistem dan prompt pengguna
    return f"{system_instruction}\n\n{user_prompt}"

# Catatan: Modul Dependency Analyzer (dependency_context) akan diwakili oleh string placeholder
# hingga kita membangun modul Python yang mem-parsing package.json.
