import axios from "axios";

const API = axios.create({
baseURL: "http://localhost:3000/api",
});

// Rest of the file remains the same
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default API;