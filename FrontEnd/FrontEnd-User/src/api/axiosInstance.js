import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: `http://${window.location.hostname}:3000/api`,
  baseURL: `/api`,
  withCredentials: true,     // allow cookies (important for JWT)
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("Axios Base URL =", axiosInstance.defaults.baseURL);

export default axiosInstance;