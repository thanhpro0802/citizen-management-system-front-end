import axiosClient from "./axiosClient";

export const getThongKeDoTuoi = () => axiosClient.get("/thong-ke/do-tuoi");

export const getThongKeGioiTinh = () => axiosClient.get("/thong-ke/gioi-tinh");

export const getThongKeQueQuan = () => axiosClient.get("/thong-ke/que-quan");

export const getThongKeSoLuong = () => axiosClient.get("/thong-ke/so-nguoi");
