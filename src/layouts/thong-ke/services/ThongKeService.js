import axiosClient from "./axiosClient";

export const getTongNhanKhau = () => axiosClient.get("/nhan-khau?types=TONG_NK");

export const getThongKeDoTuoi = () => axiosClient.get("/nhan-khau?types=DO_TUOI");

export const getThongKeGioiTinh = () => axiosClient.get("/nhan-khau?types=GIOI_TINH");

export const getThongKeQueQuan = () => axiosClient.get("/nhan-khau?types=QUE_QUAN");

export const getThongKeDanToc = () => axiosClient.get("/nhan-khau?types=DAN_TOC");

export const getTongHoKhau = () => axiosClient.get("/ho-khau?types=TONG_HK");

export const getThongKeSoThanhVien = () => axiosClient.get("/ho-khau?types=SO_THANH_VIEN");
