// web/pages/editor/[projectId].tsx

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router'; 

import MonacoEditor from '../../components/editor/MonacoEditor';
import api from '../../lib/api';
import { loginWithGitHub, handleGitHubCallback } from '../../lib/auth'; 

// --- INTERFACES & INITIAL DATA (Tidak Berubah) ---

// ... (Kode Interface dan Initial Data tetap di sini) ...

// --- COMPONENT START ---

const EditorPage: React.FC = () => { 
    const router = useRouter();
    // ... (States dan fungsi handleSolve tidak berubah) ...
    
    return (
        // BACKGROUND UTAMA: app-dark (Monokai)
        <div className="min-h-screen bg-app-dark text-gray-200 font-sans p-6"> 
            <Head>
                <title>FixMate | AI Engineer Assistant</title>
            </Head>

            {/* HEADER & LOGIN */}
            <motion.header 
                initial={{ y: -50 }} 
                animate={{ y: 0 }}
                // Border gelap
                className="flex justify-between items-center mb-6 border-b border-border-dark pb-4" 
            >
                {/* Warna teks aksen */}
                <h1 className="text-3xl font-bold text-accent-blue">FixMate 🚀</h1>
                
                {/* Login Status & Button */}
                <div className="flex items-center space-x-4">
                    {user ? (
                        <span className="text-sm text-gray-400 flex items-center">
                            <img src={user.avatar} alt="Avatar" className="w-7 h-7 rounded-full mr-2 border border-solve-green" />
                            Logged in as **{user.username}**
                        </span>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={loginWithGitHub}
                            // Tombol Login dengan aksen biru
                            className="px-4 py-2 bg-accent-blue text-app-dark rounded-lg font-bold text-sm hover:bg-opacity-80 shadow-md"
                        >
                            Login with GitHub
                        </motion.button>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSolve}
                        disabled={isLoading}
                        // Tombol Solve dengan aksen hijau
                        className={`px-8 py-3 rounded-lg font-bold text-lg transition-all shadow-lg 
                            ${isLoading ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-solve-green text-app-dark hover:opacity-90'}`}
                    >
                        {mode === 'repo' ? 'APPLY & CREATE PR' : (isLoading ? 'ANALYZING...' : 'SOLVE INSTANTLY')}
                    </motion.button>
                </div>
            </motion.header>

            {/* TOGGLE MODE */}
            <div className="flex mb-6 border border-border-dark rounded-lg w-full max-w-xl mx-auto overflow-hidden">
                <button
                    onClick={() => setMode('paste')}
                    className={`flex-1 p-3 text-center transition-all font-mono text-sm 
                        ${mode === 'paste' ? 'bg-solve-green text-app-dark' : 'bg-panel-dark hover:bg-gray-600 text-gray-300'}`}
                >
                    1. Fix Code **(Paste Mode)**
                </button>
                <button
                    onClick={() => setMode('repo')}
                    disabled={!user} 
                    className={`flex-1 p-3 text-center transition-all font-mono text-sm 
                        ${mode === 'repo' ? 'bg-solve-green text-app-dark' : 'bg-panel-dark hover:bg-gray-600 text-gray-300'} ${!user && 'opacity-50 cursor-not-allowed'}`}
                >
                    2. Apply Fix to **GitHub Repo**
                </button>
            </div>

            {/* DUAL MODE CONTENT */}
            {mode === 'repo' ? (
                // --- REPO INPUT MODE ---
                <div className="bg-panel-dark border border-border-dark p-6 rounded-lg shadow-xl h-[70vh] overflow-y-auto">
                    {/* ... (Ganti input class jika perlu) ... */}
                </div>

            ) : (
                // --- PASTE CODE MODE ---
                <div className="grid grid-cols-3 gap-6 h-[70vh]">
                    
                    {/* Panel Kiri: Kode Asli dan Error Log */}
                    <div className="col-span-1 flex flex-col space-y-6">
                        {/* Editor Kode Asli */}
                        <div className="flex-grow border border-border-dark rounded-lg shadow-xl">
                            <MonacoEditor 
                                title="RAW CODE & CONTEXT (File: Untitled.js)"
                                value={rawCode}
                                onChange={(v) => setRawCode(v || '')}
                                height="100%"
                                theme="vs-dark" // KRITIS: Kembali ke Dark Theme
                            />
                        </div>
                        
                        {/* Panel Log (Terminal) */}
                        <div className="h-[25vh] border border-border-dark rounded-lg shadow-xl flex flex-col">
                            <div className="p-3 border-b border-border-dark bg-panel-dark text-error-red font-bold text-sm">PROBLEMS (Error Log)</div>
                            <MonacoEditor 
                                title="ERROR LOG (Paste Here)"
                                value={errorLog}
                                onChange={(v) => setErrorLog(v || '')}
                                height="100%"
                                language="text"
                                theme="vs-dark" // KRITIS: Kembali ke Dark Theme
                            />
                        </div>
                    </div>

                    {/* Panel Tengah: Analisis */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: 0.1 }}
                        className="col-span-1 space-y-4 overflow-y-auto border border-border-dark bg-panel-dark rounded-lg shadow-xl"
                    >
                        <div className="p-3 border-b border-border-dark bg-panel-dark text-accent-blue font-bold text-sm">AI ROOT-CAUSE DETECTOR & TRANSLATOR</div>
                        
                        <div className="p-4">
                            {isLoading && <p className="text-accent-blue animate-pulse">Menghubungi AI Engineer... Analisis Dependency...</p>}

                            {result ? (
                                <>
                                    {/* Tampilan Result Dark Mode */}
                                    <div className="p-3 mb-4 bg-gray-800 border-l-4 border-error-red rounded-sm">
                                        <p className="text-sm font-mono text-error-red mb-1">**ROOT CAUSE**</p>
                                        <p className="text-gray-300 whitespace-pre-wrap text-sm">{result.root_cause}</p>
                                    </div>
                                    
                                    <div className="p-3 bg-gray-800 border-l-4 border-solve-green rounded-sm">
                                        <p className="text-sm font-mono text-solve-green mb-1">**ERROR TRANSLATOR**</p>
                                        <p className="text-gray-300 whitespace-pre-wrap text-sm">{result.error_translation}</p>
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-500 text-center py-10">Hasil analisis akan muncul di sini.</p>
                            )}
                        </div>
                    </motion.div>

                    {/* Panel Kanan: Fixed Code & Apply Patch */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: 0.2 }}
                        className="col-span-1 flex flex-col border border-border-dark rounded-lg shadow-xl"
                    >
                        <div className="p-3 border-b border-border-dark bg-panel-dark text-solve-green font-bold text-sm">FIXED CODE (Auto Patch Generator)</div>
                        <MonacoEditor 
                            title="FIXED CODE"
                            value={result?.fixed_code || '// Kode perbaikan akan muncul di sini...'}
                            onChange={() => {}} 
                            readOnly={true}
                            height="100%"
                            theme="vs-dark" // KRITIS: Kembali ke Dark Theme
                        />
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="mt-0 p-3 bg-solve-green hover:bg-opacity-90 text-app-dark font-bold transition-colors rounded-b-lg"
                            disabled={!result}
                        >
                            APPLY FIX
                        </motion.button>
                    </motion.div>
                </div>
            )}

            {/* Status Bar */}
            <footer className="fixed bottom-0 left-0 right-0 h-8 bg-panel-dark text-gray-300 text-xs flex items-center px-4 shadow-2xl border-t border-border-dark">
                <span className="font-bold">FixMate Status:</span> {isLoading ? 'Running analysis...' : 'Ready'}
            </footer>
        </div>
    );
};

export default EditorPage;
