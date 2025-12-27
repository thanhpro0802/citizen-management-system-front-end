import axios from "axios";

const API_URL = "http://localhost:8080/api/statistics";

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

const statisticsService = {
  // Lấy thống kê tổng quan
  getOverview: () => axios.get(`${API_URL}/overview`, { headers: getAuthHeaders() }),

  // Thống kê nhân khẩu theo giới tính
  getNhanKhauByGioiTinh: () =>
    axios.get(`${API_URL}/nhan-khau/gioi-tinh`, { headers: getAuthHeaders() }),

  // Thống kê nhân khẩu theo độ tuổi
  getNhanKhauByDoTuoi: () =>
    axios.get(`${API_URL}/nhan-khau/do-tuoi`, { headers: getAuthHeaders() }),

  // Thống kê phản ánh theo trạng thái
  getPhanAnhByTrangThai: () =>
    axios.get(`${API_URL}/phan-anh/trang-thai`, { headers: getAuthHeaders() }),

  // Thống kê phản ánh theo lĩnh vực
  getPhanAnhByLinhVuc: () =>
    axios.get(`${API_URL}/phan-anh/linh-vuc`, { headers: getAuthHeaders() }),

  // Thống kê phản ánh theo mức độ
  getPhanAnhByMucDo: () =>
    axios.get(`${API_URL}/phan-anh/muc-do`, { headers: getAuthHeaders() }),

  // Thống kê phản ánh theo tháng
  getPhanAnhByMonth: (year) =>
    axios.get(`${API_URL}/phan-anh/theo-thang`, {
      params: { year },
      headers: getAuthHeaders(),
    }),

  // Thống kê hộ khẩu theo tháng
  getHoKhauByMonth: (year) =>
    axios.get(`${API_URL}/ho-khau/theo-thang`, {
      params: { year },
      headers: getAuthHeaders(),
    }),
};

export default statisticsService;
