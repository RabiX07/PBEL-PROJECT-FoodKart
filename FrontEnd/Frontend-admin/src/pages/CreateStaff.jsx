import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function CreateStaff() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await axiosInstance.post("/admin/auth/create", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: "staff",
      });

      if (res.data.success) {
        setMessage("Staff account created successfully.");

        setFormData({
          fullName: "",
          email: "",
          password: "",
        });
      }
    } catch (err) {
      console.error("Create Staff Error:", err);

      setError(
        err.response?.data?.message || "Failed to create staff account.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Add Staff</h1>

        <p className="text-white/60 mb-8">
          Create a new staff account for the canteen.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 space-y-6"
        >
          {/* Full Name */}
          <div>
            <label className="block text-sm text-white/70 mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 outline-none focus:border-yellow-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter staff email"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 outline-none focus:border-yellow-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create password"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 outline-none focus:border-yellow-400"
            />
          </div>

          {/* Success */}
          {message && (
            <div className="bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg p-3">
              {message}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg p-3">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold transition"
          >
            {loading ? "Creating Staff..." : "Create Staff"}
          </button>
        </form>
      </div>
    </div>
  );
}
