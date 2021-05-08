import axios from "axios";
export const env = "dev";
const baseURL =
  env == "dev"
    ? "http://a8022c8c0e29.ngrok.io/"
    : "https://interview-tracker-iitg.herokuapp.com";

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default axiosInstance
