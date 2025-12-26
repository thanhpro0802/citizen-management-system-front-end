import Icon from "@mui/material/Icon";

// Auth
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// Công dân
import GuiPhanAnh from "layouts/phan-anh";
import LichSuPhanAnh from "layouts/lich-su-phan-anh";
import ChiTietPhanAnh from "layouts/chi-tiet-phan-anh";
import ThongTinCaNhan from "layouts/thong-tin-ca-nhan";

// Cán bộ
import QuanLyPhanAnh from "layouts/quan-ly-phan-anh";
import XuLyPhanAnh from "layouts/xu-ly-phan-anh";
import PhanHoi from "layouts/phan-hoi";
import QuanLyNhanKhau from "layouts/nhan-khau";
import QuanLyHoKhau from "layouts/ho-khau";

// Nhân khẩu chi tiết (route ẩn)
import NhanKhauForm from "layouts/nhan-khau/form";
import NhanKhauDetail from "layouts/nhan-khau/detail";

// Khác
import Forbidden from "layouts/forbidden";

const routes = [
  /* ================= AUTH ================= */
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

  /* ================= CÔNG DÂN ================= */
  {
    type: "collapse",
    name: "Thông Tin Cá Nhân",
    key: "thong-tin-ca-nhan",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/thong-tin-ca-nhan",
    component: <ThongTinCaNhan />,
    requireAuth: true,
  },
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

  /* ================= CÁN BỘ ================= */
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
  {
    type: "collapse",
    name: "Quản Lý Hộ Khẩu",
    key: "ho-khau",
    icon: <Icon fontSize="small">home</Icon>,
    route: "/ho-khau",
    component: <QuanLyHoKhau />,
    requireAuth: true,
    requiredRole: "CAN_BO",
  },

  /* ================= ROUTE ẨN ================= */
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

  /* ===== NHÂN KHẨU FORM / DETAIL (ẨN) ===== */
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

  /* ================= FORBIDDEN ================= */
  {
    type: "route",
    name: "Không Có Quyền",
    key: "forbidden",
    route: "/forbidden",
    component: <Forbidden />,
  },
];

export default routes;
