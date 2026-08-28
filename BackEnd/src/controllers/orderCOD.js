import User from "../model/user.js";
import Orders from "../model/Orders.js";
import Products from "../model/Products.js";

// ⭐ Create ODC Order (Cash on Delivery)
export const createODCOrder = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).populate("cart.productId");

    if (!user || user.cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // 1️⃣ VALIDATE STOCK BEFORE PROCESSING ORDER
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

    // 2️⃣ PREPARE ITEMS
    const items = user.cart.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
    }));

    // 3️⃣ CALCULATE TOTAL
    const totalAmount = user.cart.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );

    // 4️⃣ UPDATE STOCKS
    for (let item of user.cart) {
      const product = item.productId;
      product.stock -= item.quantity;
      await product.save();
    }

    // 5️⃣ CREATE ORDER
    const newOrder = await Orders.create({
      userId,
      items,
      totalAmount,
      paymentMethod: "ODC",
      status: "Pending Payment",
      orderState: "Processing",
    });

    // 6️⃣ CLEAR CART
    user.cart = [];
    await user.save();

    return res.status(200).json({
      success: true,
      message: "ODC Order created successfully",
      order: newOrder,
    });

  } catch (error) {
    console.error("ODC Order Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ⭐ Fetch user orders

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await Orders.find({ userId })
      .populate("items.productId")   // get product name, image, price
      .sort({ orderDate: -1 });      // newest first

    return res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};