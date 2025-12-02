// web/pages/editor/[projectId].tsx

// ... (Imports dan States lainnya)

// --- JSX START ---
    
    return (
        // MENGGUNAKAN ARBITRARY VALUE TAILWIND (Fallback) UNTUK BG UTAMA
        // bg-[#1E1E1E] menggantikan bg-vscode-bg
        <div className="min-h-screen bg-[#1E1E1E] text-white font-sans p-4"> 
            <Head>
                <title>FixMate | AI Engineer Assistant</title>
            </Head>

            {/* HEADER & LOGIN */}
            <motion.header 
                // ... (Gunakan kelas border-vscode-border dan text-neon-blue yang seharusnya sudah berfungsi)
                className="flex justify-between items-center mb-4 border-b border-vscode-border pb-3" 
            >
                <h1 className="text-3xl font-bold text-neon-blue">FixMate 🚀</h1>
                
                {/* Login Status & Button */}
                <div className="flex items-center space-x-4">
                    {user ? (
                        // ...
                        <span className="text-sm text-gray-300 flex items-center">
                            <img src={user.avatar} alt="Avatar" className="w-7 h-7 rounded-full mr-2 border border-green-500" />
                            Logged in as **{user.username}**
                        </span>
                    ) : (
                        <motion.button
                            // ...
                            className="px-4 py-2 bg-vscode-accent text-white rounded-md font-bold text-sm hover:bg-vscode-accent/80"
                        >
                            Login with GitHub
                        </motion.button>
                    )}

                    <motion.button
                        // ...
                        className={`px-8 py-3 rounded-md font-bold text-lg transition-all shadow-neon 
                            ${isLoading ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-neon-blue to-cyan-500 hover:opacity-90'}`}
                    >
                        {mode === 'repo' ? 'APPLY & CREATE PR' : (isLoading ? 'ANALYZING...' : 'SOLVE INSTANTLY')}
                    </motion.button>
                </div>
            </motion.header>

            {/* TOGGLE MODE */}
            <div className="flex mb-4 border border-vscode-border rounded-md w-full max-w-xl mx-auto">
                <button
                    onClick={() => setMode('paste')}
                    className={`flex-1 p-2 text-center transition-all font-mono text-sm ${mode === 'paste' ? 'bg-neon-blue text-white' : 'bg-vscode-panel hover:bg-vscode-panel/70 text-gray-400'}`}
                >
                    1. Fix Code **(Paste Mode)**
                </button>
                <button
                    onClick={() => setMode('repo')}
                    disabled={!user} 
                    className={`flex-1 p-2 text-center transition-all font-mono text-sm ${mode === 'repo' ? 'bg-neon-blue text-white' : 'bg-vscode-panel hover:bg-vscode-panel/70 text-gray-400'} ${!user && 'opacity-50 cursor-not-allowed'}`}
                >
                    2. Apply Fix to **GitHub Repo**
                </button>
            </div>

            {/* DUAL MODE CONTENT */}
            {/* Mengganti bg-vscode-panel dengan bg-[#252526] di semua tempat jika perlu,
                tetapi mari kita coba bg-vscode-panel yang seharusnya sudah benar dulu. */}
            
            {/* ... (Lanjutkan dengan kode sebelumnya, pastikan Monaco theme="vs-dark") ... */}

            {mode === 'paste' && (
                <div className="grid grid-cols-3 gap-3 h-[80vh]">
                    
                    {/* Panel Kiri: Kode Asli dan Error Log */}
                    <div className="col-span-1 flex flex-col space-y-3">
                        {/* Editor Kode Asli */}
                        <div className="flex-grow border border-vscode-border rounded-none shadow-xl">
                            <MonacoEditor 
                                title="RAW CODE & CONTEXT (File: Untitled.js)"
                                value={rawCode}
                                onChange={(v) => setRawCode(v || '')}
                                height="100%"
                                theme="vs-dark" // KRITIS: Harus vs-dark
                            />
                        </div>
                        
                        {/* Panel Log (Terminal) */}
                        <div className="h-[25vh] border border-vscode-border rounded-none shadow-xl flex flex-col">
                            <div className="panel-header text-red-400 font-mono">PROBLEMS (Error Log)</div>
                            <MonacoEditor 
                                title="ERROR LOG (Paste Here)"
                                value={errorLog}
                                onChange={(v) => setErrorLog(v || '')}
                                height="100%"
                                language="text"
                                theme="vs-dark" // KRITIS: Harus vs-dark
                            />
                        </div>
                    </div>

                    {/* Panel Tengah: Analisis */}
                    <motion.div 
                        // ...
                        className="col-span-1 space-y-4 overflow-y-auto border border-vscode-border bg-vscode-panel rounded-none shadow-xl"
                    >
                        {/* ... */}
                    </motion.div>
                </div>
            )}
            
            {/* Status Bar */}
            <footer className="fixed bottom-0 left-0 right-0 h-7 bg-vscode-accent text-white text-xs flex items-center px-4 shadow-2xl">
                <span className="font-bold">FixMate Status:</span> {isLoading ? 'Running analysis...' : 'Ready'}
            </footer>
        </div>
    );
};

export default EditorPage;
