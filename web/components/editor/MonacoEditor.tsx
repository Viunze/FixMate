// web/components/editor/MonacoEditor.tsx

import React from 'react';
import Editor from '@monaco-editor/react';

// --- INTERFACE DIPERBARUI ---
// Menambahkan properti 'theme' untuk mengatasi Type Error
interface MonacoEditorProps {
    title: string;
    value: string;
    onChange: (value: string | undefined) => void;
    height: string;
    language?: string;
    readOnly?: boolean;
    // TEMA BARU DITAMBAHKAN AGAR SESUAI DENGAN PENGGUNAAN DI [projectId].tsx
    theme?: 'vs-dark' | 'light' | 'hc-black'; 
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({ 
    title, 
    value, 
    onChange, 
    height, 
    language = 'javascript', 
    readOnly = false,
    theme = 'vs-dark' // Set default theme
}) => {
    
    // Custom Options untuk tampilan VS Code yang bersih
    const editorOptions = {
        readOnly: readOnly,
        minimap: { enabled: false }, // Minimap dimatikan
        fontSize: 14,
        scrollBeyondLastLine: false,
        wordWrap: 'on' as const,
        automaticLayout: true,
        // menghilangkan garis vertikal (rulers)
        rulers: [],
    };
    
    return (
        <div className="flex flex-col h-full bg-vscode-panel">
            
            {/* Header Panel Mirip Tab VS Code */}
            <div className="panel-header flex justify-between items-center text-gray-300 font-mono">
                <span>{title}</span>
                {readOnly && <span className="text-xs text-gray-500">(Read-Only)</span>}
            </div>

            {/* Kontainer Editor Monaco */}
            <div style={{ height: height || '100%', flexGrow: 1 }}>
                <Editor
                    height="100%"
                    defaultLanguage={language}
                    value={value}
                    theme={theme} // Meneruskan prop theme yang baru
                    onChange={onChange}
                    options={editorOptions}
                />
            </div>
        </div>
    );
};

export default MonacoEditor;
