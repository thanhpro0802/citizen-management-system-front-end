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

  // Trang lỗi
  {
    type: "route",
    name: "Không Có Quyền",
    key: "forbidden",
    route: "/forbidden",
    component: <Forbidden />,
  },
];

export default routes;
