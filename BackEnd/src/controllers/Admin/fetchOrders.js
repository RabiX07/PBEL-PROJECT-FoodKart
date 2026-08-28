import Orders from "../../model/Orders.js";
import { getIO } from "../../socket.js";
import Notification from "../../model/Notification.js";


// Get all active paid orders in FCFS order
export const fetchAllOrders = async (req, res) => {
    try {
        const orders = await Orders.find({
            status: "Paid",
            orderState: "Processing"
        })
            .populate("items.productId")
            .sort({ orderDate: 1 }); // Oldest first = FCFS

        res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        console.error("Fetch All Orders Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// Mark an order as ready
export const markOrderReady = async (req, res) => {
    try {
        const { orderId } = req.params;

        // 1. Find and update the order
        const order = await Orders.findOneAndUpdate(
            {
                _id: orderId,
                status: "Paid",
                orderState: "Processing"
            },
            {
                $set: {
                    orderState: "Ready to collect"
                }
            },
            {
                new: true
            }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found or already processed"
            });
        }


        // 2. Create a persistent notification
        const notification = await Notification.create({
            userId: order.userId,
            type: "order",
            title: "Order Ready",
            message: "Your order is ready to collect!",
            orderId: order._id,
            isRead: false
        });


        // 3. Send real-time notification
        const io = getIO();

        io.to(`user:${order.userId}`).emit(
            "order-ready",
            {
                notificationId: notification._id,
                orderId: order._id,
                title: notification.title,
                message: notification.message,
                orderState: order.orderState,
                createdAt: notification.createdAt
            }
        );


        // 4. Send response to staff
        return res.status(200).json({
            success: true,
            message: "Order marked as ready",
            order
        });

    } catch (error) {
        console.error(
            "Mark Order Ready Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};