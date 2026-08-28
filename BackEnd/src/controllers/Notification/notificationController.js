import Notification from "../../model/Notification.js";


// --------------------------------------------------
// GET USER NOTIFICATIONS
// --------------------------------------------------

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.userId;

        const notifications = await Notification.find({
            userId
        })
            .populate("orderId")
            .sort({ createdAt: -1 });

        const unreadCount = await Notification.countDocuments({
            userId,
            isRead: false
        });

        return res.status(200).json({
            success: true,
            notifications,
            unreadCount
        });

    } catch (error) {
        console.error(
            "Get Notifications Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications"
        });
    }
};


// --------------------------------------------------
// MARK ONE NOTIFICATION AS READ
// --------------------------------------------------

export const markNotificationRead = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { notificationId } = req.params;

        const notification =
            await Notification.findOneAndUpdate(
                {
                    _id: notificationId,
                    userId
                },
                {
                    $set: {
                        isRead: true
                    }
                },
                {
                    new: true
                }
            );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        return res.status(200).json({
            success: true,
            notification
        });

    } catch (error) {
        console.error(
            "Mark Notification Read Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update notification"
        });
    }
};


// --------------------------------------------------
// MARK ALL NOTIFICATIONS AS READ
// --------------------------------------------------

export const markAllNotificationsRead = async (
    req,
    res
) => {
    try {
        const userId = req.user.userId;

        await Notification.updateMany(
            {
                userId,
                isRead: false
            },
            {
                $set: {
                    isRead: true
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });

    } catch (error) {
        console.error(
            "Mark All Notifications Read Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update notifications"
        });
    }
};