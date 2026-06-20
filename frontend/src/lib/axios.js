import axios from "axios";

const getBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return `${import.meta.env.VITE_API_BASE_URL}/api`;
  }
  // Fallback: dynamically use the same hostname as the browser
  const hostname = typeof window !== "undefined" && window.location ? window.location.hostname : "localhost";
  return `http://${hostname}:5001/api`;
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

export default axiosInstance;