import axios from "axios";

// Đảm bảo URL này trỏ đúng vào Controller quản lý Tài khoản/User của bạn
const API_URL = "http://localhost:8080/api/v1/tai-khoan";

// --- Hàm lấy Token (Copy y hệt từ phanAnhService sang để đảm bảo bảo mật) ---
const getAuthHeaders = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      token = user.token || user.accessToken;
    }
  }
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// --- API LẤY DANH SÁCH CÁN BỘ ---
export const getAllCanBo = () => {
  // Cách 1: Nếu Backend đã có API lọc theo vai trò
  // Giả sử Backend nhận tham số ?vaiTro=CAN_BO
  return axios.get(API_URL, {
    params: { vaiTro: "CAN_BO" },
    headers: getAuthHeaders(),
  });

  // Cách 2: Nếu chưa có Backend, dùng Mock Data (Dữ liệu giả) để test giao diện trước
  /*
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          { maTaiKhoan: "CB001", hoTen: "Nguyễn Văn A", sdt: "0912345678", chucVu: "Tổ trưởng" },
          { maTaiKhoan: "CB002", hoTen: "Trần Thị B", sdt: "0987654321", chucVu: "Nhân viên" },
          { maTaiKhoan: "CB003", hoTen: "Lê Văn C", sdt: "0909090909", chucVu: "Nhân viên" },
        ]
      });
    }, 500);
  });
  */
};
