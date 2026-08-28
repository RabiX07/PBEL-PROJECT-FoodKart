import express from "express";

import {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead
} from "../../controllers/Notification/notificationController.js";

import { isLogin } from "../../middleware/Auth.js";

const router = express.Router();


// Get logged-in user's notifications
router.get(
    "/",
    isLogin,
    getNotifications
);


// Mark one notification as read
router.patch(
    "/:notificationId/read",
    isLogin,
    markNotificationRead
);


// Mark all notifications as read
router.patch(
    "/read-all",
    isLogin,
    markAllNotificationsRead
);


export default router;