/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

import Icon from "@mui/material/Icon";

// ================== AUTH LAYOUTS ==================
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// ================== CÔNG DÂN LAYOUTS ==================
import GuiPhanAnh from "layouts/phan-anh";
import LichSuPhanAnh from "layouts/lich-su-phan-anh";
import ChiTietPhanAnh from "layouts/chi-tiet-phan-anh";
import ThongTinCaNhan from "layouts/thong-tin-ca-nhan";
import HoKhauDetail from "layouts/ho-khau/Detail"; // Dùng cho xem chi tiết và xem "Của tôi"

// ================== CÁN BỘ LAYOUTS ==================
// 1. Phản ánh
import QuanLyPhanAnh from "layouts/quan-ly-phan-anh";
import XuLyPhanAnh from "layouts/xu-ly-phan-anh";
import PhanHoi from "layouts/phan-hoi";

// 2. Nhân khẩu
import QuanLyNhanKhau from "layouts/nhan-khau"; // Trang danh sách
import NhanKhauForm from "layouts/nhan-khau/form"; // Form thêm/sửa
import NhanKhauDetail from "layouts/nhan-khau/detail"; // Xem chi tiết

// 3. Hộ khẩu
import HoKhauList from "layouts/ho-khau"; // Trang danh sách
import HoKhauForm from "layouts/ho-khau/Form"; // Form thêm/sửa
import TachHo from "layouts/ho-khau/TachHo";
import NhapHo from "layouts/ho-khau/NhapHo";

// ================== KHÁC ==================
import Forbidden from "layouts/forbidden";

const routes = [
  /* ================= AUTHENTICATION ================= */
  {
    type: "collapse",
    name: "Đăng Nhập",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Đăng Ký",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },

  /* ================= MENU DÀNH CHO CÔNG DÂN ================= */
  {
    type: "collapse",
    name: "Thông Tin Cá Nhân",
    key: "thong-tin-ca-nhan",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/thong-tin-ca-nhan",
    component: <ThongTinCaNhan />,
    requireAuth: true,
  },
  // {
  //   type: "collapse",
  //   name: "Hộ Khẩu Của Tôi",
  //   key: "ho-khau-cua-toi",
  //   icon: <Icon fontSize="small">home</Icon>,
  //   route: "/ho-khau-cua-toi",
  //   component: <HoKhauDetail isMe={true} />, // Tái sử dụng component Detail với cờ isMe
  //   requireAuth: true,
  // },
  {
    type: "collapse",
    name: "Gửi Phản Ánh",
    key: "gui-phan-anh",
    icon: <Icon fontSize="small">feedback</Icon>,
    route: "/gui-phan-anh",
    component: <GuiPhanAnh />,
    requireAuth: true,
  },
  {
    type: "collapse",
    name: "Lịch Sử Phản Ánh",
    key: "lich-su-phan-anh",
    icon: <Icon fontSize="small">history</Icon>,
    route: "/lich-su-phan-anh",
    component: <LichSuPhanAnh />,
    requireAuth: true,
  },

  /* ================= MENU DÀNH CHO CÁN BỘ ================= */
  
  // 1. Quản lý Phản Ánh
  {
    type: "collapse",
    name: "Quản Lý Phản Ánh",
    key: "quan-ly-phan-anh",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/quan-ly-phan-anh",
    component: <QuanLyPhanAnh />,
    requireAuth: true,
    requiredRole: "CAN_BO",
  },

  // 2. Quản lý Nhân Khẩu
  {
    type: "collapse",
    name: "Quản Lý Nhân Khẩu",
    key: "nhan-khau",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/nhan-khau",
    component: <QuanLyNhanKhau />,
    requireAuth: true,
    requiredRole: "CAN_BO",
  },

  // 3. Quản lý Hộ Khẩu
  {
    type: "collapse",
    name: "Quản Lý Hộ Khẩu",
    key: "ho-khau",
    icon: <Icon fontSize="small">other_houses</Icon>,
    route: "/ho-khau",
    component: <HoKhauList />,
    requireAuth: true,
    requiredRole: "CAN_BO",
  },

  /* ================= CÁC ROUTE ẨN (Chi tiết / Form xử lý) ================= */
  
  // --- Phản ánh ---
  {
    key: "chi-tiet-phan-anh",
    route: "/chi-tiet-phan-anh/:id",
    component: <ChiTietPhanAnh />,
    requireAuth: true,
  },
  {
    key: "xu-ly-phan-anh",
    route: "/xu-ly-phan-anh/:id",
    component: <XuLyPhanAnh />,
    requireAuth: true,
    requiredRole: "CAN_BO",
  },
  {
    key: "phan-hoi",
    route: "/phan-hoi/:id",
    component: <PhanHoi />,
    requireAuth: true,
    requiredRole: "CAN_BO",
  },

  // --- Nhân khẩu ---
  {
    key: "nhan-khau-create",
    route: "/nhan-khau/create",
    component: <NhanKhauForm />,
    requireAuth: true,
    requiredRole: "CAN_BO",
  },
  {
    key: "nhan-khau-edit",
    route: "/nhan-khau/edit/:id",
    component: <NhanKhauForm />,
    requireAuth: true,
    requiredRole: "CAN_BO",
  },
  {
    key: "nhan-khau-detail",
    route: "/nhan-khau/:id",
    component: <NhanKhauDetail />,
    requireAuth: true,
    requiredRole: "CAN_BO",
  },

  // --- Hộ khẩu (Sub-actions) ---
  {
    key: "ho-khau-create",
    route: "/ho-khau/tao-moi",
    component: <HoKhauForm />,
    requireAuth: true,
    requiredRole: "CAN_BO",
  },
  {
    key: "ho-khau-detail",
    route: "/ho-khau/:id",
    component: <HoKhauDetail />,
    requireAuth: true,
    requiredRole: "CAN_BO",
  },
  {
    key: "ho-khau-edit",
    route: "/ho-khau/:id/chinh-sua",
    component: <HoKhauForm />,
    requireAuth: true,
    requiredRole: "CAN_BO",
  },
  {
    key: "ho-khau-tach",
    route: "/ho-khau/:id/tach-ho",
    component: <TachHo />,
    requireAuth: true,
    requiredRole: "CAN_BO",
  },
  {
    key: "ho-khau-nhap",
    route: "/ho-khau/:id/nhap-ho",
    component: <NhapHo />,
    requireAuth: true,
    requiredRole: "CAN_BO",
  },

  /* ================= TRANG LỖI ================= */
  {
    type: "route",
    name: "Không Có Quyền",
    key: "forbidden",
    route: "/forbidden",
    component: <Forbidden />,
  },
];

export default routes;