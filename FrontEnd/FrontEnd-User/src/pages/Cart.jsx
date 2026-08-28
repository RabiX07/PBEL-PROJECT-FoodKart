import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";


export default function Cart() {
  const PRIMARY_YELLOW = "#f6b318";

  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [mergedCart, setMergedCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("ODC");
  const [orderLoading, setOrderLoading] = useState(false);



  // Normalize backend cart productId
  const normalizeCart = (cartArray) =>
    (cartArray || []).map((item) => ({
      ...item,
      productId:
        typeof item.productId === "string"
          ? item.productId
          : item.productId?._id,
    }));

  // Fetch cart & products
  useEffect(() => {
    async function fetchData() {
      try {
        const cartRes = await axiosInstance.get("/cart/get");
        const productRes = await axiosInstance.get("/products/all");

        setCart(normalizeCart(cartRes.data.cart || []));
        setProducts(productRes.data.products || []);
      } catch (err) {
        console.error("Load failed:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Merge cart + product info
  useEffect(() => {
    const merged = cart
      .map((c) => {
        const product = products.find((p) => p._id === c.productId);
        if (!product) return null;
        return {
          id: product._id,
          name: product.name,
          price: product.price,
          qty: c.quantity,
          img: product.imageUrl,
        };
      })
      .filter(Boolean);

    setMergedCart(merged);
  }, [cart, products]);

  // Update quantity (backend)
  const updateQty = async (productId, action) => {
    try {
      const res = await axiosInstance.post("/cart/update", {
        productId,
        action,
      });

      if (res.data.success) {
        setCart(normalizeCart(res.data.cart));
      }
    } catch (err) {
      console.error("Update qty error:", err);
    }
  };

  // Remove item
  const removeItem = async (productId) => {
    try {
      const res = await axiosInstance.post("/cart/remove", { productId });
      if (res.data.success) {
        setCart(normalizeCart(res.data.cart));
      }
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  const placeODCOrder = async () => {
    if (orderLoading) return; // prevent double click
    setOrderLoading(true);
    try {
      const res = await axiosInstance.post("/orders/create-odc", {
        paymentMethod: "ODC",
      });

      if (res.data.success) {
        toast.success("Order placed successfully!", {
          style: {
            background: "#f6b318",
            color: "#111",
          }
        });
        setTimeout(() => {
          window.location.href = "/orders";
        }, 1500);

      }
    } catch (error) {
      toast.error("Order failed", {
        style: {
          background: "#f6b318",
          color: "#100",
        }
      });
      console.error(error);
    } finally {
      setOrderLoading(false); // reset
    }
  };


  const placeOnlineOrder = async () => {
    if (orderLoading) return; // prevent multiple clicks
    setOrderLoading(true);
    try {
      // 1️⃣ Create Razorpay order request to backend
      const orderRes = await axiosInstance.post("payments/create");

      if (!orderRes.data.success) {
        toast.error("Payment order creation failed!", {
          style: {
            background: "#f6b318",
            color: "#111",
          }
        });
        return;
      }

      const { orderId, amount, key } = orderRes.data;

      // 2️⃣ Razorpay popup options
      const options = {
        key,
        amount: amount * 100,
        currency: "INR",
        name: "FoodKart",
        description: "Order Payment",
        order_id: orderId,

        handler: async function (response) {
          try {
            const verifyRes = await axiosInstance.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              toast.success("Payment Success! Order Created.", {
                style: {
                  background: "#f6b318",
                  color: "#111",
                }
              });
              setTimeout(() => {
                window.location.href = "/orders";
              }, 1500);
            }
          } catch (error) {
            toast.error("Payment Verification Failed!", {
              style: {
                background: "#f6b318",
                color: "#111",
              }
            });
            console.error(error);
          } finally {
            setOrderLoading(false);
          }

        },
        modal: {
          ondismiss: () => {
            setOrderLoading(false);
            toast.error("Payment Cancelled!", {
              style: { background: "#f6b318", color: "#111" },
            });
          },
        },

        theme: {
          color: "#f6b318",
        },


      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        setOrderLoading(false);
        toast.error("Payment Failed!", {
          style: { background: "#f6b318", color: "#111" },
        });
      });
      rzp.open();

    } catch (error) {
      toast.error("Payment failed");
      console.error(error);
      setOrderLoading(false);
    }
  };


  const total = mergedCart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (loading)
    return <div className="text-white text-center mt-20 text-xl">Loading...</div>;

  return (
    <div className="h-screen w-full relative bg-gray-900 text-white">


      {/* Content */}
      <div className="relative z-10 w-[70%] mx-auto py-12 px-10 max-h-screen overflow-scroll">

        <h1 className="text-4xl font-bold mb-4">Your Cart</h1>
        <p className="text-white/60 mb-10">Review items before checkout</p>

        {/* Cart Items */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {mergedCart.length === 0 ? (
            <div className="text-white/60 text-lg">Your cart is empty.</div>
          ) : (
            mergedCart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-6 bg-white/10 backdrop-blur-xl rounded-xl p-5 shadow hover:scale-[1.01] transition-transform"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-white/60 text-sm">₹{item.price}</p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQty(item.id, "dec")}
                    className="px-3 py-1 rounded-lg bg-white/10 text-white text-lg hover:bg-white/20"
                  >
                    −
                  </button>

                  <div className="text-white text-lg font-semibold">
                    {item.qty}
                  </div>

                  <button
                    onClick={() => updateQty(item.id, "inc")}
                    className="px-3 py-1 rounded-lg bg-white/10 text-white text-lg hover:bg-white/20"
                  >
                    +
                  </button>
                </div>

                {/* Item total */}
                <div className="text-white font-semibold text-xl">
                  ₹{item.price * item.qty}
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-4 px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </motion.div>

        {/* Summary */}
        {mergedCart.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-10 bg-white/10 backdrop-blur-2xl p-6 rounded-xl shadow"
          >
            <div className="flex justify-between text-xl mb-4">
              <span>Total</span>
              <span className="font-bold">₹{total}</span>
            </div>

            {/* ⭐ PAYMENT METHOD DROPDOWN */}
            <select
              className="w-full mb-4 p-3 px-4 rounded-lg bg-gray-800 border border-white/10 text-white"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="ODC">Over The Counter</option>
              <option value="Online">Online Payment</option>
            </select>

            <button
              disabled={orderLoading}
              onClick={paymentMethod === "ODC" ? placeODCOrder : placeOnlineOrder}
              className="w-full py-3 rounded-lg font-bold shadow hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: PRIMARY_YELLOW, color: "#111" }}
            >
              {orderLoading
                ? "Processing..."
                : paymentMethod === "ODC"
                  ? "Place Order (Cash on Delivery)"
                  : "Pay & Place Order"}
            </button>


          </motion.div>
        )}


        <div className="mt-6 text-center">
          <Link to="/dashboard" className="text-white/70 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

      </div>

      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
    </div>
  );
}
