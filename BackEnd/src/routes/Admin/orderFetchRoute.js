import express from "express";

import {
    fetchAllOrders,
    markOrderReady
} from "../../controllers/Admin/fetchOrders.js";

import { isAdminLogin } from "../../middleware/AdminAuth.js";

const router = express.Router();


// Get all active Paid + Processing orders
// Returned in FCFS order
router.get(
    "/fetch-all",
    isAdminLogin,
    fetchAllOrders
);


// Mark the current order as Ready to collect
router.patch(
    "/:orderId/ready",
    isAdminLogin,
    markOrderReady
);


export default router;