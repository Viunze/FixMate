// web/pages/editor/[projectId].tsx (Revisi Bagian JSX)

// ... (imports dan logic lainnya tetap sama)

    return (
        // Menggunakan vscode-bg sebagai background utama
        <div className="min-h-screen bg-vscode-bg text-white font-sans p-4"> 
            <Head>
                <title>FixMate | AI Engineer Assistant</title>
            </Head>

            <motion.header 
                initial={{ y: -50 }} 
                animate={{ y: 0 }}
                // Header dengan border bawah yang halus
                className="flex justify-between items-center mb-4 border-b border-vscode-border pb-3" 
            >
                <h1 className="text-3xl font-bold text-neon-blue">FixMate 🚀</h1>
                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(76, 154, 255, 0.7)' }} // Efek neon shadow
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSolve}
                    disabled={isLoading}
                    // Tombol Solve dengan gradien Neon
                    className={`px-8 py-3 rounded-md font-bold text-lg transition-all shadow-neon 
                        ${isLoading ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-neon-blue to-cyan-500 hover:opacity-90'}`}
                >
                    {isLoading ? 'ANALYZING...' : 'SOLVE INSTANTLY'}
                </motion.button>
            </motion.header>

            {/* Layout 3 Panel Utama (Menggunakan Grid) */}
            <div className="grid grid-cols-3 gap-3 h-[90vh]"> 
                
                {/* Panel Kiri: Kode Asli dan Error Log */}
                <div className="col-span-1 flex flex-col space-y-3">
                    {/* Monaco Editor akan diwrap dengan border VS Code */}
                    <div className="flex-grow border border-vscode-border rounded-none shadow-xl">
                        <MonacoEditor 
                            title="RAW CODE & CONTEXT (File: App.jsx)"
                            value={rawCode}
                            onChange={(v) => setRawCode(v || '')}
                            height="100%"
                        />
                    </div>
                    
                    {/* Output Panel/Terminal (Error Log) */}
                    <div className="h-[25vh] border border-vscode-border rounded-none shadow-xl flex flex-col">
                        <div className="panel-header text-red-400 font-mono">PROBLEMS (Terminal Log)</div>
                        <MonacoEditor 
                            title="ERROR LOG (Paste Here)"
                            value={errorLog}
                            onChange={(v) => setErrorLog(v || '')}
                            height="100%"
                            language="text"
                            // Background log sedikit berbeda dari utama
                            theme="vs-dark" 
                        />
                    </div>
                </div>

                {/* Panel Tengah: Analisis (Root Cause & Translation) */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.1 }}
                    className="col-span-1 space-y-4 overflow-y-auto border border-vscode-border bg-vscode-panel rounded-none shadow-xl"
                >
                    <div className="panel-header font-bold text-neon-blue">AI ROOT-CAUSE DETECTOR & TRANSLATOR</div>
                    
                    <div className="p-4">
                        {isLoading && <p className="text-cyan-400 animate-pulse">Menghubungi AI Engineer... Analisis Dependency...</p>}

                        {result ? (
                            <>
                                <div className="p-3 mb-4 bg-vscode-bg border-l-4 border-red-500 rounded-sm">
                                    <p className="text-sm font-mono text-red-400 mb-1">**ROOT CAUSE**</p>
                                    <p className="text-gray-300 whitespace-pre-wrap text-sm">{result.root_cause}</p>
                                </div>
                                
                                <div className="p-3 bg-vscode-bg border-l-4 border-green-500 rounded-sm">
                                    <p className="text-sm font-mono text-green-400 mb-1">**ERROR TRANSLATOR**</p>
                                    <p className="text-gray-300 whitespace-pre-wrap text-sm">{result.error_translation}</p>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500 text-center py-10">Hasil analisis akan muncul di sini. (Simulasi Extension Panel VS Code)</p>
                        )}
                    </div>
                </motion.div>

                {/* Panel Kanan: Fixed Code & Apply Patch */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.2 }}
                    className="col-span-1 flex flex-col border border-vscode-border rounded-none shadow-xl"
                >
                    <div className="panel-header text-green-400 font-bold">FIXED CODE (Auto Patch Generator)</div>
                    <MonacoEditor 
                        title="FIXED CODE"
                        value={result?.fixed_code || '// Kode perbaikan akan muncul di sini...'}
                        onChange={() => {}} 
                        readOnly={true}
                        height="100%"
                    />
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="mt-0 p-3 bg-green-600 hover:bg-green-700 text-white font-bold transition-colors"
                        disabled={!result}
                    >
                        APPLY FIX
                    </motion.button>
                </motion.div>
            </div>
            
            {/* Status Bar (Area bawah ala VS Code) */}
            <footer className="fixed bottom-0 left-0 right-0 h-7 bg-vscode-accent text-white text-xs flex items-center px-4 shadow-2xl">
                <span className="font-bold">FixMate Status:</span> {isLoading ? 'Running analysis...' : 'Ready'}
            </footer>
        </div>
    );
};

export default EditorPage;
