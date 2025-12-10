import axios from "axios";
import { getUserFromToken, getRolesFromToken, isTokenExpired } from "utils/jwtUtils";

// SỬA: URL Backend khớp với @RequestMapping("/api/auth")
const API_URL = "http://localhost:8080/api/auth";

/**
 * Đăng ký người dùng mới
 * Lưu ý: Back-end hiện tại chỉ nhận cccd và password.
 * Các trường hoTen, soDienThoai cần thêm vào DTO Back-end nếu muốn lưu.
 */
export const dangKy = (hoTen, cccd, matKhau, soDienThoai = "") => {
  return axios.post(`${API_URL}/register`, {
    // SỬA: endpoint /register
    cccd: cccd, // Map với Back-end
    password: matKhau, // Map matKhau -> password
    // Gửi kèm các trường này phòng khi bạn update Back-end sau này
    hoTen: hoTen,
    soDienThoai: soDienThoai,
  });
};

/**
 * Đăng nhập người dùng
 * SỬA: Thay email bằng cccd
 */
export const dangNhap = (cccd, matKhau) => {
  return axios.post(`${API_URL}/login`, {
    // SỬA: endpoint /login
    cccd: cccd, // Map email cũ -> cccd
    password: matKhau, // Map matKhau -> password
  });
};

/**
 * Đăng xuất người dùng
 */
export const dangXuat = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * Lưu token vào localStorage
 * @param {string} token - JWT token
 */
export const luuToken = (token) => {
  localStorage.setItem("token", token);
};

/**
 * Lấy token từ localStorage
 * @returns {string|null} Token hoặc null
 */
export const layToken = () => {
  return localStorage.getItem("token");
};

/**
 * Lưu thông tin người dùng vào localStorage
 * @param {object} user - Thông tin người dùng
 */
export const luuThongTinNguoiDung = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

/**
 * Lấy thông tin người dùng từ localStorage
 * @returns {object|null} Thông tin người dùng hoặc null
 */
export const layThongTinNguoiDung = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Kiểm tra người dùng đã đăng nhập chưa
 * @returns {boolean} True nếu đã đăng nhập
 */
export const kiemTraDaDangNhap = () => {
  const token = layToken();
  if (!token) return false;

  // Kiểm tra token có hết hạn không
  return !isTokenExpired(token);
};

/**
 * Lấy roles của người dùng hiện tại
 * @returns {array} Mảng các roles
 */
export const layRoles = () => {
  const user = layThongTinNguoiDung();
  if (user && user.roles) {
    return user.roles;
  }

  // Nếu không có trong user, thử decode từ token
  const token = layToken();
  if (token) {
    return getRolesFromToken(token);
  }

  return [];
};

/**
 * Kiểm tra người dùng có role cụ thể không
 * @param {string} role - Tên role cần kiểm tra
 * @param {object} userObj - User object (optional, nếu không truyền sẽ lấy từ localStorage)
 * @returns {boolean} True nếu có role
 */
export const coRole = (role, userObj = null) => {
  // Nếu có truyền user object, kiểm tra trực tiếp
  if (userObj && userObj.roles) {
    return userObj.roles.includes(role);
  }
  
  // Không thì lấy từ localStorage/token
  const roles = layRoles();
  return roles.includes(role);
};

/**
 * Kiểm tra người dùng có phải là cán bộ không
 * @returns {boolean} True nếu là cán bộ
 */
export const laCanBo = () => {
  return coRole("CAN_BO");
};

/**
 * Tạo user object từ JWT response, xử lý cả trường hợp roles trong response hoặc trong token
 * @param {object} jwtResponse - Response từ backend (chứa token, id, cccd, roles)
 * @returns {object} User object với roles đầy đủ
 */
export const taoUserTuJWTResponse = (jwtResponse) => {
  const { getUserFromToken } = require("utils/jwtUtils");
  
  let user = {
    id: jwtResponse.id,
    cccd: jwtResponse.cccd,
    roles: jwtResponse.roles || [],
  };

  // Nếu roles không có trong response, decode từ JWT token
  if (!user.roles || user.roles.length === 0) {
    const userFromToken = getUserFromToken(jwtResponse.token);
    if (userFromToken && userFromToken.roles) {
      user.roles = userFromToken.roles;
    }
  }

  return user;
};

/**
 * Lấy tên hiển thị của role (tiếng Việt)
 * @param {array} roles - Mảng roles
 * @returns {string} Tên role hiển thị
 */
export const layTenHienThiRole = (roles) => {
  if (!roles || roles.length === 0) return "Người Dân";
  if (roles.includes("CAN_BO")) return "Cán Bộ";
  return "Người Dân";
};

// Cấu hình axios interceptor để tự động thêm token vào headers
axios.interceptors.request.use(
  (config) => {
    const token = layToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Callback function for handling 401 errors (set by the app)
let onUnauthorizedCallback = null;

/**
 * Set callback function to handle unauthorized (401) errors
 * @param {Function} callback - Function to call on 401 error (e.g., navigate to login)
 */
export const setUnauthorizedCallback = (callback) => {
  onUnauthorizedCallback = callback;
};

// Xử lý lỗi 401 (Unauthorized) - tự động đăng xuất
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      dangXuat();
      // Call the callback if it's set (e.g., navigate to login using React Router)
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
    }
    return Promise.reject(error);
  }
);
