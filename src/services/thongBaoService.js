import api from "./api";

const API_URL = "/api/v1/thong-bao";

export const getThongBaoCuaToi = () => {
  return api.get(`${API_URL}/cua-toi`);
};

export const danhDauDaXem = (maThongBao) => {
  return api.put(`${API_URL}/${maThongBao}/da-xem`);
};
