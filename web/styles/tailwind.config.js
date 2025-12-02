// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- SKEMA WARNA DARK MODE PROFESIONAL ---
        'app-dark': '#272822',    // Background utama (Monokai Dark)
        'panel-dark': '#3C3D37',  // Panel & sidebar
        'border-dark': '#555555', // Border pemisah
        'accent-blue': '#66D9EF', // Biru terang untuk aksen/link (Cyan)
        'solve-green': '#A6E22E', // Hijau terang untuk tombol Solve
        'error-red': '#F92672',   // Merah terang untuk error
        // ----------------------------------------
      },
    },
  },
  plugins: [],
};
