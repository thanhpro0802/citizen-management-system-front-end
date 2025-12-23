import api from "./api";

const API_URL = "/api/ho-khau";

// CRUD
export const fetchHoKhauList = () => api.get(API_URL);
export const fetchHoKhauDetail = (maHoKhau) => api.get(`${API_URL}/${maHoKhau}`);
export const createHoKhau = (data) => api.post(API_URL, data);
export const updateHoKhau = (maHoKhau, data) => api.put(`${API_URL}/${maHoKhau}`, data);
export const deleteHoKhau = (maHoKhau) => api.delete(`${API_URL}/${maHoKhau}`);

// Nghiệp vụ theo đúng backend
export const tachHo = (maHoKhauCu, data) => api.post(`${API_URL}/${maHoKhauCu}/tach-ho`, data);
export const nhapHo = (maHoNhapVao, data) => api.post(`${API_URL}/${maHoNhapVao}/nhap-ho`, data);
export const thayDoiChuHo = (maHoKhau, data) => api.put(`${API_URL}/${maHoKhau}/doi-chu-ho`, data);
export const fetchMyHoKhau = () => api.get(`${API_URL}/cua-toi`);
