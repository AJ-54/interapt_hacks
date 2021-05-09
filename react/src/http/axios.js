import axios from "axios";
export const env = "dev";
const baseURL =
  env == "dev"
    ? "http://13.77.159.131"
    : "https://interview-tracker-iitg.herokuapp.com";

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default axiosInstance
