import axios from "axios";

const API_URL = "http://localhost:8080/api/thong-ke";

export const getTongNhanKhau = () => {
  return axios.get(`${API_URL}/nhan-khau?types=TONG`);
};

export const getThongKeDoTuoi = () => {
  return axios.get(`${API_URL}/nhan-khau?types=DO_TUOI`);
};

export const getThongKeGioiTinh = () => {
  return axios.get(`${API_URL}/nhan-khau?types=GIOI_TINH`);
};

export const getThongKeQueQuan = () => {
  return axios.get(`${API_URL}/nhan-khau?types=QUE_QUAN`);
};

export const getThongKeDanToc = () => {
  return axios.get(`${API_URL}/nhan-khau?types=DAN_TOC`);
};

export const getThongKeSoThanhVien = () => {
  return axios.get(`${API_URL}/ho-khau`);
};
