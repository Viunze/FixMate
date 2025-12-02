// web/pages/editor/[projectId].tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import MonacoEditor from '../../components/editor/MonacoEditor';
import api from '../../lib/api';

interface FixResult {
    root_cause: string;
    error_translation: string;
    fixed_code: string;
}

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

// export default MyComponent; // Misal ada error lain di sini
`;

const initialErrorLog = `
Uncaught ReferenceError: count is not defined
    at MyComponent (MyComponent.js:6)
    at renderWithHooks (react-dom.development.js:16301)
    at updateFunctionComponent (react-dom.development.js:19558)
`;

const EditorPage: React.FC = () => {
    const [rawCode, setRawCode] = useState(initialCode);
    const [errorLog, setErrorLog] = useState(initialErrorLog);
    const [result, setResult] = useState<FixResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSolve = async () => {
        setIsLoading(true);
        setResult(null);

        try {
            // Payload yang dikirim ke Backend Node.js API Gateway
            const payload = {
                raw_code: rawCode,
                error_log: errorLog,
                framework: 'React', 
                // Dependency Analyzer (simulasi data)
                project_dependencies: { 
                    'react': '18.2.0', 
                    'react-dom': '18.2.0' 
                }
            };
            
            const response = await api.post('/fix', payload);
            setResult(response.data);

        } catch (error) {
            console.error('Fix request failed:', error);
            alert('Gagal mendapatkan solusi dari FixMate. Cek konsol dan pastikan API Core berjalan.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans p-6">
            <Head>
                <title>FixMate | AI Engineer Assistant</title>
            </Head>

            <motion.header 
                initial={{ y: -50 }} 
                animate={{ y: 0 }}
                className="flex justify-between items-center mb-6 border-b border-neon-blue/50 pb-4"
            >
                <h1 className="text-3xl font-bold text-neon-blue">FixMate 🚀</h1>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSolve}
                    disabled={isLoading}
                    className={`px-8 py-3 rounded-xl font-bold text-lg transition-all shadow-xl 
                        ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'}`}
                >
                    {isLoading ? 'ANALYZING...' : 'SOLVE INSTANTLY'}
                </motion.button>
            </motion.header>

            <div className="grid grid-cols-3 gap-6 h-[80vh]">
                
                {/* Panel Kiri: Kode Asli */}
                <div className="col-span-1 flex flex-col space-y-4">
                    <MonacoEditor 
                        title="RAW CODE & CONTEXT"
                        value={rawCode}
                        onChange={(v) => setRawCode(v || '')}
                        height="60%"
                    />
                    <MonacoEditor 
                        title="ERROR LOG (Paste Here)"
                        value={errorLog}
                        onChange={(v) => setErrorLog(v || '')}
                        height="40%"
                        language="text"
                    />
                </div>

                {/* Panel Tengah: Analisis (Root Cause & Translation) */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.1 }}
                    className="col-span-1 space-y-6 overflow-y-auto p-4 border border-gray-700 rounded-lg bg-gray-800/70 shadow-2xl"
                >
                    <h2 className="text-xl font-semibold text-neon-blue border-b border-gray-600 pb-2">AI ROOT-CAUSE DETECTOR</h2>
                    
                    {isLoading && <p className="text-cyan-400 animate-pulse">Menghubungi AI Engineer... Analisis Dependency...</p>}

                    {result ? (
                        <>
                            <div className="p-4 bg-gray-900 rounded-md">
                                <p className="text-lg font-mono text-red-400 mb-2">**ROOT CAUSE**</p>
                                <p className="text-gray-300 whitespace-pre-wrap">{result.root_cause}</p>
                            </div>
                            
                            <div className="p-4 bg-gray-900 rounded-md">
                                <p className="text-lg font-mono text-green-400 mb-2">**ERROR TRANSLATOR**</p>
                                <p className="text-gray-300 whitespace-pre-wrap">{result.error_translation}</p>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-500">Hasil analisis akan muncul di sini.</p>
                    )}
                </motion.div>

                {/* Panel Kanan: Fixed Code & Apply Patch */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.2 }}
                    className="col-span-1 flex flex-col"
                >
                    <MonacoEditor 
                        title="FIXED CODE (Auto Patch Generator)"
                        value={result?.fixed_code || '// Kode perbaikan akan muncul di sini...'}
                        onChange={() => {}} // ReadOnly
                        readOnly={true}
                        height="90%"
                    />
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="mt-4 p-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
                        disabled={!result}
                    >
                        APPLY FIX (Simulasi Auto Patch)
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default EditorPage;
