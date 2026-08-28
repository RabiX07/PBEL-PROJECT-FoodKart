import axios from "../axiosInstance";

export const sendOtp = async (email) => {
  try {
    const res = await axios.post("/users/sendotp", { email });
    return res.data;
  } catch (err) {
    console.error(err);
    return err.response.data;
  }
};

