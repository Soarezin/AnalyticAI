import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE ?? "http://localhost:5175/api";

const client = axios.create({
  baseURL
});

client.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem("analyticsai_api_key");
  if (apiKey) {
    config.headers["x-api-key"] = apiKey;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("analyticsai_api_key");
    }
    return Promise.reject(error);
  }
);

export default client;
