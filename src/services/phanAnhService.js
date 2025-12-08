import axios from "axios";

// URL Backend
const API_URL = "http://localhost:8080/api/v1/phan-anh";

export const guiPhanAnhMoi = (tieuDe, noiDung, linhVuc, danhSachFileUrl) => {
  return axios.post(API_URL, {
    tieuDe,
    noiDung,
    linhVuc,
    danhSachFileUrl,
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
  return axios.get(API_URL);
};
