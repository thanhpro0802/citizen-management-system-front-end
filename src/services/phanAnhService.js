import api from "./api";

const API_URL = "/api/v1/phan-anh";

export const guiPhanAnhMoi = (tieuDe, noiDung, linhVuc, danhSachFileUrl) => {
  return api.post(API_URL, {
    tieuDe,
    noiDung,
    linhVuc,
    danhSachFileUrl,
  });
};

export const getPhanAnhCuaToi = () => {
  return api.get(`${API_URL}/cua-toi`);
};

export const capNhatXuLyNoiBo = (maPhanAnh, noiDungCapNhat, danhSachFileUrl) => {
  return api.post(`${API_URL}/${maPhanAnh}/xu-ly-noi-bo`, {
    noiDungCapNhat,
    danhSachFileUrl,
  });
};

export const phanHoiCongDan = (maPhanAnh, noiDungPhanHoi) => {
  return api.post(`${API_URL}/${maPhanAnh}/phan-hoi`, {
    noiDungPhanHoi,
  });
};

export const getChiTietPhanAnh = (id) => {
  return api.get(`${API_URL}/${id}`);
};

export const getLichSuPhanAnh = (id) => {
  return api.get(`${API_URL}/${id}/lich-su`);
};

export const danhGiaPhanHoi = (maPhanAnh, danhGiaHaiLong, gopY) => {
  return api.put(`${API_URL}/${maPhanAnh}/danh-gia`, {
    danhGiaHaiLong,
    gopY,
  });
};

export const getAllPhanAnh = () => {
  return api.get(API_URL);
};
