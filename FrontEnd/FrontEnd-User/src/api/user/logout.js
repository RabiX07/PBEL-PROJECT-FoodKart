import axiosInstance from "../axiosInstance";

export const logout = async () => {
  try {
    const res = await axiosInstance.post("/users/logout");
    return res.data;
  } catch (err) {
    return err.response?.data || { success: false };
  }
};
