// web/pages/editor/[projectId].tsx (Kode Lengkap yang Terkoreksi Sintaksis)

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router'; 

import MonacoEditor from '../../components/editor/MonacoEditor';
import api from '../../lib/api';
import { loginWithGitHub, handleGitHubCallback } from '../../lib/auth'; 

// --- INTERFACES ---

interface FixResult {
    root_cause: string;
    error_translation: string;
    fixed_code?: string;
    pull_request_url?: string;
}

interface RepoData {
    owner: string;
    repo: string;
    filePath: string;
    branch: string;
}

// --- INITIAL DATA ---

const initialCode = `
import React, { useState } from 'react';

function MyComponent() {
    // Error: Trying to use 'count' before initialization
    console.log(count); 

    const [count, setCount] = useState(0);

    return (
        <button onClick={() => setCount(count + 1)}>
            Clicked {count} times
        </button>
    );
}
`;

const initialErrorLog = `
Uncaught ReferenceError: count is not defined
    at MyComponent (MyComponent.js:6)
    at renderWithHooks (react-dom.development.js:16301)
`;

// --- COMPONENT START ---

const EditorPage: React.FC = () => { // <--- Kurung Kurawal Pembuka
    const router = useRouter();
    
    // State Fungsionalitas Utama
    const [rawCode, setRawCode, ] = useState(initialCode);
    const [errorLog, setErrorLog] = useState(initialErrorLog);
    const [result, setResult] = useState<FixResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // State GitHub & Mode
    const [user, setUser] = useState<any>(null);
    const [mode, setMode] = useState<'paste' | 'repo'>('paste'); 
    const [repoData, setRepoData] = useState<RepoData>({ 
        owner: 'viunze', 
        repo: 'FixMate-Demo', 
        filePath: 'src/components/MyComponent.js', 
        branch: 'main' 
    });

    // --- EFFECT: Handle GitHub OAuth Callback & Load User ---
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const storedUser = localStorage.getItem('fixmate_user');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        if (code && !user) {
            handleGitHubCallback(code).then(loggedInUser => {
                if (loggedInUser) {
                    setUser(loggedInUser);
                    localStorage.setItem('fixmate_user', JSON.stringify(loggedInUser));
                    router.replace(router.pathname, undefined, { shallow: true }); 
                }
            });
        }
    }, [user, router]);


    // --- FUNCTION: Handle Solve Request (Dual Mode) ---
    const handleSolve = async () => {
        if (mode === 'repo' && (!user || !user.githubAccessToken)) {
             alert("Anda harus Login dengan GitHub untuk menggunakan mode Repo Apply Fix.");
             return;
        }

        setIsLoading(true);
        setResult(null);

        try {
            let response;
            
            if (mode === 'repo') {
                const repoPayload = {
                    ...repoData,
                    githubAccessToken: user.githubAccessToken,
                };
                response = await api.post('/fix/repo', repoPayload); 
                
            } else {
                const pastePayload = {
                    raw_code: rawCode,
                    error_log: errorLog,
                    framework: 'React', 
                    project_dependencies: { 'react': '18.2.0' } 
                };
                response = await api.post('/fix', pastePayload);
            }

            setResult(response.data);

        } catch (error: any) {
            console.error('Fix request failed:', error.response?.data || error);
            alert(`Gagal mendapatkan solusi dari FixMate. Detail: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    // --- JSX START ---
    
    return (
        <div className="min-h-screen bg-[#1E1E1E] text-white font-sans p-4"> 
            <Head>
                <title>FixMate | AI Engineer Assistant</title>
            </Head>

            {/* HEADER & LOGIN */}
            <motion.header 
                initial={{ y: -50 }} 
                animate={{ y: 0 }}
                className="flex justify-between items-center mb-4 border-b border-vscode-border pb-3" 
            >
                <h1 className="text-3xl font-bold text-neon-blue">FixMate 🚀</h1>
                
                {/* Login Status & Button */}
                <div className="flex items-center space-x-4">
                    {user ? (
                        <span className="text-sm text-gray-300 flex items-center">
                            <img src={user.avatar} alt="Avatar" className="w-7 h-7 rounded-full mr-2 border border-green-500" />
                            Logged in as **{user.username}**
                        </span>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={loginWithGitHub}
                            className="px-4 py-2 bg-vscode-accent text-white rounded-md font-bold text-sm hover:bg-vscode-accent/80"
                        >
                            Login with GitHub
                        </motion.button>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(76, 154, 255, 0.7)' }} 
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSolve}
                        disabled={isLoading}
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
            {mode === 'repo' ? (
                // --- REPO INPUT MODE ---
                <div className="bg-vscode-panel border border-vscode-border p-6 rounded-none h-[80vh] overflow-y-auto shadow-xl">
                    <h2 className="text-xl text-neon-blue mb-4 font-bold">GitHub Repository Details</h2>
                    <p className="text-gray-400 mb-6">FixMate akan mengambil kode, menganalisis, dan membuat branch baru serta Pull Request (PR) ke repositori Anda.</p>

                    <div className="space-y-4">
                        <label className="block text-gray-300 text-sm">Owner/Org Name (e.g., viunze)</label>
                        <input 
                            type="text" 
                            value={repoData.owner} 
                            onChange={(e) => setRepoData({ ...repoData, owner: e.target.value })}
                            className="w-full p-2 bg-vscode-bg border border-vscode-border rounded-sm text-white"
                        />
                        <label className="block text-gray-300 text-sm">Repository Name (e.g., FixMate-Demo)</label>
                        <input 
                            type="text" 
                            value={repoData.repo} 
                            onChange={(e) => setRepoData({ ...repoData, repo: e.target.value })}
                            className="w-full p-2 bg-vscode-bg border border-vscode-border rounded-sm text-white"
                        />
                        <label className="block text-gray-300 text-sm">File Path to Fix (e.g., src/components/MyComponent.js)</label>
                        <input 
                            type="text" 
                            value={repoData.filePath} 
                            onChange={(e) => setRepoData({ ...repoData, filePath: e.target.value })}
                            className="w-full p-2 bg-vscode-bg border border-vscode-border rounded-sm text-white"
                        />
                        <label className="block text-gray-300 text-sm">Target Branch (e.g., main)</label>
                        <input 
                            type="text" 
                            value={repoData.branch} 
                            onChange={(e) => setRepoData({ ...repoData, branch: e.target.value })}
                            className="w-full p-2 bg-vscode-bg border border-vscode-border rounded-sm text-white"
                        />
                    </div>
                    
                    {result && result.pull_request_url && (
                        <div className="mt-8 p-4 bg-green-900/50 border border-green-500 rounded-sm">
                            <p className="font-bold text-green-400 mb-2">✅ Pull Request Created!</p>
                            <a 
                                href={result.pull_request_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-neon-blue hover:underline"
                            >
                                View Pull Request
                            </a>
                        </div>
                    )}
                </div>

            ) : (
                // --- PASTE CODE MODE (3 PANEL LAYOUT) ---
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
                                theme="vs-dark" // Tema Gelap VS Code
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
                                theme="vs-dark" // Tema Gelap VS Code
                            />
                        </div>
                    </div>

                    {/* Panel Tengah: Analisis */}
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
                                <p className="text-gray-500 text-center py-10">Hasil analisis akan muncul di sini.</p>
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
                            theme="vs-dark" // Tema Gelap VS Code
                        />
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="mt-0 p-3 bg-green-600 hover:bg-green-700 text-white font-bold transition-colors"
                            disabled={!result}
                        >
                            APPLY FIX (Simulasi Auto Patch)
                        </motion.button>
                    </motion.div>
                </div>
            )}

            {/* Status Bar (Area bawah ala VS Code) */}
            <footer className="fixed bottom-0 left-0 right-0 h-7 bg-vscode-accent text-white text-xs flex items-center px-4 shadow-2xl">
                <span className="font-bold">FixMate Status:</span> {isLoading ? 'Running analysis...' : 'Ready'}
            </footer>
        </div>
    );
}; // <--- PENUTUP YANG HILANG/RUSAK
// <--- Catatan: TIDAK ADA KODE LAGI DI BAWAH PENUTUP INI

export default EditorPage;
