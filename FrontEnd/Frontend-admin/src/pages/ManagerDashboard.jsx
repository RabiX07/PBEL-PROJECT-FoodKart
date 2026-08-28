import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import axiosInstance from "../api/axiosInstance";

export default function AdminDashboard() {
  const PRIMARY_YELLOW = "#f6b318";

  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await axiosInstance.get("/admin/stats"); // optional backend
        if (res.data.success) setStats(res.data.stats);
      } catch (err) {
        console.error("Dashboard stats load failed:", err);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white relative">
      {/* Background */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto p-10">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>

          <Link
            to="/admin/settings"
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-white"
          >
            ⚙️ Settings
          </Link>
        </div>

        {/* STATS CARDS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Total Orders */}
          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-xl shadow">
            <div className="text-white/60 text-sm">Total Orders</div>
            <div className="text-3xl font-bold mt-2">{stats.totalOrders}</div>
          </div>

          {/* Pending */}
          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-xl shadow">
            <div className="text-white/60 text-sm">Pending Orders</div>
            <div className="text-3xl font-bold mt-2">{stats.pendingOrders}</div>
          </div>

          {/* Delivered */}
          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-xl shadow">
            <div className="text-white/60 text-sm">Delivered</div>
            <div className="text-3xl font-bold mt-2">
              {stats.deliveredOrders}
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-xl shadow">
            <div className="text-white/60 text-sm">Total Revenue</div>
            <div className="text-3xl font-bold mt-2">₹{stats.totalRevenue}</div>
          </div>
        </motion.div>

        {/* SECTION TITLE */}
        <h2 className="text-2xl font-semibold mt-14 mb-4">Quick Actions</h2>

        {/* QUICK ACTION BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Manage Orders */}
          <Link
            to="/admin/orders"
            className="bg-white/10 hover:bg-white/20 transition p-6 rounded-2xl backdrop-blur-xl shadow flex flex-col items-center"
          >
            <span className="text-4xl">📦</span>
            <h3 className="text-xl font-semibold mt-3">Manage Orders</h3>
            <p className="text-white/60 text-sm text-center mt-1">
              View, update, and track all canteen orders.
            </p>
          </Link>

          {/* Manage Menu */}
          <Link
            to="/admin/menu"
            className="bg-white/10 hover:bg-white/20 transition p-6 rounded-2xl backdrop-blur-xl shadow flex flex-col items-center"
          >
            <span className="text-4xl">🍽</span>
            <h3 className="text-xl font-semibold mt-3">Manage Menu</h3>
            <p className="text-white/60 text-sm text-center mt-1">
              Add, edit, and control product listings.
            </p>
          </Link>

          
          {/* View Reports */}
          <Link
            to="/admin/verify-payment"
            className="bg-white/10 hover:bg-white/20 transition p-6 rounded-2xl backdrop-blur-xl shadow flex flex-col items-center"
          >
            <span className="text-4xl">💳</span>
            <h3 className="text-xl font-semibold mt-3">Verify Payment</h3>
            <p className="text-white/60 text-sm text-center mt-1">
              Sales insights and order analytics.
            </p>
          </Link>

          <Link
            to="/admin/create-staff"
            className="bg-white/10 hover:bg-white/20 transition p-6 rounded-2xl backdrop-blur-xl shadow flex flex-col items-center"
          >
            <span className="text-4xl">👤➕</span>

            <h3 className="text-xl font-semibold mt-3">Add Staff</h3>

            <p className="text-white/60 text-sm text-center mt-1">
              Create a new staff account for the canteen.
            </p>
          </Link>

        
        </motion.div>
      </div>
    </div>
  );
}
