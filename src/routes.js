/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

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
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import GuiPhanAnh from "layouts/phan-anh";
import LichSuPhanAnh from "layouts/lich-su-phan-anh";
import XuLyPhanAnh from "layouts/xu-ly-phan-anh";
import PhanHoi from "layouts/phan-hoi";
import QuanLyPhanAnh from "layouts/quan-ly-phan-anh";

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
  },
  {
    type: "collapse",
    name: "Lịch Sử Phản Ánh",
    key: "lich-su-phan-anh",
    icon: <Icon fontSize="small">history</Icon>,
    route: "/lich-su-phan-anh",
    component: <LichSuPhanAnh />,
  },
  {
    type: "collapse",
    name: "Cán Bộ Xử Lý",
    key: "xu-ly-phan-anh",
    icon: <Icon fontSize="small">engineering</Icon>,
    route: "/xu-ly-phan-anh",
    component: <XuLyPhanAnh />,
  },
  {
    type: "collapse",
    name: "Trả Lời Dân",
    key: "phan-hoi",
    icon: <Icon fontSize="small">check_circle</Icon>,
    route: "/phan-hoi",
    component: <PhanHoi />,
  },
  {
    type: "collapse",
    name: "Quản Lý Chung",
    key: "quan-ly-phan-anh",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/quan-ly-phan-anh",
    component: <QuanLyPhanAnh />,
  },
];

export default routes;
