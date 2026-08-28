import React from "react";
import { motion } from "framer-motion";
import { useNotifications } from "../context/NotificationContext.jsx";

export default function Notifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-5 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>

            <p className="text-white/60 mt-2">Stay updated with your orders.</p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 rounded-lg font-semibold text-black"
              style={{
                backgroundColor: "#f6b318",
              }}
            >
              Mark all as read
            </button>
          )}
        </motion.div>

        {/* Empty state */}
        {notifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-10 text-center"
          >
            <div className="text-4xl mb-4">🔔</div>

            <h2 className="text-xl font-semibold">No notifications</h2>

            <p className="text-white/50 mt-2">You're all caught up.</p>
          </motion.div>
        )}

        {/* Notifications */}
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification._id}
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.05,
              }}
              onClick={() => {
                if (!notification.isRead) {
                  markAsRead(notification._id);
                }
              }}
              className={`relative bg-white/10 backdrop-blur-xl rounded-2xl p-5 cursor-pointer transition ${
                notification.isRead ? "opacity-70" : "border border-white/20"
              }`}
            >
              {/* Unread indicator */}
              {!notification.isRead && (
                <span
                  className="absolute top-5 right-5 w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: "#f6b318",
                  }}
                />
              )}

              <div className="flex gap-4">
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: "rgba(246,179,24,0.15)",
                  }}
                >
                  🔔
                </div>

                {/* Content */}
                <div className="flex-1 pr-5">
                  <h3 className="font-semibold text-lg">
                    {notification.title}
                  </h3>

                  <p className="text-white/60 mt-1">{notification.message}</p>

                  <p className="text-white/40 text-sm mt-3">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
