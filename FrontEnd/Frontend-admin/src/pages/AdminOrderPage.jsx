import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance.js";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const PRIMARY_YELLOW = "#f6b318";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // orderId currently updating

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/admin/orders/fetch-all");

      if (res.data.success) setOrders(res.data.orders);
    } catch (err) {
      console.error("Order Fetch Error:", err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // ⭐ Mark order as Ready to Collect
  const markReady = async (orderId) => {
    try {
      setActionLoading(orderId);
      const res = await axiosInstance.put(`/admin/orders/mark-ready/${orderId}`);

      if (res.data.success) {
        toast.success("Marked as Ready for Collection");
        fetchOrders();
      }
    } catch (err) {
      toast.error("Failed to update order");
    } finally {
      setActionLoading(null);
    }
  };

  // ⭐ Mark order as Completed
  const markCompleted = async (orderId) => {
    try {
      setActionLoading(orderId);
      const res = await axiosInstance.put(`/admin/orders/complete/${orderId}`);

      if (res.data.success) {
        toast.success("Order Completed!");
        fetchOrders();
      }
    } catch (err) {
      toast.error("Failed to complete order");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="text-white text-center mt-20 text-2xl">
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-10 py-12 text-white">

      <h1 className="text-4xl font-bold mb-6">Admin – Orders</h1>
      <p className="text-white/60 mb-10">Manage active canteen orders</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {orders.length === 0 ? (
          <div className="text-white/60">No active orders.</div>
        ) : (
          orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
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
                  {order.orderState}
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3 mt-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img
                      src={item.productId?.imageUrl}
                      alt={item.productId?.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <span className="text-white/80">
                      {item.productId?.name} × {item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 font-bold text-lg">
                Total: ₹{order.totalAmount}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-4">
                {order.orderState === "Processing" && (
                  <button
                    onClick={() => markReady(order._id)}
                    disabled={actionLoading === order._id}
                    className="flex-1 py-2 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading === order._id
                      ? "Updating..."
                      : "Mark as Ready"}
                  </button>
                )}

                {order.orderState === "Ready" && (
                  <button
                    onClick={() => markCompleted(order._id)}
                    disabled={actionLoading === order._id}
                    className="flex-1 py-2 rounded-lg font-semibold bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading === order._id
                      ? "Completing..."
                      : "Complete Order"}
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
