import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },

  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],

  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },

  paymentMethod: {
    type: String,
    enum: ["Online", "ODC"],
    required: true,
  },

  // ⭐ Updated statuses to match all flows
  status: {
    type: String,
    enum: [
      "Pending Payment",  // For ODC before delivery
      "Paid",            // For Online 
    ],
  },

  orderState: {
    type: String,
    enum: [
      "Processing",    // After payment for Online
      "Ready to collect", // For ODC after payment
      "completed",
    ],
  },
  

  orderDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Orders", orderSchema);
