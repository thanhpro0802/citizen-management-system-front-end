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
    cccd: cccd,
    password: matKhau,
    hoTen: hoTen,
    soDienThoai: soDienThoai,
  });
};

/**
 * Đăng nhập người dùng
 */
export const dangNhap = (cccd, matKhau) => {
  return axios.post(`${API_URL}/login`, {
    cccd: cccd,
    password: matKhau,
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
  const token = layToken();
  if (token) {
    return getRolesFromToken(token);
  }
  return [];
};

/**
 * Kiểm tra người dùng có role cụ thể không
 */
export const coRole = (role, userObj = null) => {
  if (userObj && userObj.roles) {
    return userObj.roles.includes(role);
  }
  const roles = layRoles();
  return roles.includes(role);
};

/**
 * Kiểm tra người dùng có phải là cán bộ không
 */
export const laCanBo = () => {
  return coRole("CAN_BO");
};

/**
 * Tạo user object từ JWT response
 * ĐÃ SỬA: Bổ sung lấy soDienThoai, hoTen
 * @param {object} jwtResponse - Response từ backend
 * @returns {object} User object đầy đủ
 */
export const taoUserTuJWTResponse = (jwtResponse) => {
  if (!jwtResponse) {
    throw new Error("jwtResponse is required");
  }

  // --- PHẦN QUAN TRỌNG ĐÃ SỬA ---
  let user = {
    id: jwtResponse.id,
    cccd: jwtResponse.username || jwtResponse.cccd,
    roles: jwtResponse.roles || [],
    soDienThoai: jwtResponse.soDienThoai || jwtResponse.phoneNumber || jwtResponse.phone || "",
  };
  // --------------------------------

  // Nếu roles không có trong response và có token, decode từ JWT token
  if ((!user.roles || user.roles.length === 0) && jwtResponse.token) {
    const userFromToken = getUserFromToken(jwtResponse.token);
    if (userFromToken && userFromToken.roles) {
      user.roles = userFromToken.roles;
    }
  }

  return user;
};

/**
 * Lấy tên hiển thị của role (tiếng Việt)
 */
export const layTenHienThiRole = (roles) => {
  // Nếu roles là mảng (ví dụ ["CAN_BO_HO_KHAU"])
  const roleCode = Array.isArray(roles) ? roles[0] : roles;

  switch (roleCode) {
    case "ADMIN":
      return "Quản trị viên";

    // 👇 THÊM CÁC DÒNG NÀY:
    case "CAN_BO_HO_KHAU":
      return "Cán bộ Hộ khẩu";
    case "CAN_BO_NHAN_KHAU":
      return "Cán bộ Nhân khẩu";
    case "TO_TRUONG":
      return "Tổ trưởng";

    case "CONG_DAN":
      return "Công dân";

    default:
      // Nếu không khớp cái nào thì trả về chính mã đó hoặc "Cán bộ"
      return roleCode || "Người dùng";
  }
};

// Cấu hình axios interceptor
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

let onUnauthorizedCallback = null;

export const setUnauthorizedCallback = (callback) => {
  onUnauthorizedCallback = callback;
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      dangXuat();
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
    }
    return Promise.reject(error);
  }
);
