import { useEffect } from "react";

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

// Material Dashboard 2 React example components
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";

// Custom styles for the Sidenav
import SidenavRoot from "examples/Sidenav/SidenavRoot";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";

// Auth context
import { useAuth } from "context/authContext";
// import { coRole } from "services/authService"; // <-- KHÔNG CẦN DÙNG CÁI NÀY NỮA

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller;
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");

  // Get auth state
  const [authState] = useAuth();
  const { isAuthenticated, user } = authState;

<<<<<<< Updated upstream
=======
  // Lấy role hiện tại của user (Đảm bảo lấy đúng trường vaiTro từ API trả về)
  // Nếu user null thì coi như là CONG_DAN
  // Lấy role từ user object. Kiểm tra cả 'vaiTro' và 'role' tùy theo Backend trả về
  const currentUserRole =
    user?.vaiTro || user?.role || (user?.roles && user.roles[0]) || "CONG_DAN";

  // Thêm dòng log này để kiểm tra chính xác trình duyệt đang đọc role gì
  console.log("Quyền hiện tại của tôi là:", currentUserRole);

  // State lưu số yêu cầu chờ xử lý
  const [pendingYeuCauCount, setPendingYeuCauCount] = useState(0);

>>>>>>> Stashed changes
  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    window.addEventListener("resize", handleMiniSidenav);
    handleMiniSidenav();
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

<<<<<<< Updated upstream
  // Render all the routes from the routes.js (All the visible items on the Sidenav)
=======
  // Fetch số yêu cầu chờ xử lý (Logic mới: Check theo mảng quyền quản lý)
  useEffect(() => {
    const fetchPendingCount = async () => {
      // Danh sách các role được phép xem thông báo chờ xử lý
      const ROLES_QUAN_LY = [
        "ADMIN",
        "CAN_BO_HO_KHAU",
        "CAN_BO_NHAN_KHAU",
        "TO_TRUONG",
        "CAN_BO_PHAN_ANH",
        "TO_PHO",
      ];

      if (isAuthenticated && user && ROLES_QUAN_LY.includes(currentUserRole)) {
        try {
          const count = await demYeuCauChoXuLy();
          setPendingYeuCauCount(count || 0);
        } catch (error) {
          // console.error("Lỗi khi lấy số yêu cầu chờ xử lý:", error);
        }
      }
    };
    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user, currentUserRole]);

  // Render các route
>>>>>>> Stashed changes
  const renderRoutes = routes
    .filter((route) => {
      // 1. Ẩn các route không phải type "collapse"
      if (route.type !== "collapse") return false;

      // 2. Logic ẩn/hiện trang Auth
      if (isAuthenticated && (route.key === "sign-in" || route.key === "sign-up")) {
        return false;
      }
      if (!isAuthenticated && (route.key === "sign-in" || route.key === "sign-up")) {
        return true;
      }

      // --- [QUAN TRỌNG] LOGIC CHECK QUYỀN MỚI ---

      // Ưu tiên 1: Check theo mảng allowedRoles (Chuẩn mới)
      if (route.allowedRoles) {
        return route.allowedRoles.includes(currentUserRole);
      }

      // Ưu tiên 2: Check theo requiredRole (Hỗ trợ code cũ nếu sót)
      if (route.requiredRole) {
        return route.requiredRole === currentUserRole;
      }

      // 3. Check requireAuth chung chung
      if (route.requireAuth) {
        return isAuthenticated;
      }

      // Mặc định hiện
      return true;
    })
    .map(({ type, name, icon, title, noCollapse, key, href, route }) => {
      let returnValue;

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
            />
          </Link>
        ) : (
          <NavLink key={key} to={route}>
            <SidenavCollapse name={name} icon={icon} active={key === collapseName} />
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
              fontSize: "1.25rem",
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
    </SidenavRoot>
  );
}

Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
