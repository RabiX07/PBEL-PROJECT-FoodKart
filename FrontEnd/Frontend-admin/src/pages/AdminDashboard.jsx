import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import axiosInstance from "../api/axiosInstance";

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAdminProfile = async () => {
      try {
        const res = await axiosInstance.get(
          "/admin/auth/getprofile"
        );

        if (res.data.success) {
          setAdmin(res.data.admin);
        }
      } catch (error) {
        console.error("Admin authentication failed:", error);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    getAdminProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet context={{ admin }} />;
}