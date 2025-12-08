import axios from "axios";

// URL Backend cho authentication
const API_URL = "http://localhost:8080/api/v1/auth";

/**
 * Đăng ký người dùng mới
 * @param {string} hoTen - Họ và tên người dùng
 * @param {string} email - Email người dùng
 * @param {string} matKhau - Mật khẩu
 * @param {string} soDienThoai - Số điện thoại (optional)
 * @returns {Promise} Promise với thông tin người dùng đã đăng ký
 */
export const dangKy = (hoTen, email, matKhau, soDienThoai = "") => {
  return axios.post(`${API_URL}/dang-ky`, {
    hoTen,
    email,
    matKhau,
    soDienThoai,
  });
};

/**
 * Đăng nhập người dùng
 * @param {string} email - Email người dùng
 * @param {string} matKhau - Mật khẩu
 * @returns {Promise} Promise với token và thông tin người dùng
 */
export const dangNhap = (email, matKhau) => {
  return axios.post(`${API_URL}/dang-nhap`, {
    email,
    matKhau,
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
  return layToken() !== null;
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

// Xử lý lỗi 401 (Unauthorized) - tự động đăng xuất
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      dangXuat();
      // Có thể redirect về trang đăng nhập
      window.location.href = "/authentication/sign-in";
    }
    return Promise.reject(error);
  }
);
