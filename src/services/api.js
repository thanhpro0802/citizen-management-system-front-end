// src/services/api.js
import axios from "axios";

// [KIỂM TRA]: Đảm bảo đường dẫn import này đúng, hoặc bạn có thể đọc trực tiếp localStorage ở dưới
import { layToken } from "./authService";

const api = axios.create({
  baseURL: "http://localhost:8080", // Backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // Cách 1: Dùng hàm layToken của bạn
    let token = layToken ? layToken() : null;

    // Cách 2 (AN TOÀN HƠN ĐỂ TEST): Đọc trực tiếp từ localStorage
    // Bạn hãy vào DevTools -> Application -> Local Storage xem key tên là gì?
    // Nếu là "accessToken" thì sửa dòng dưới thành "accessToken"
    if (!token) {
      token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    }

    // --- LOG KIỂM TRA (Sẽ hiện ở Console trình duyệt F12) ---
    console.log("URL gọi đi:", config.url);
    console.log("Token lấy được:", token);
    // -------------------------------------------------------

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
