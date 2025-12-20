import axiosClient from "./axiosClient";

export const getThongKeDoTuoi = () => axiosClient.get("/do-tuoi");

export const getThongKeGioiTinh = () => axiosClient.get("/gioi-tinh");

export const getThongKeQueQuan = () => axiosClient.get("/que-quan");

export const getThongKeSoLuong = () => axiosClient.get("/so-nguoi");
