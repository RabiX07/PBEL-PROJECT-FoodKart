import React from "react";
import { Link } from "react-router";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full relative bg-gray-900 text-white overflow-hidden">

      {/* Background gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 opacity-90" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 rounded-xl bg-white/90 flex items-center justify-center text-2xl font-extrabold text-indigo-600">
            FK
          </div>
          <span className="text-2xl font-bold">FoodKart Admin</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Welcome, Admin
        </h1>

        {/* Sub text */}
        <p className="text-white/70 max-w-2xl text-lg leading-relaxed">
          Manage your canteen efficiently — oversee orders, update menu items,
          track stock, and keep everything running smoothly from one dashboard.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex items-center gap-4">
          <Link
            to="/admin/login"
            className="px-6 py-3 rounded-full bg-yellow-500 text-black font-semibold shadow-lg hover:bg-yellow-400 transition"
          >
            Admin Login
          </Link>

          <Link
            to="https://mca-1st-sem-project-user.vercel.app/"
            className="px-6 py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition"
          >
            Go to User Site
          </Link>
        </div>

        {/* Highlights / Features */}
        <div className="mt-12 flex items-center justify-center gap-6 text-sm text-white/70">

          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <span>Real-time Order Control</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg">🛠</span>
            <span>Manage Menu & Stock</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg">🔐</span>
            <span>Secure Admin Access</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 w-full text-center text-white/40 text-sm">
        © 2025 FoodKart Admin — Powered by FoodKart Management Suite.
      </div>
    </div>
  );
}
