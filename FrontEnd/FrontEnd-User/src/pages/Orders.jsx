import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

export default function Orders() {
  const PRIMARY_YELLOW = "#f6b318";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active"); // ⭐ TAB STATE

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await axiosInstance.get("/orders/my-orders");

        if (res.data.success) {
          setOrders(res.data.orders);
        }

      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

 useEffect(() => {
    let socket;

    async function connectUserSocket() {
        try {
            // Get the currently authenticated user
            const res = await axiosInstance.get("/profile/profile");

            if (!res.data.success || !res.data.user?._id) {
                console.error("Could not get authenticated user");
                return;
            }

            const userId = res.data.user._id;

            // Connect Socket.IO
            socket = io(import.meta.env.VITE_API_URL, {
                withCredentials: true,
            });

            socket.on("connect", () => {
                console.log("User socket connected:", socket.id);

                // Join this customer's private room
                socket.emit("join-user", userId);
            });

            // Listen for this customer's order becoming ready
            socket.on("order-ready", (data) => {
                console.log("Order ready notification:", data);

                toast.success(
                    data.message ||
                        "Your order is ready to collect!",
                    {
                        duration: 5000,
                        style: {
                            background: "#f6b318",
                            color: "#111",
                            fontWeight: "600",
                        },
                    }
                );

                // Update order state immediately
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === data.orderId
                            ? {
                                  ...order,
                                  orderState:
                                      "Ready to collect",
                              }
                            : order
                    )
                );
            });

            socket.on("connect_error", (error) => {
                console.error(
                    "User Socket.IO connection error:",
                    error
                );
            });
        } catch (error) {
            console.error(
                "Failed to initialize user socket:",
                error
            );
        }
    }

    connectUserSocket();

    return () => {
        if (socket) {
            socket.off("connect");
            socket.off("order-ready");
            socket.off("connect_error");
            socket.disconnect();
        }
    };
}, []);

  if (loading) {
    return (
      <div className="text-white text-center mt-20 text-2xl">
        Loading Orders...
      </div>
    );
  }

  const activeOrders = orders.filter(
    (o) => o.status !== "Delivered" && o.status !== "Cancelled"
  );

  const completedOrders = orders.filter((o) => o.status === "Delivered");

  return (
    <div className="min-h-screen bg-gray-900 relative text-white">

      <div className="relative z-10 max-w-5xl mx-auto p-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Your Orders</h1>
          
        </div>

        {/* ⭐ TABS */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-5 py-2 rounded-lg font-semibold transition ${
              activeTab === "active"
                ? "bg-yellow-500 text-black"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            Active Orders
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`px-5 py-2 rounded-lg font-semibold transition ${
              activeTab === "completed"
                ? "bg-yellow-500 text-black"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            Completed Orders
          </button>
        </div>

        {/* ⭐ TAB CONTENT */}
        {activeTab === "active" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4 mb-12"
          >
            {activeOrders.length === 0 ? (
              <div className="text-white/60">No active orders.</div>
            ) : (
              activeOrders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Order #{order._id.slice(-6)}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {new Date(order.orderDate).toLocaleString()}
                      </p>
                    </div>

                    <div
                      className="px-4 py-1 rounded-full font-semibold text-black"
                      style={{ backgroundColor: PRIMARY_YELLOW }}
                    >
                      {order.status}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-white/80">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img
                          src={item.productId?.imageUrl}
                          alt={item.productId?.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <span>
                          {item.productId?.name} × {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 font-bold text-lg">
                    Total: ₹{order.totalAmount}
                  </div>
                </motion.div>
              ))
            )}
            <Link to="/dashboard" className="text-white/70 mt-3 hover:underline block text-center mx-auto">
            ← Back to Dashboard
          </Link>
          </motion.div>
        )}

        {activeTab === "completed" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4 mb-6"
          >
            {completedOrders.length === 0 ? (
              <div className="text-white/60">No completed orders yet.</div>
            ) : (
              completedOrders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow border border-green-500/30"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Order #{order._id.slice(-6)}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {new Date(order.orderDate).toLocaleString()}
                      </p>
                    </div>

                    <div className="px-4 py-1 rounded-full font-semibold bg-green-400 text-black">
                      Delivered
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-white/80">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img
                          src={item.productId?.imageUrl}
                          alt={item.productId?.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <span>
                          {item.productId?.name} × {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 font-bold text-lg">
                    Total: ₹{order.totalAmount}
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>

      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
    </div>
  );
}
