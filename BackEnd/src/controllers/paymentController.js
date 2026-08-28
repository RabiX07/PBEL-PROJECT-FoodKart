import { razorpayInstance } from "../config/razorpay.js";

import User from "../model/user.js";
import Orders from "../model/Orders.js";
import crypto from "crypto";
import { getIO } from "../socket.js";

// import dotenv from "dotenv";
// dotenv.config();

// 1️⃣ CREATE RAZORPAY ORDER
export const createPaymentOrder = async (req, res) => {
  try {
    const userId = req.user.userId; // 🔥 secure

    const user = await User.findById(userId).populate("cart.productId");

    if (!user || user.cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const totalAmount = user.cart.reduce((sum, item) => {
      return sum + item.productId.price * item.quantity;
    }, 0);

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `rcpt_${userId.slice(-6)}_${Date.now()}`,
      notes: { mock_payment: "upi" },
    };

    const order = await razorpayInstance.orders.create(options);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: totalAmount,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Payment order failed" });
  }
};

// 2️⃣ VERIFY PAYMENT + CREATE ORDER IN DB
export const verifyPayment = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // 1️⃣ Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // 2️⃣ Fetch user + cart data
    const user = await User.findById(userId).populate("cart.productId");

    if (!user || user.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // 3️⃣ Check stock before creating order
    for (let item of user.cart) {
      if (!item.productId) {
        return res.status(400).json({
          success: false,
          message: "A product in cart no longer exists",
        });
      }

      if (item.productId.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.productId.name}. Available: ${item.productId.stock}`,
        });
      }
    }

    // 4️⃣ Prepare order items
    const items = user.cart.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
    }));

    const totalAmount = user.cart.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0,
    );

    // 5️⃣ Deduct stock
    for (let item of user.cart) {
      const product = item.productId;
      product.stock -= item.quantity;
      await product.save();
    }

    // 6️⃣ Create paid order
    const newOrder = await Orders.create({
      userId,
      items,
      totalAmount,
      paymentMethod: "Online",
      status: "Paid",
      orderState: "Processing",
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    // Populate product information before sending to Staff Dashboard
    const populatedOrder = await Orders.findById(newOrder._id).populate(
      "items.productId",
    );

    // Notify all connected staff
    const io = getIO();

    io.to("staff").emit("new-order", populatedOrder);
    
    // 7️⃣ Clear user cart
    user.cart = [];
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error,
    });
  }
};
