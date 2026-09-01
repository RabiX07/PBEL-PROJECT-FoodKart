import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { motion } from "framer-motion";
import { Link } from "react-router";
import toast from "react-hot-toast";
export default function Settings() {
  const PRIMARY_YELLOW = "#f6b318";

  const [fullName, setFullName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  // Fetch user profile details
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await axiosInstance.get("/profile/profile");
        setFullName(res.data.user.fullName);
        setPreview(res.data.user.imgURL || "");
      } catch (err) {
        console.error("Profile load failed:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  // Handle profile image upload preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };


  

  // Save changes button handler
  const saveChanges = async () => {

    if (saving) return;

    setSaving(true);
    try {
      // Update name
      await axiosInstance.put("/profile/update-name", { fullName });

      // Update password (if typed)
      if (password.trim() !== "") {
        await axiosInstance.put("/profile/update-password", { password });
      }

      // Update profile picture (if selected)
      if (profilePic) {
        const formData = new FormData();
        formData.append("profilePic", profilePic);
        await axiosInstance.post("/profile/update-picture", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error updating profile!");
    } finally {
      setPassword("");
      setProfilePic(null);
      setSaving(false);
    }
  };

  if (loading)
    return <div className="text-white text-center mt-20 text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="settingsGrad" x1="0" x2="1">
              <stop offset="0%" stopColor="#fff6e6" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#fff0f0" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#settingsGrad)" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-3xl mx-auto p-4 sm:p-6 md:p-10">

        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Settings</h1>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/10 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl shadow space-y-8"
        >

          {/* Profile Picture */}
          <div className="text-center">
            <img
              src={preview}
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto object-cover border-2 border-white/40 shadow"
            />
            <input
              type="file"
              id="profilePicInput"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />

            <button
              onClick={() => document.getElementById("profilePicInput").click()}
              className="mt-3 mb-0 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg shadow transition"
            >
              Edit
            </button>
          </div>

          {/* Change Name */}
          <div>
            <label className="block text-white/70 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-white/10 text-white"
            />
          </div>

          {/* Change Password */}
          <div>
            <label className="block text-white/70 mb-1">New Password</label>
            <input
              type="password"
              placeholder="Leave empty to keep existing password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-white/10 text-white"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={saveChanges}
            disabled={saving}
            className={`w-full py-3 rounded-lg font-bold shadow transition ${saving ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
              }`}
            style={{ backgroundColor: PRIMARY_YELLOW, color: "#111" }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <div className="mt-6 text-center">
            <Link
              to="/dashboard"
              className="text-white/70 hover:underline transition"
            >
              ← Back to Dashboard
            </Link>
          </div>



        </motion.div>

      </div>

      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
    </div>
  );
}
