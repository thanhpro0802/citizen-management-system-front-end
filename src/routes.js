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
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import GuiPhanAnh from "layouts/phan-anh";
import LichSuPhanAnh from "layouts/lich-su-phan-anh";
import XuLyPhanAnh from "layouts/xu-ly-phan-anh";
import PhanHoi from "layouts/phan-hoi";
import QuanLyPhanAnh from "layouts/quan-ly-phan-anh";
import Forbidden from "layouts/forbidden";
import HoKhauList from "layouts/ho-khau";
import HoKhauDetail from "layouts/ho-khau/Detail";
import HoKhauForm from "layouts/ho-khau/Form";
import TachHo from "layouts/ho-khau/TachHo";
import NhapHo from "layouts/ho-khau/NhapHo";
import ThayDoiChuHo from "layouts/ho-khau/DoiChuHo";

// @mui icons
import Icon from "@mui/material/Icon";

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
    name: "Cán Bộ Xử Lý",
    key: "xu-ly-phan-anh",
    icon: <Icon fontSize="small">engineering</Icon>,
    route: "/xu-ly-phan-anh",
    component: <XuLyPhanAnh />,
    requireAuth: true,
    requiredRole: "CAN_BO",
  },
  {
    type: "collapse",
    name: "Trả Lời Dân",
    key: "phan-hoi",
    icon: <Icon fontSize="small">check_circle</Icon>,
    route: "/phan-hoi",
    component: <PhanHoi />,
    requireAuth: true,
    requiredRole: "CAN_BO",
  },
  {
    type: "collapse",
    name: "Quản Lý Chung",
    key: "quan-ly-phan-anh",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/quan-ly-phan-anh",
    component: <QuanLyPhanAnh />,
    requireAuth: true,
    requiredRole: "CAN_BO",
  },
  {
    type: "route",
    name: "Không Có Quyền",
    key: "forbidden",
    route: "/forbidden",
    component: <Forbidden />,
  },
  {
    type: "collapse",
    name: "Hộ Khẩu",
    key: "ho-khau",
    icon: <Icon fontSize="small">home</Icon>,
    route: "/ho-khau",
    component: <HoKhauList />,
    // requireAuth: true,
    // requiredRole: "CAN_BO",
  },
  {
    route: "/ho-khau/tao-moi",
    component: <HoKhauForm />,
    // requireAuth: true,
    // requiredRole: "CAN_BO",
  },
  {
    route: "/ho-khau/:id",
    component: <HoKhauDetail />,
    requireAuth: true,
    requiredRole: "CAN_BO",
  },
  {
    route: "/ho-khau/:id/chinh-sua",
    component: <HoKhauForm />,
    requireAuth: true,
    requiredRole: "CAN_BO",
  },
  {
    route: "/ho-khau/:id/tach-ho",
    component: <TachHo />,
    requireAuth: true,
    requiredRole: "CAN_BO",
  },
  {
    route: "/ho-khau/:id/nhap-ho",
    component: <NhapHo />,
    requireAuth: true,
    requiredRole: "CAN_BO",
  },
  {
    route: "/ho-khau/:id/doi-chu-ho",
    component: <ThayDoiChuHo />,
    requireAuth: true,
    requiredRole: "CAN_BO",
  },
  {
    type: "collapse",
    name: "Hộ Khẩu Của Tôi",
    key: "ho-khau-cua-toi",
    icon: <Icon fontSize="small">person_pin</Icon>, // Icon khác cho dễ nhận diện
    route: "/ho-khau-cua-toi",
    component: <HoKhauDetail isMe={true} />, // Truyền prop isMe để nhận biết
    requireAuth: true,
    // Không yêu cầu role CAN_BO, ai có tài khoản cũng xem được (nếu đã liên kết nhân khẩu)
  },
];

export default routes;
