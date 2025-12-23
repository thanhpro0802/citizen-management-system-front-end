import axiosClient from "./axiosClient";

export const getThongKeDanToc = () => axiosClient.get("/nhan-khau?types=DAN_TOC");

export const getTongHoKhau = () => axiosClient.get("/ho-khau?types=TONG_HK");

export const getThongKeSoThanhVien = () => axiosClient.get("/ho-khau?types=SO_THANH_VIEN");

export const getThongKePhanAnh = (startDate) =>
  axiosClient.get("phan-anh", {
    params: {
      types: "TUAN",
      startDate: startDate,
    },
  });

export const getThongKeNhanKhau = (type) =>
  axiosClient.get("nhan-khau", {
    params: {
      types: type,
    },
  });

export const getThongKePhanAnhTheoNam = (year) =>
  axiosClient.get("phan-anh-nam", {
    params: {
      year: year,
    },
  });
