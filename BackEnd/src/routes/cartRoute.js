import express from "express";
import { addToCart, getCart, updateCart, removeFromCart, } from "../controllers/cartController.js";
import { isLogin } from "../middleware/Auth.js";

const router = express.Router();

router.post("/add", isLogin, addToCart);
router.get("/get", isLogin, getCart);
router.post("/update", isLogin, updateCart);
router.post("/remove", isLogin, removeFromCart);

export default router;
