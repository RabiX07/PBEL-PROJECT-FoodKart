import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export default function StaffDashboard() {
  const PRIMARY_YELLOW = "#f6b318";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchOrders();

    const socket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
    });

    // Join staff room
    socket.emit("join-staff");

    // New paid order received
    socket.on("new-order", (newOrder) => {
      console.log("New order received:", newOrder);

      setOrders((prevOrders) => {
        // Prevent duplicate orders
        const alreadyExists = prevOrders.some(
          (order) => order._id === newOrder._id,
        );

        if (alreadyExists) {
          return prevOrders;
        }

        // Add new order and maintain FCFS order
        const updatedOrders = [...prevOrders, newOrder];

        return updatedOrders.sort(
          (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
        );
      });

      toast.success("New order received!", {
        style: {
          background: "#f6b318",
          color: "#111",
        },
      });
    });

    return () => {
      socket.off("new-order");
      socket.disconnect();
    };
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/admin/orders/fetch-all");

      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);

      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const markReady = async (orderId) => {
    if (processing) return;

    try {
      setProcessing(true);

      const res = await axiosInstance.patch(`/admin/orders/${orderId}/ready`);

      if (res.data.success) {
        toast.success("Order marked as ready!", {
          style: {
            background: PRIMARY_YELLOW,
            color: "#111",
          },
        });

        // Remove current order.
        // Next FCFS order becomes visible.
        setOrders((prev) => prev.filter((order) => order._id !== orderId));
      }
    } catch (error) {
      console.error("Mark ready error:", error);

      toast.error(
        error.response?.data?.message || "Failed to mark order as ready.",
      );
    } finally {
      setProcessing(false);
    }
  };

  const currentOrder = orders.length > 0 ? orders[0] : null;

  return (
    <div className="min-h-screen bg-gray-900 relative text-white">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="staffGrad" x1="0" x2="1">
              <stop offset="0%" stopColor="#fff6e6" stopOpacity="0.10" />

              <stop offset="100%" stopColor="#fff0f0" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <rect width="100" height="100" fill="url(#staffGrad)" />

          <g fill="rgba(255,255,255,0.03)" transform="scale(1.2)">
            <path d="M10 70c2-1 6-3 9-1s6 5 8 4 4-4 6-5 6 0 8 1 6 1 7-1" />
            <circle cx="85" cy="25" r="6" />
          </g>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto p-6 md:p-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-10"
        >
          <div>
            <h1 className="text-3xl font-bold">Staff Dashboard</h1>

            <p className="text-white/60 mt-2">
              Manage active orders in first-come, first-served order.
            </p>
          </div>

          <div
            className="px-4 py-2 rounded-lg font-semibold text-black shadow"
            style={{ backgroundColor: PRIMARY_YELLOW }}
          >
            Queue: {orders.length}
          </div>
        </motion.div>

        {/* Queue information */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 mb-6 shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm">Order Queue</p>

              <p className="text-white font-semibold mt-1">
                {orders.length === 0
                  ? "No orders waiting"
                  : `${orders.length} order${
                      orders.length === 1 ? "" : "s"
                    } waiting`}
              </p>
            </div>

            <div className="text-right">
              <p className="text-white/50 text-sm">Processing</p>

              <p className="font-semibold mt-1">{currentOrder ? "1" : "0"}</p>
            </div>
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-10 text-center shadow"
          >
            <p className="text-white/60">Loading orders...</p>
          </motion.div>
        )}

        {/* No orders */}
        {!loading && !currentOrder && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 text-center shadow"
          >
            <div className="text-5xl mb-5">✓</div>

            <h2 className="text-2xl font-semibold">All caught up</h2>

            <p className="text-white/60 mt-2">
              There are no active paid orders right now.
            </p>
          </motion.div>
        )}

        {/* Current Order */}
        {!loading && currentOrder && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl shadow overflow-hidden"
          >
            {/* Order Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-white/50 text-sm">Now Preparing</p>

                  <h2 className="text-2xl font-bold mt-1">
                    Order #{currentOrder._id.slice(-6)}
                  </h2>

                  <p className="text-white/50 text-sm mt-2">
                    {new Date(currentOrder.orderDate).toLocaleString()}
                  </p>
                </div>

                <div
                  className="self-start px-4 py-2 rounded-full font-semibold text-black"
                  style={{
                    backgroundColor: PRIMARY_YELLOW,
                  }}
                >
                  Paid
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-5">Order Items</h3>

              <div className="space-y-3">
                {currentOrder.items?.map((item, index) => (
                  <motion.div
                    key={item._id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                    }}
                    className="flex items-center gap-4 bg-white/5 rounded-xl p-4"
                  >
                    {/* Product Image */}
                    {item.productId?.imageUrl ? (
                      <img
                        src={item.productId.imageUrl}
                        alt={item.productId.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center">
                        🍛
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">
                        {item.productId?.name || "Product"}
                      </h4>

                      <p className="text-white/50 text-sm mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    {/* Price */}
                    {item.price !== undefined && (
                      <div className="font-semibold">
                        ₹{item.price * item.quantity}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mt-6 pt-5 border-t border-white/10">
                <span className="text-white/60">Total Amount</span>

                <span className="text-2xl font-bold">
                  ₹{currentOrder.totalAmount}
                </span>
              </div>
            </div>

            {/* Action */}
            <div className="p-6 border-t border-white/10">
              <button
                onClick={() => markReady(currentOrder._id)}
                disabled={processing}
                className={`w-full py-3 rounded-lg font-bold shadow transition ${
                  processing
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:opacity-90"
                }`}
                style={{
                  backgroundColor: PRIMARY_YELLOW,
                  color: "#111",
                }}
              >
                {processing ? "Updating Order..." : "Mark Order Ready"}
              </button>
            </div>
          </motion.div>
        )}

        {/* Back */}
        <div className="mt-8 text-center">
          <Link
            to="/admin/dashboard"
            className="text-white/70 hover:underline transition"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
    </div>
  );
}
