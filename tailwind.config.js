// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
     "./styles/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- DEFINISI WARNA VS CODE ---
        'vscode-bg': '#1E1E1E', 
        'vscode-panel': '#252526',
        'vscode-border': '#3C3C3C',
        'vscode-accent': '#007ACC', // Biru VS Code
        'neon-blue': '#4C9AFF', // Biru terang untuk fokus/aksi
        // ------------------------------
      },
      boxShadow: {
        'neon': '0 0 10px rgba(76, 154, 255, 0.5)', // Efek shadow untuk tombol penting
      }
    },
  },
  plugins: [],
};
