import axios from "axios";
const API_URL = "http://localhost:8080/api/ho-khau"; // tuỳ theo backend

export const fetchHoKhauList = (params) => axios.get(API_URL, { params });
export const fetchHoKhauDetail = (id) => axios.get(`${API_URL}/${id}`);
export const createHoKhau = (data) => axios.post(API_URL, data);
export const updateHoKhau = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteHoKhau = (id) => axios.delete(`${API_URL}/${id}`);

// Nghiệp vụ đặc biệt
export const tachHo = (id, data) => axios.post(`${API_URL}/${id}/tach-ho`, data);
export const nhapHo = (id, data) => axios.post(`${API_URL}/${id}/nhap-ho`, data);
export const thayDoiChuHo = (id, data) => axios.post(`${API_URL}/${id}/thay-doi-chu-ho`, data);
export const themThanhVien = (id, data) => axios.post(`/api/ho-khau/${id}/them-thanh-vien`, data);
export const xoaThanhVien = (id, data) => axios.post(`/api/ho-khau/${id}/xoa-thanh-vien`, data);
