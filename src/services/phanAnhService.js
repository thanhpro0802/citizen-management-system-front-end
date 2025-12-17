import axios from "axios";

// URL Backend
const API_URL = "http://localhost:8080/api/v1/phan-anh";

export const guiPhanAnhMoi = (duLieu) => {
  // 1. Lấy thủ công Token từ LocalStorage ra
  const userString = localStorage.getItem("user");

  if (!userString) {
    console.error("Không tìm thấy user trong LocalStorage");
    throw new Error("Bạn chưa đăng nhập!");
  }

  const user = JSON.parse(userString);
  const token = user.token || user.accessToken; // Dự phòng trường hợp tên biến khác nhau

  // 2. Gửi Request kèm Header Authorization cứng
  return axios.post(API_URL, duLieu, {
    headers: {
      Authorization: `Bearer ${token}`, // <-- QUAN TRỌNG NHẤT
      "Content-Type": "application/json",
    },
  });
};

export const getPhanAnhCuaToi = () => {
  return axios.get(`${API_URL}/cua-toi`);
};

export const capNhatXuLyNoiBo = (maPhanAnh, noiDungCapNhat, danhSachFileUrl) => {
  const requestData = {
    noiDungCapNhat: noiDungCapNhat,
    danhSachFileUrl: danhSachFileUrl,
  };
  return axios.post(`${API_URL}/${maPhanAnh}/xu-ly-noi-bo`, requestData);
};

export const phanHoiCongDan = (maPhanAnh, noiDungPhanHoi) => {
  const requestData = {
    noiDungPhanHoi: noiDungPhanHoi,
  };
  return axios.post(`${API_URL}/${maPhanAnh}/phan-hoi`, requestData);
};

export const getChiTietPhanAnh = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const getLichSuPhanAnh = (id) => {
  return axios.get(`${API_URL}/${id}/lich-su`);
};

export const danhGiaPhanHoi = (maPhanAnh, danhGiaHaiLong, gopY) => {
  const requestData = {
    danhGiaHaiLong: danhGiaHaiLong,
    gopY: gopY,
  };
  return axios.put(`${API_URL}/${maPhanAnh}/danh-gia`, requestData);
};

export const getAllPhanAnh = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return axios.get(API_URL, {
    // Gọi vào gốc /api/v1/phan-anh
    headers: { Authorization: `Bearer ${user.token}` },
  });
};

export const updateMucDoKhanCap = (id, mucDo) => {
  const user = JSON.parse(localStorage.getItem("user"));
  // API: PUT /api/v1/phan-anh/{id}/muc-do-khan-cap?mucDo=CAO
  return axios.put(`${API_URL}/${id}/muc-do-khan-cap`, null, {
    params: { mucDo }, // Gửi dưới dạng query param
    headers: { Authorization: `Bearer ${user.token}` },
  });
};

export const phanCongXuLy = (id, maCanBo, thoiHan) => {
  const user = JSON.parse(localStorage.getItem("user"));
  // API: PUT /api/v1/phan-anh/{id}/phan-cong
  return axios.put(
    `${API_URL}/${id}/phan-cong`,
    { maCanBoPhuTrach: maCanBo, thoiHanXuLy: thoiHan },
    { headers: { Authorization: `Bearer ${user.token}` } }
  );
};
