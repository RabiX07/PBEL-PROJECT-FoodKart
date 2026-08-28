import express from "express";
import { createPaymentOrder, verifyPayment } from "../controllers/paymentController.js";
import { isLogin } from "../middleware/Auth.js";

const router = express.Router();

router.post("/create", isLogin, createPaymentOrder);
router.post("/verify", isLogin, verifyPayment);

export default router;
