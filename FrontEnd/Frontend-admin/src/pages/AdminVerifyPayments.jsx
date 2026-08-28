import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance.js";
import toast from "react-hot-toast";
import { Link } from "react-router";
import { motion } from "framer-motion";

export default function AdminVerifyPayments() {
  const PRIMARY_YELLOW = "#f6b318";

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);

  // Fetch all unpaid orders
  const fetchUnpaidOrders = async () => {
    try {
      const res = await axiosInstance.get("/admin/orders/unpaid");

      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load unpaid orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnpaidOrders();
  }, []);

  // Verify payment
  const verifyPayment = async (orderId) => {
    try {
      setVerifyingId(orderId);

      const res = await axiosInstance.post(`/admin/orders/verify/${orderId}`);

      if (res.data.success) {
        toast.success("Payment verified!");
        fetchUnpaidOrders(); // Refresh list
      }
    } catch (err) {
      console.error(err);
      toast.error("Verification failed");
    } finally {
      setVerifyingId(null);
    }
  };

  // Filter by order ID
  const filteredOrders = orders.filter((order) =>
    order._id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Verify Payments</h1>

        <a
          href="/admin/dashboard"
          className="text-white/70 hover:text-white underline text-sm"
        >
          ← Back to Dashboard
        </a>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Order ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-6 rounded-lg bg-gray-800 border border-white/10 text-white"
      />

      {/* Loading State */}
      {loading ? (
        <p className="text-white/60 text-lg">Loading unpaid orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-white/60 text-lg">No unpaid orders found.</p>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">
                    Order #{order._id.slice(-6)}
                  </h2>
                  <p className="text-white/60 text-sm">
                    {new Date(order.orderDate).toLocaleString()}
                  </p>
                  <p className="mt-1 text-yellow-300 text-sm">
                    Payment Method: {order.paymentMethod}
                  </p>
                </div>

                {/* Verify Button */}
                <button
                  onClick={() => verifyPayment(order._id)}
                  disabled={verifyingId === order._id}
                  className={`px-5 py-2 rounded-lg font-bold shadow transition ${
                    verifyingId === order._id
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: PRIMARY_YELLOW, color: "#111" }}
                >
                  {verifyingId === order._id ? "Verifying..." : "Verify Payment"}
                </button>
              </div>

              {/* Items */}
              <div className="mt-4 text-white/80 space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img
                      src={item.productId?.imageUrl}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <span>
                      {item.productId?.name} × {item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-3 font-bold text-lg">
                Total: ₹{order.totalAmount}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
