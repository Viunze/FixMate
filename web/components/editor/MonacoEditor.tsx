// web/components/editor/MonacoEditor.tsx

import React from 'react';
import Editor from '@monaco-editor/react';

interface MonacoEditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    readOnly?: boolean;
    language?: string;
    height?: string;
    title: string;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({ 
    value, 
    onChange, 
    readOnly = false, 
    language = 'javascript',
    height = '100%',
    title
}) => {
    return (
        <div className="flex flex-col h-full border border-gray-700 rounded-lg overflow-hidden shadow-lg bg-gray-800/70">
            <div className="bg-gray-700 p-2 text-sm text-neon-blue font-mono border-b border-gray-600">
                {title}
            </div>
            <div className="flex-grow">
                <Editor
                    height={height}
                    language={language}
                    value={value}
                    theme="vs-dark"
                    onChange={onChange}
                    options={{
                        readOnly: readOnly,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14
                    }}
                />
            </div>
        </div>
    );
};

export default MonacoEditor;
