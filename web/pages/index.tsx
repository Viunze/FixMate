// web/pages/index.tsx

import React from 'react';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold text-neon-blue mb-4">
        FixMate 🚀 — AI Error Solver
      </h1>
      <p className="text-xl mb-8">
        "Fix any error. Instantly."
      </p>
      
      {/* Mengarahkan ke halaman editor Anda */}
      <Link href="/editor/new-project" legacyBehavior>
        <a className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold transition-all hover:opacity-90">
          Start Fixing Now
        </a>
      </Link>
    </div>
  );
};

export default HomePage;
