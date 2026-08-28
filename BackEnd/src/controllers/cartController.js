import User from "../model/user.js";
import Products from "../model/Products.js";
import mongoose from "mongoose";

// Normalize cart output
const cleanCart = (cart) =>
  cart.map((item) => ({
    productId: item.productId.toString(),
    quantity: item.quantity,
  }));

// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity = 1 } = req.body;

    const product = await Products.findById(productId);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    const user = await User.findById(userId);
    const existingItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({
        productId: new mongoose.Types.ObjectId(productId),
        quantity,
      });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      cart: cleanCart(user.cart),
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET CART
export const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    return res.status(200).json({
      success: true,
      cart: cleanCart(user.cart),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE CART
export const updateCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, action } = req.body;

    const user = await User.findById(userId);
    const item = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (!item)
      return res.status(404).json({ success: false, message: "Item not in cart" });

    if (action === "inc") item.quantity++;
    if (action === "dec") {
      item.quantity--;
      if (item.quantity <= 0) {
        user.cart = user.cart.filter(
          (i) => i.productId.toString() !== productId
        );
      }
    }

    await user.save();

    return res.status(200).json({
      success: true,
      cart: cleanCart(user.cart),
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// REMOVE ITEM
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    const user = await User.findById(userId);
    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    await user.save();

    return res.status(200).json({
      success: true,
      cart: cleanCart(user.cart),
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
