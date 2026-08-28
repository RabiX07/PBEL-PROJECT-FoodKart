import Orders from "../../model/Orders.js";

export const verifyOCDPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const order = await Orders.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    if (order.paymentMethod !== "ODC") {
      return res.status(400).json({ success: false, message: "Invalid payment method for this verification" });
    }   
    // Update order status to 'Paid' and orderState to 'Ready to collect'
    order.status = "Paid";
    order.orderState = "Processing";
    await order.save();

    res.status(200).json({ success: true, message: "Payment verified and order updated successfully" });
  } catch (error) {
    console.error("Verify OCD Payment Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};