import axios from "../axiosInstance";

export const login = async (email, password) => {
  try {
    const res = await axios.post("/users/login", {
      email,
      password,
    });

    return res.data;
  } catch (err) {
    return err.response.data;
  }
};
