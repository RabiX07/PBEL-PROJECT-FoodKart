import React from "react";
import { Navigate, useOutletContext } from "react-router";

export default function DashboardRedirect() {
  const { admin } = useOutletContext();

  if (admin.role === "manager" || admin.role === "superadmin") {
    return (
      <Navigate
        to="/admin/dashboard/manager"
        replace
      />
    );
  }

  if (admin.role === "staff") {
    return (
      <Navigate
        to="/admin/dashboard/staff"
        replace
      />
    );
  }

  return <div>Unauthorized role</div>;
}