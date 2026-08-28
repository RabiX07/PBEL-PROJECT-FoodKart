import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import AdminLogin from "./pages/Auth/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ManagerDashboard from "./pages/ManagerDashboard.jsx";
import StaffDashboard from "./pages/StaffDashboard.jsx";
import DashboardRedirect from "./pages/DashboardRedirect.jsx";
import AdminOrders from "./pages/AdminOrderPage.jsx";
import AdminMenu from "./pages/AdminMenu.jsx";
import AdminVerifyPayments from "./pages/AdminVerifyPayments.jsx";
import CreateStaff from "./pages/CreateStaff.jsx";
import { Toaster } from "react-hot-toast";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* ⭐ Toast provider (must be at root) */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#f6b318",
            color: "#111",
            fontWeight: "600",
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* // protected routes to be added later */}
          <Route path="/admin/dashboard" element={<AdminDashboard />}>
            <Route index element={<DashboardRedirect />} />

            <Route path="manager" element={<ManagerDashboard />} />

            <Route path="staff" element={<StaffDashboard />} />
          </Route>
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/menu" element={<AdminMenu />} />
          <Route
            path="/admin/verify-payments"
            element={<AdminVerifyPayments />}
          />

          <Route path="/admin/create-staff" element={<CreateStaff />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
