import axios from "axios";

const axiosInstance = axios.create({
   baseURL: `/api`,
  withCredentials: true,     // allow cookies (important for JWT)
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;