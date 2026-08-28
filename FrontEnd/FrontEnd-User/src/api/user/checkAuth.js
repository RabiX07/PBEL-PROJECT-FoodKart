import axiosInstance from "../axiosInstance";

export const checkAuth = async () => {
  try {
    const res = await axiosInstance.get("/profile/profile");
    return { authenticated: true, user: res.data.user };
  } catch (err) {
    return { authenticated: false };
  }
};
