import express from "express";
import { isLogin } from "../middleware/Auth.js";
import { createODCOrder, getUserOrders } from "../controllers/orderCOD.js";

const router = express.Router();

// Create ODC order
router.post("/create-odc", isLogin, createODCOrder);

// Fetch logged-in user's orders
router.get("/my-orders", isLogin, getUserOrders);

export default router;
