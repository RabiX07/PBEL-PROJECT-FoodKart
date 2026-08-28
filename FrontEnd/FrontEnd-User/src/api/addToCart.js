import axiosInstance from "../api/axiosInstance";

export const addToCart = async (productId, quantity = 1) => {
  try {
    const res = await axiosInstance.post("/cart/add", {
      productId,
      quantity,
    });
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || "Error" };
  }
};
