* Material Dashboard 2 React - v2.2.0

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from 'layouts/dashboard';
import Tables from 'layouts/tables';
import Billing from 'layouts/billing';
import RTL from 'layouts/rtl';
import Notifications from 'layouts/notifications';
import Profile from 'layouts/profile';
import SignIn from 'layouts/authentication/sign-in';
import SignUp from 'layouts/authentication/sign-up';

// Quản lý nhân khẩu
import NhanKhauList from 'layouts/nhan-khau';
import NhanKhauForm from 'layouts/nhan-khau/form';
import NhanKhauDetail from 'layouts/nhan-khau/detail';
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
import Icon from '@mui/material/Icon';

// Lấy role hiện tại
const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
const role = user ? user.vaiTro || (user.roles ? user.roles[0] : "") : "";

const routes = [
  {
    type: 'collapse',
    name: 'Dashboard',
    key: 'dashboard',
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: '/dashboard',
    component: <Dashboard />,
  },
  {
    type: 'collapse',
    name: 'Quản lý nhân khẩu',
    key: 'nhan-khau',
    icon: <Icon fontSize="small">people</Icon>,
    route: '/nhan-khau',
    component: <NhanKhauList />,
  },

  // --- MENU CÔNG DÂN ---
  {
    type: 'route',
    name: 'Thêm nhân khẩu',
    key: 'nhan-khau-create',
    route: '/nhan-khau/create',
    component: <NhanKhauForm />,
  },
  {
    type: 'route',
    name: 'Chỉnh sửa nhân khẩu',
    key: 'nhan-khau-edit',
    route: '/nhan-khau/edit/:id',
    component: <NhanKhauForm />,
  },
  {
    type: 'route',
    name: 'Chi tiết nhân khẩu',
    key: 'nhan-khau-detail',
    route: '/nhan-khau/:id',
    component: <NhanKhauDetail />,
  },
  {
    type: 'collapse',
    name: 'Tables',
    key: 'tables',
    icon: <Icon fontSize="small">table_view</Icon>,
    route: '/tables',
    component: <Tables />,
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
