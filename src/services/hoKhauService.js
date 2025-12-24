import axios from "axios";

// Base API URL for household management
const API_URL = "http://localhost:8080/api/ho-khau";

// Get authorization headers with token
const getAuthHeaders = () => {
  let token = localStorage.getItem("token");

  // If token not found directly, look in user object
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

const hoKhauService = {
  // Get my household (for both CONG_DAN and CAN_BO)
  getMyHoKhau: () => axios.get(`${API_URL}/cua-toi`, { headers: getAuthHeaders() }),

  // Get all households (CAN_BO only)
  getAll: () => axios.get(API_URL, { headers: getAuthHeaders() }),

  // Get household details by ID
  getById: (id) => axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() }),

  // Search households by address
  searchByDiaChi: (keyword) =>
    axios.get(`${API_URL}/tim-kiem`, {
      params: { diaChi: keyword },
      headers: getAuthHeaders(),
    }),

  // Create new household (CAN_BO only)
  create: (data) => axios.post(API_URL, data, { headers: getAuthHeaders() }),

  // Update household (CAN_BO only)
  update: (id, data) => axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeaders() }),

  // Delete household (CAN_BO only)
  delete: (id) => axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() }),

  // Split household (Tách hộ) (CAN_BO only)
  tachHo: (id, data) => axios.post(`${API_URL}/${id}/tach-ho`, data, { headers: getAuthHeaders() }),

  // Merge household (Nhập hộ) (CAN_BO only)
  nhapHo: (id, data) => axios.post(`${API_URL}/${id}/nhap-ho`, data, { headers: getAuthHeaders() }),

  // Change household head (Đổi chủ hộ) (CAN_BO only)
  doiChuHo: (id, data) =>
    axios.put(`${API_URL}/${id}/doi-chu-ho`, data, { headers: getAuthHeaders() }),
};

export default hoKhauService;
