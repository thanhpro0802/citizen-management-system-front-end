/** All of the routes for the Material Dashboard 2 React are added here...
 */

// Material Dashboard 2 React layouts
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// --- SỬA LẠI CÁC DÒNG IMPORT DƯỚI ĐÂY ---
// React sẽ tự động tìm file index.js trong các thư mục này

import GuiPhanAnh from "layouts/phan-anh";
import LichSuPhanAnh from "layouts/lich-su-phan-anh";
import QuanLyPhanAnh from "layouts/quan-ly-phan-anh";
import ChiTietPhanAnh from "layouts/chi-tiet-phan-anh";
import XuLyPhanAnh from "layouts/xu-ly-phan-anh";
import PhanHoi from "layouts/phan-hoi";

import HoKhauCuaToi from "layouts/ho-khau-cua-toi";
import QuanLyHoKhau from "layouts/quan-ly-ho-khau";
import ChiTietHoKhau from "layouts/chi-tiet-ho-khau";
import FormHoKhau from "layouts/form-ho-khau";
import TachHo from "layouts/tach-ho";
import NhapHo from "layouts/nhap-ho";
import DoiChuHo from "layouts/doi-chu-ho";
import Forbidden from "layouts/forbidden";

// @mui icons
import Icon from "@mui/material/Icon";

// Lấy role hiện tại
const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
const role = user ? user.vaiTro || (user.roles ? user.roles[0] : "") : "";

const routes = [
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

  // --- MENU CÔNG DÂN ---
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
  {
    type: "collapse",
    name: "Hộ Khẩu Của Tôi",
    key: "ho-khau-cua-toi",
    icon: <Icon fontSize="small">home</Icon>,
    route: "/ho-khau-cua-toi",
    component: <HoKhauCuaToi />,
    requireAuth: true,
  },

  // --- MENU CÁN BỘ ---
  ...(role === "CAN_BO"
    ? [
        {
          type: "collapse",
          name: "Quản Lý Phản Ánh",
          key: "quan-ly-phan-anh",
          icon: <Icon fontSize="small">dashboard</Icon>,
          route: "/quan-ly-phan-anh",
          component: <QuanLyPhanAnh />,
          requireAuth: true,
        },
        {
          type: "collapse",
          name: "Quản Lý Hộ Khẩu",
          key: "quan-ly-ho-khau",
          icon: <Icon fontSize="small">apartment</Icon>,
          route: "/quan-ly-ho-khau",
          component: <QuanLyHoKhau />,
          requireAuth: true,
        },
      ]
    : []),

  // --- CÁC ROUTE ẨN (Cần tham số ID) ---
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
    component: <PhanHoi />, // (Nếu bạn dùng trang này riêng)
    requireAuth: true,
    requiredRole: "CAN_BO",
  },
  {
    key: "chi-tiet-ho-khau",
    route: "/chi-tiet-ho-khau/:id",
    component: <ChiTietHoKhau />,
    requireAuth: true,
  },
  {
    key: "them-ho-khau",
    route: "/them-ho-khau",
    component: <FormHoKhau />,
    requireAuth: true,
    requiredRole: "CAN_BO",
  },
  {
    key: "sua-ho-khau",
    route: "/sua-ho-khau/:id",
    component: <FormHoKhau />,
    requireAuth: true,
    requiredRole: "CAN_BO",
  },

  // Trang lỗi
  {
    type: "route",
    name: "Không Có Quyền",
    key: "forbidden",
    route: "/forbidden",
    component: <Forbidden />,
  },

  {
    type: "route", // type route nghĩa là chỉ định tuyến, không hiện lên sidebar
    name: "Tách Hộ",
    key: "tach-ho",
    route: "/tach-ho/:id",
    component: <TachHo />,
  },
  {
    type: "route",
    name: "Nhập Hộ",
    key: "nhap-ho",
    route: "/nhap-ho/:id",
    component: <NhapHo />,
  },
  {
    type: "route",
    name: "Đổi Chủ Hộ",
    key: "doi-chu-ho",
    route: "/doi-chu-ho/:id",
    component: <DoiChuHo />,
  },
];

export default routes;
