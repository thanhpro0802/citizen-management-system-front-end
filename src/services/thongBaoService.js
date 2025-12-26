import api from "./api";

// Đường dẫn gốc
const API_URL = "http://localhost:8080/api/v1/thong-bao";

export const getThongBaoCuaToi = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return Promise.reject("No user");

  // SỬA: Thêm "/cua-toi" vào đường dẫn
  return axios.get(`${API_URL}/cua-toi`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
};

export const danhDauDaXem = (id) => {
  const user = JSON.parse(localStorage.getItem("user"));
  // API đánh dấu đã xem: /api/v1/thong-bao/{id}/da-xem
  return axios.put(
    `${API_URL}/${id}/da-xem`,
    {},
    {
      headers: { Authorization: `Bearer ${user.token}` },
    }
  );
};
