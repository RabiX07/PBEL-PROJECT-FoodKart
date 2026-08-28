import React, { useState } from "react";
import { Link } from "react-router";
import axiosInstance from "../../api/axiosInstance.js";

export default function AdminLogin() {
  const PRIMARY_YELLOW = "#f6b318";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
  setLoading(true);

  const res = await axiosInstance.post(
    "/admin/auth/login",
    { email, password },
    { withCredentials: true } // important for adminToken cookie
  );

  if (res.data.success) {
    alert("Admin Login successful!");
    window.location.href = "/admin/dashboard";
  } else {
    alert(res.data.message || "Login failed");
  }

} catch (error) {
  console.error(error);
  alert(error.response?.data?.message || "Login failed");
} finally {
  setLoading(false);
}

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden text-white">

      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 opacity-90" />

      {/* Login Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl p-10 rounded-2xl shadow-xl w-full max-w-md border border-white/10">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-white/90 flex items-center justify-center text-2xl font-extrabold text-indigo-600">
            FK
          </div>
          <span className="text-2xl font-bold">FoodKart Admin</span>
        </div>

        <h2 className="text-3xl font-bold mb-2 text-center">Admin Login</h2>
        <p className="text-white/70 text-center mb-8 text-sm">Access your admin dashboard</p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block text-white/70 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-white/10 text-white focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-white/70 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-white/10 text-white focus:outline-none focus:border-yellow-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: PRIMARY_YELLOW }}
            className={`w-full py-3 rounded-lg font-bold text-black shadow transition 
              ${loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            to="/admin"
            className="text-white/70 hover:underline text-sm"
          >
            ← Back to Admin Home
          </Link>
        </div>

        {/* User site link */}
        <div className="text-center mt-2">
          <Link
            to="/"
            className="text-white/50 hover:underline text-xs"
          >
            Go to User Site
          </Link>
        </div>

      </div>
    </div>
  );
}
