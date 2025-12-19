import api from "./api";

const API_URL = "/api/ho-khau";
// api.post("/api/ho-khau", data);

// CRUD
export const fetchHoKhauList = (params) => api.get(API_URL, { params });
export const fetchHoKhauDetail = (id) => api.get(`${API_URL}/${id}`);
export const createHoKhau = (data) => api.post(API_URL, data);
export const updateHoKhau = (id, data) => api.put(`${API_URL}/${id}`, data);
export const deleteHoKhau = (id) => api.delete(`${API_URL}/${id}`);

// Nghiep vu dac biet
export const tachHo = (id, data) => api.post(`${API_URL}/${id}/tach-ho`, data);
export const nhapHo = (id, data) => api.post(`${API_URL}/${id}/nhap-ho`, data);
export const thayDoiChuHo = (id, data) => api.put(`${API_URL}/${id}/doi-chu-ho`, data);

// 2 dong nay ban dang goi "/api/..." (thieu localhost:8080) => se bay sang port frontend
export const themThanhVien = (id, data) => api.post(`${API_URL}/${id}/them-thanh-vien`, data);
export const xoaThanhVien = (id, data) => api.post(`${API_URL}/${id}/xoa-thanh-vien`, data);
