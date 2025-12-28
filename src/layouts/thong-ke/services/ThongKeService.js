import axiosClient from "./axiosClient";

export const getThongKeDanToc = () => axiosClient.get("/nhan-khau?types=DAN_TOC");

export const getTongHoKhau = () => axiosClient.get("/ho-khau?types=TONG_HK");

export const getThongKeSoThanhVien = () => axiosClient.get("/ho-khau?types=SO_THANH_VIEN");

export const getThongKeNhanKhau = (type) =>
  axiosClient.get("nhan-khau", {
    params: {
      types: type,
    },
  });

export const getThongKePhanAnh = (startDate) =>
  axiosClient.get("phan-anh", {
    params: {
      types: "TUAN",
      startDate: startDate,
    },
  });

export const getThongKePhanAnhTheoThang = (year) =>
  axiosClient.get("phan-anh/thang", {
    params: {
      year: year,
    },
  });

export const getThongKePhanAnhTheoQuy = (year) =>
  axiosClient.get("phan-anh/quy", {
    params: {
      year: year,
    },
  });

export const getThongKeTamTruTamVang = ({ type, startDate }) =>
  axiosClient.get("tam-tru-tam-vang", {
    params: {
      types: type,
      startDate: startDate,
    },
  });

export const getThongKeTamTruTamVangTheoTuan = ({ type, startDate }) =>
  axiosClient.get("tam-tru-tam-vang/tuan", {
    params: {
      types: type,
      startDate: startDate,
    },
  });

export const getThongKeTamTruTheoThang = (year) =>
  axiosClient.get("tam-tru/thang", {
    params: {
      year: year,
    },
  });

export const getThongKeTamVangTheoThang = (year) =>
  axiosClient.get("tam-vang/thang", {
    params: {
      year: year,
    },
  });
