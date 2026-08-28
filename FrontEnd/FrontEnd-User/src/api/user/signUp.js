import axios from "../axiosInstance";
export const signup = async (fullName, email, password, otp) => {
  try {
    const res = await axios.post("/users/signup", {
      fullName,
      email,
      password,
      otp,
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

