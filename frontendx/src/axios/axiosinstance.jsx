import axios from "axios";

const isProd = import.meta.env.PROD;

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export default axiosInstance;
