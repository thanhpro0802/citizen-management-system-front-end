import { useEffect, useState } from "react";

// react-router-dom components
import { useLocation, NavLink } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";

// Custom styles for the Sidenav
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";

// Auth context
import { useAuth } from "context/authContext";
import { coRole } from "services/authService";

// API để đếm yêu cầu chờ xử lý
import { demYeuCauChoXuLy } from "services/yeuCauCuTruService";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");

  // Get auth state
  const [authState] = useAuth();
  const { isAuthenticated, user } = authState;

  // State lưu số yêu cầu chờ xử lý
  const [pendingYeuCauCount, setPendingYeuCauCount] = useState(0);

  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    /** 
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  // Fetch số yêu cầu chờ xử lý nếu là cán bộ
  useEffect(() => {
    const fetchPendingCount = async () => {
      if (isAuthenticated && user && coRole("CAN_BO", user)) {
        try {
          const count = await demYeuCauChoXuLy();
          setPendingYeuCauCount(count || 0);
        } catch (error) {
          console.error("Lỗi khi lấy số yêu cầu chờ xử lý:", error);
        }
      }
    };
    fetchPendingCount();
    // Refresh mỗi 30 giây
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = routes
    .filter((route) => {
      // Ẩn các route không phải type "collapse"
      if (route.type !== "collapse") return false;

      // Ẩn trang đăng nhập/đăng ký nếu đã đăng nhập
      if (isAuthenticated && (route.key === "sign-in" || route.key === "sign-up")) {
        return false;
      }

      // Hiện trang đăng nhập/đăng ký nếu chưa đăng nhập
      if (!isAuthenticated && (route.key === "sign-in" || route.key === "sign-up")) {
        return true;
      }

      // Kiểm tra nếu route yêu cầu role cụ thể
      if (route.requiredRole) {
        return coRole(route.requiredRole, user);
      }

      // Kiểm tra nếu route yêu cầu đăng nhập
      if (route.requireAuth) {
        return isAuthenticated;
      }

      // Các route không yêu cầu gì đặc biệt thì hiển thị
      return true;
    })
    .map(({ type, name, icon, title, noCollapse, key, href, route }) => {
      let returnValue;

      // Xác định badge cho route "quan-ly-yeu-cau-cu-tru"
      const badge = key === "quan-ly-yeu-cau-cu-tru" ? pendingYeuCauCount : null;

      if (type === "collapse") {
        returnValue = href ? (
          <Link
            href={href}
            key={key}
            target="_blank"
            rel="noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <SidenavCollapse
              name={name}
              icon={icon}
              active={key === collapseName}
              noCollapse={noCollapse}
              badge={badge}
            />
          </Link>
        ) : (
          <NavLink key={key} to={route}>
            <SidenavCollapse name={name} icon={icon} active={key === collapseName} badge={badge} />
          </NavLink>
        );
      } else if (type === "title") {
        returnValue = (
          <MDTypography
            key={key}
            color={textColor}
            display="block"
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            pl={3}
            mt={2}
            mb={1}
            ml={1}
          >
            {title}
          </MDTypography>
        );
      } else if (type === "divider") {
        returnValue = (
          <Divider
            key={key}
            light={
              (!darkMode && !whiteSidenav && !transparentSidenav) ||
              (darkMode && !transparentSidenav && whiteSidenav)
            }
          />
        );
      }

      return returnValue;
    });

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </MDTypography>
        </MDBox>

        {/* ✅ TEXT 2 DÒNG - MÀU TRẮNG/DARK */}
        <MDBox
          component={NavLink}
          to="/"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          py={1.5}
        >
          <MDTypography
            component="h5"
            variant="h5"
            fontWeight="bold"
            color={textColor}
            sx={{
              fontSize: "1.25rem", // 20px
              lineHeight: 1.4,
              textAlign: "center",
              letterSpacing: "0.02em",
            }}
          >
            Hệ thống Quản lý
            <br />
            Công dân
          </MDTypography>
        </MDBox>
      </MDBox>
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />
      <List>{renderRoutes}</List>
      {/*<MDBox p={2} mt="auto">*/}
      {/*  <MDButton*/}
      {/*    component="a"*/}
      {/*    href="https://www.creative-tim.com/product/material-dashboard-pro-react"*/}
      {/*    target="_blank"*/}
      {/*    rel="noreferrer"*/}
      {/*    variant="gradient"*/}
      {/*    color={sidenavColor}*/}
      {/*    fullWidth*/}
      {/*  >*/}
      {/*    upgrade to pro*/}
      {/*  </MDButton>*/}
      {/*</MDBox>*/}
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
