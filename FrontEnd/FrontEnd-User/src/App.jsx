import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import DashBoard from "./pages/DashBoard";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
