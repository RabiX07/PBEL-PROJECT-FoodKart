import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { logout } from "../api/user/logout";
import { checkAuth } from "../api/user/checkAuth";
import axiosInstance from "../api/axiosInstance";
import { addToCart } from "../api/addToCart";
import { useNotifications } from "../context/NotificationContext.jsx";

export default function Dashboard() {
  const PRIMARY_YELLOW = "#f6b318";

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [profile, setProfile] = useState(null);
  const [cartLoading, setCartLoading] = useState(true);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { unreadCount } = useNotifications();

  // Normalize backend cart → productId always string
  const normalizeCart = (cartArray) =>
    (cartArray || []).map((item) => ({
      ...item,
      productId:
        typeof item.productId === "string"
          ? item.productId
          : item.productId?._id || String(item.productId),
    }));

  // Verify login
  useEffect(() => {
    async function verify() {
      const res = await checkAuth();
      if (!res.authenticated) {
        window.location.href = "/login";
      }
      setProfile(res.user?.imgURL);
    }
    verify();
  }, []);

  // Load cart first
  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await axiosInstance.get("/cart/get");
        setCart(normalizeCart(res.data.cart || []));
      } catch (err) {
        console.error("Cart load failed:", err);
        setCart([]);
      } finally {
        setCartLoading(false);
      }
    }
    fetchCart();
  }, []);

  // Load products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axiosInstance.get("/products/all");
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Failed to load products:", err);
        setProducts([]);
      }
    }
    fetchProducts();
  }, []);

  // Logout
  async function handleLogout() {
    if (logoutLoading) return; // Prevent multiple clicks

    setLogoutLoading(true);

    try {
      const res = await logout();
      if (res.success) {
        window.location.href = "/login";
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLogoutLoading(false);
    }
  }
  // Helpers
  const getCartItem = (productId) => {
    return cart.find((item) => item.productId === productId) || null;
  };

  // Add to cart (dashboard)
  const handleAddToCart = async (productId) => {
    try {
      // your addToCart helper likely expects productId in body
      setLoadingProductId(productId);

      const res = await addToCart(productId);
      if (res.success) {
        setCart(normalizeCart(res.cart));
      } else {
        console.warn("Add to cart failed:", res.message || res);
      }
    } catch (err) {
      console.error("Add to cart error:", err);
    } finally {
      setLoadingProductId(null); // ⭐ remove loading after API finishes
    }
  };

  // Remove from cart (dashboard)
  const handleRemoveFromCart = async (productId) => {
    try {
      const res = await axiosInstance.post("/cart/remove", { productId });
      if (res.data) {
        // support both res and res.data shapes
        const data = res.data || res;
        if (data.success) {
          setCart(normalizeCart(data.cart));
        } else {
          console.warn("Remove from cart failed:", data.message || data);
        }
      } else if (res.success) {
        setCart(normalizeCart(res.cart));
      }
    } catch (err) {
      console.error("Remove from cart error:", err);
    }
  };

  return (
    <div className="dashboard-shell min-h-dvh md:h-dvh w-full relative bg-gray-900 text-gray-900 overflow-x-hidden">
      {/* Background pattern */}
      {/* <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="dashGrad" x1="0" x2="1">
              <stop offset="0%" stopColor="#fff6e6" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#fff0f0" stopOpacity="0.06" />
            </linearGradient>
          </defs>

          <rect width="100" height="100" fill="url(#dashGrad)" />
          <g fill="rgba(255,255,255,0.03)" transform="scale(1.35)">
            <path d="M10 70c2-1 6-3 9-1s6 5 8 4 4-4 6-5 6 0 8 1 6 1 7-1" />
            <circle cx="85" cy="25" r="6" />
          </g>
        </svg>
      </div> */}

      {/* Main layout */}
      <div className="relative z-10 flex">
        {/* Sidebar */}
        <aside className="dashboard-sidebar w-64 h-screen bg-white/5 backdrop-blur-xl border-r border-white/10 p-6 hidden md:flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-lg bg-white/90 flex items-center justify-center text-2xl font-extrabold text-indigo-600">
              FK
            </div>
            <div className="text-white font-bold text-lg">FoodKart</div>
          </div>

          <nav className="space-y-4 text-white/80">
            <Link to="/dashboard" className="block hover:text-white">
              🏠 Home
            </Link>
            <Link to="/orders" className="block hover:text-white">
              📦 Orders
            </Link>
            <Link to="/cart" className="block hover:text-white">
              🛒 Cart
            </Link>
            <Link to="/settings" className="block hover:text-white">
              ⚙️ Settings
            </Link>
          </nav>

          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className={`mt-10 w-full py-2 rounded-lg font-semibold shadow transition 
            ${logoutLoading ? "bg-red-500/60 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"} text-white`}
          >
            {logoutLoading ? "Logging out..." : "Logout"}
          </button>

          <div className="mt-auto text-white/50 text-sm">
            © {new Date().getFullYear()} FoodKart
          </div>
        </aside>

        {/* Main content */}
        <main className="dashboard-main flex-1 min-w-0 min-h-dvh md:max-h-screen p-4 sm:p-6 md:p-8 lg:p-10">
          {/* Top bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-10">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-sm sm:text-base text-white/60 max-w-xl">
                Welcome back! Track your orders, explore foods, and enjoy
                seamless shopping.
              </p>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="landscape-mobile-toggle md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition text-white"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                <span className="text-xl leading-none">☰</span>
              </button>
              {/* Notification Bell */}
              <Link
                to="/notifications"
                className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 transition"
                aria-label="Notifications"
              >
                <span className="text-xl">🔔</span>

                {unreadCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center text-xs font-bold text-black"
                    style={{
                      backgroundColor: PRIMARY_YELLOW,
                    }}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className={`px-4 py-2 rounded-lg shadow transition text-white
      ${
        logoutLoading
          ? "bg-red-500/60 cursor-not-allowed"
          : "bg-red-500 hover:bg-red-600"
      }`}
              >
                {logoutLoading ? "Logging out..." : "Logout"}
              </button>

              {/* Profile */}
              <img
                src={profile}
                alt="profile"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/50"
              />
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="landscape-mobile-navigation md:hidden grid grid-cols-2 gap-2 mb-6 rounded-xl border border-white/10 bg-white/10 p-3 text-sm text-white/80 backdrop-blur-xl">
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="rounded-lg bg-white/10 px-3 py-2.5 hover:bg-white/20">🏠 Home</Link>
              <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="rounded-lg bg-white/10 px-3 py-2.5 hover:bg-white/20">📦 Orders</Link>
              <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="rounded-lg bg-white/10 px-3 py-2.5 hover:bg-white/20">🛒 Cart</Link>
              <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="rounded-lg bg-white/10 px-3 py-2.5 hover:bg-white/20">⚙️ Settings</Link>
            </nav>
          )}

          {/* Stats */}
          {/* <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl text-white shadow">
              <div className="text-white/60 text-sm">Total Orders</div>
              <div className="text-3xl font-bold mt-1">24</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl text-white shadow">
              <div className="text-white/60 text-sm">Pending</div>
              <div className="text-3xl font-bold mt-1">3</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl text-white shadow">
              <div className="text-white/60 text-sm">Delivered</div>
              <div className="text-3xl font-bold mt-1">19</div>
            </div>

            <Link to="/cart" className="block hover:text-white">
              <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl text-white shadow">
                <div className="text-white/60 text-sm">Cart</div>
                <div className="text-3xl font-bold mt-1">3</div>
              </div>
            </Link>
          </motion.div> */}

          {/* Popular items */}
          <h2 className="text-xl sm:text-2xl font-semibold text-white mt-6 md:mt-12 mb-4">MENU</h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="dashboard-menu-grid grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 pb-5 md:px-5 md:max-h-[82%] md:overflow-y-auto"
          >
            {cartLoading ? (
              <div className="text-white/60">Loading cart...</div>
            ) : products.length === 0 ? (
              <div className="text-white/60">No products available.</div>
            ) : (
              products.map((p) => {
                const cartItem = getCartItem(p._id);

                return (
                  <div
                    key={p._id}
                    className="bg-white/10 backdrop-blur-xl rounded-xl overflow-hidden shadow hover:scale-[1.02] transition-transform"
                  >
                    <div className="w-full h-28 sm:h-36 md:h-40 lg:h-48 xl:h-56 overflow-hidden rounded-t-xl bg-transparent">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-3 sm:p-4 text-white">
                      <div className="font-semibold text-base sm:text-lg break-words">{p.name}</div>
                      <p className="text-white/60 text-sm mt-1 break-words">
                        {p.description.length > 40
                          ? p.description.slice(0, 40) + "..."
                          : p.description}
                      </p>

                      <div className="mt-2 flex items-center justify-between gap-2 text-sm sm:text-base text-white">
                        <span className="font-bold break-words">₹{p.price}</span>
                        <span className="text-white/70 text-right break-words">Stock: {p.stock}</span>
                      </div>

                      {/* Add / Remove */}
                      {cartItem ? (
                        <button
                          onClick={() => handleRemoveFromCart(p._id)}
                          className="mt-3 sm:mt-4 w-full py-2 rounded-lg font-semibold shadow bg-red-500 hover:bg-red-600 transition"
                        >
                          Remove from Cart
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(p._id)}
                          disabled={loadingProductId === p._id}
                          className={`mt-3 sm:mt-4 w-full py-2 rounded-lg font-semibold shadow transition
                        ${loadingProductId === p._id ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"}`}
                          style={{
                            backgroundColor: PRIMARY_YELLOW,
                            color: "#111",
                          }}
                        >
                          {loadingProductId === p._id
                            ? "Adding..."
                            : "Add to Cart"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
