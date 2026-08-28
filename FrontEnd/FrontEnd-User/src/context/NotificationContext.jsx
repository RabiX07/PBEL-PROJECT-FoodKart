import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { io } from "socket.io-client";
import toast from "react-hot-toast";

import axiosInstance from "../api/axiosInstance";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        let socket;

        const initializeNotifications = async () => {
            try {
                // -----------------------------------------
                // 1. Get existing notifications
                // -----------------------------------------

                const res = await axiosInstance.get(
                    "/notifications"
                );

                if (res.data.success) {
                    setNotifications(
                        res.data.notifications || []
                    );

                    setUnreadCount(
                        res.data.unreadCount || 0
                    );
                }


                // -----------------------------------------
                // 2. Get logged-in user
                // -----------------------------------------

                const profileRes =
                    await axiosInstance.get(
                        "/profile/profile"
                    );

                if (
                    !profileRes.data.success ||
                    !profileRes.data.user?._id
                ) {
                    return;
                }

                const userId =
                    profileRes.data.user._id;


                // -----------------------------------------
                // 3. Connect Socket.IO
                // -----------------------------------------

                socket = io(
                    import.meta.env.VITE_API_URL,
                    {
                        withCredentials: true,
                    }
                );


                socket.on("connect", () => {
                    console.log(
                        "Notification socket connected:",
                        socket.id
                    );

                    // Join customer's private room
                    socket.emit(
                        "join-user",
                        userId
                    );
                });


                // -----------------------------------------
                // 4. Listen for new notifications
                // -----------------------------------------

                socket.on(
                    "order-ready",
                    (data) => {
                        console.log(
                            "New notification:",
                            data
                        );

                        const newNotification = {
                            _id:
                                data.notificationId,
                            orderId:
                                data.orderId,
                            type: "order",
                            title:
                                data.title ||
                                "Order Ready",
                            message:
                                data.message ||
                                "Your order is ready to collect!",
                            isRead: false,
                            createdAt:
                                data.createdAt ||
                                new Date().toISOString(),
                        };


                        // Add notification to the top
                        setNotifications(
                            (prev) => [
                                newNotification,
                                ...prev,
                            ]
                        );


                        // Increase unread count
                        setUnreadCount(
                            (prev) => prev + 1
                        );


                        // Small immediate notification
                        toast.success(
                            data.message ||
                                "Your order is ready to collect!",
                            {
                                duration: 4000,
                            }
                        );
                    }
                );


                socket.on(
                    "connect_error",
                    (error) => {
                        console.error(
                            "Notification socket error:",
                            error
                        );
                    }
                );

            } catch (error) {
                console.error(
                    "Notification initialization failed:",
                    error
                );
            }
        };


        initializeNotifications();


        // -----------------------------------------
        // Cleanup
        // -----------------------------------------

        return () => {
            if (socket) {
                socket.off("connect");
                socket.off("order-ready");
                socket.off("connect_error");
                socket.disconnect();
            }
        };

    }, []);


    // ---------------------------------------------
    // Mark one notification as read
    // ---------------------------------------------

    const markAsRead = async (
        notificationId
    ) => {
        try {
            const res =
                await axiosInstance.patch(
                    `/notifications/${notificationId}/read`
                );

            if (res.data.success) {
                setNotifications((prev) =>
                    prev.map((notification) =>
                        notification._id ===
                        notificationId
                            ? {
                                  ...notification,
                                  isRead: true,
                              }
                            : notification
                    )
                );

                setUnreadCount((prev) =>
                    Math.max(0, prev - 1)
                );
            }

        } catch (error) {
            console.error(
                "Mark notification read failed:",
                error
            );
        }
    };


    // ---------------------------------------------
    // Mark all notifications as read
    // ---------------------------------------------

    const markAllAsRead = async () => {
        try {
            const res =
                await axiosInstance.patch(
                    "/notifications/read-all"
                );

            if (res.data.success) {
                setNotifications((prev) =>
                    prev.map((notification) => ({
                        ...notification,
                        isRead: true,
                    }))
                );

                setUnreadCount(0);
            }

        } catch (error) {
            console.error(
                "Mark all notifications read failed:",
                error
            );
        }
    };


    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                markAsRead,
                markAllAsRead,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};


// ---------------------------------------------
// Custom hook
// ---------------------------------------------

export const useNotifications = () => {
    const context =
        useContext(NotificationContext);

    if (!context) {
        throw new Error(
            "useNotifications must be used inside NotificationProvider"
        );
    }

    return context;
};