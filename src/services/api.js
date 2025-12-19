// src/services/api.js
import axios from "axios";
import { layToken } from "./authService"; // hoặc tự đọc localStorage

const api = axios.create({
  baseURL: "http://localhost:8080", // backend
});

api.interceptors.request.use((config) => {
  const token = layToken(); // localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
