import axios from "axios";
export const env = "dev";
const baseURL =
  env == "dev"
    ? "http://localhost:8000"
    : "https://interview-tracker-iitg.herokuapp.com";

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  },
});

export default axiosInstance;