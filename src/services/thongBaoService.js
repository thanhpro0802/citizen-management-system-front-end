import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/thong-bao";

export const getThongBaoCuaToi = () => {
  return axios.get(`${API_URL}/cua-toi`);
};

export const danhDauDaXem = (maThongBao) => {
  return axios.put(`${API_URL}/${maThongBao}/da-xem`);
};
