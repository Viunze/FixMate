/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palet VS Code & FixMate Premium
        'vscode-bg': '#1E1E1E',          // Latar belakang utama
        'vscode-panel': '#252526',       // Background panel/sidebar
        'vscode-border': '#3C3C3C',      // Border tipis antar panel
        'neon-blue': '#4c9aff',          // Aksen utama FixMate
        'vscode-accent': '#007ACC',      // Biru VS Code untuk highlight
      },
      boxShadow: {
        'neon': '0 0 10px rgba(76, 154, 255, 0.5)', // Efek shadow neon
      }
    },
  },
  plugins: [],
}
