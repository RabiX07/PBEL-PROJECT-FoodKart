import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";


export default function HomePage() {
  return (
    <div className="h-screen w-full relative bg-gray-900 text-gray-900">
      <div className="absolute inset-0 overflow-hidden">

        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gFood" x1="0" x2="1">
              <stop offset="0%" stopColor="#fff6e6" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#fff0f0" stopOpacity="0.06" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="100" height="100" fill="url(#gFood)" />
          <g fill="rgba(255,255,255,0.03)" transform="scale(1.2)">
            <path d="M10 70c2-1 6-3 9-1s6 5 8 4 4-4 6-5 6 0 8 1 6 1 7-1" />
            <circle cx="85" cy="25" r="6" />
          </g>
        </svg>
      </div>

      {/* Content */}
      <header className="relative z-10">
        <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/90 flex items-center justify-center text-2xl font-extrabold text-indigo-600">FK</div>
            <div className="text-white font-bold text-lg">FoodKart</div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-white/90 hover:text-white py-2 px-3 rounded-md">Sign in</Link>
            <Link to="/signup" className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold shadow">Get started</Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-96px)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">Welcome to <span className="text-amber-300">FoodKart</span></h1>
            <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">Order your meals directly from the restaurant — no queues, no waiting. Quick ordering, fresh food, and a smooth experience.</p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <Link to="/signup" className="inline-flex items-center gap-3 bg-amber-400 text-gray-900 px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-[1.02] transition-transform">Create account</Link>
              <Link to="/login" className="inline-flex items-center gap-3 border border-white/20 text-white px-5 py-3 rounded-full hover:bg-white/6 transition-colors">Sign in</Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-white/80">

              {/* Instant Ordering */}
              <div className="flex items-center gap-2">
                <span className="text-lg">✨</span>
                <span>Instant ordering</span>
              </div>

              {/* Fresh Food */}
              <div className="flex items-center gap-2">
                <span className="text-lg">🍛</span>
                <span>Fresh food</span>
              </div>

              {/* Skip Waiting Line */}
              <div className="flex items-center gap-2">
                <span className="text-lg">⏱</span>
                <span>Skip the waiting line</span>
              </div>

            </div>

          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-white/60 text-center">© {new Date().getFullYear()} FoodKart — Delicious delivered.</div>
      </footer>

      {/* dark overlay to ensure text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 pointer-events-none z-5" />
    </div>
  );
}
