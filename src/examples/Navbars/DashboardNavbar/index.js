import { useState, useEffect } from "react";

// react-router components
import { useLocation, Link, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import Badge from "@mui/material/Badge";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

// --- IMPORT SERVICE ---
import { getThongBaoCuaToi, danhDauDaXem } from "services/thongBaoService";
import { dangXuat, layTenHienThiRole } from "services/authService";
import { useAuth, setLogout } from "context/authContext";

// Thêm prop customTitle vào đây
function DashboardNavbar({ absolute, light, isMini, customTitle }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);

  // Lấy đường dẫn hiện tại
  const route = useLocation().pathname.split("/").slice(1);
  const navigate = useNavigate();

  // Auth context
  const [authState, authDispatch] = useAuth();
  const { isAuthenticated, user } = authState;

  // User menu state
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  // --- STATE CHO THÔNG BÁO ---
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // --- HÀM DỊCH TIÊU ĐỀ MẶC ĐỊNH ---
  const getVietnameseTitle = (slug) => {
    switch (slug) {
      case "gui-phan-anh":
        return "Gửi Phản Ánh";
      case "lich-su-phan-anh":
        return "Lịch Sử Phản Ánh";
      case "xu-ly-phan-anh":
        return "Cán Bộ Xử Lý";
      case "phan-hoi":
        return "Trả Lời Dân";
      case "chi-tiet-phan-anh":
        return "Chi Tiết Phản Ánh";
      default:
        return slug ? slug.replace("-", " ") : "";
    }
  };

  // --- LOGIC XỬ LÝ CUSTOM TITLE (QUAN TRỌNG) ---
  // Tạo bản sao của route để hiển thị Breadcrumb
  const displayRoute = [...route];

  // Lấy tiêu đề mặc định từ URL
  let pageTitle = getVietnameseTitle(displayRoute[displayRoute.length - 1]);

  // Nếu có customTitle được truyền vào (từ trang Chi tiết), ghi đè lên
  if (customTitle) {
    pageTitle = customTitle;
    // Thay thế phần tử cuối của breadcrumb bằng Title thật
    displayRoute[displayRoute.length - 1] = customTitle;
  }
  // ----------------------------------------------

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.daXem) {
        await danhDauDaXem(notification.maThongBao);
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications((prevList) =>
          prevList.map((item) =>
            item.maThongBao === notification.maThongBao ? { ...item, daXem: true } : item
          )
        );
      }
      handleCloseMenu();
      if (notification.maPhanAnhLienQuan) {
        navigate(`/chi-tiet-phan-anh/${notification.maPhanAnhLienQuan}`);
      }
    } catch (error) {
      console.error("Lỗi xử lý thông báo:", error);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getThongBaoCuaToi();
        if (Array.isArray(response.data)) {
          setNotifications(response.data);
          const count = response.data.filter((n) => !n.daXem).length;
          setUnreadCount(count);
        }
      } catch (error) {
        console.error("Lỗi tải thông báo:", error);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }
    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);
  const handleUserMenuOpen = (event) => setUserMenuAnchor(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);

  const handleLogout = () => {
    dangXuat();
    setLogout(authDispatch);
    handleUserMenuClose();
    navigate("/authentication/sign-in");
  };

  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      {notifications.length > 0 ? (
        notifications.map((item) => (
          <MDBox
            key={item.maThongBao}
            onClick={() => handleNotificationClick(item)}
            sx={{ cursor: "pointer" }}
          >
            <NotificationItem
              icon={<Icon>notifications</Icon>}
              title={item.noiDung}
              style={{ fontWeight: item.daXem ? "normal" : "bold" }}
            />
          </MDBox>
        ))
      ) : (
        <MDBox p={2}>
          <span style={{ fontSize: "14px" }}>Không có thông báo mới</span>
        </MDBox>
      )}
    </Menu>
  );

  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;
      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }
      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          {/* CẬP NHẬT COMPONENT BREADCRUMBS VỚI TITLE MỚI */}
          <Breadcrumbs
            icon="home"
            title={pageTitle} // Sử dụng tiêu đề đã xử lý
            route={displayRoute} // Sử dụng mảng route đã xử lý
            light={light}
          />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox pr={1}>
              <MDInput label="Search here" />
            </MDBox>
            <MDBox color={light ? "white" : "inherit"}>
              {isAuthenticated ? (
                <>
                  <IconButton
                    sx={navbarIconButton}
                    size="small"
                    disableRipple
                    onClick={handleUserMenuOpen}
                  >
                    <Icon sx={iconsStyle}>account_circle</Icon>
                  </IconButton>
                  <Menu
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={handleUserMenuClose}
                    sx={{ mt: 2 }}
                  >
                    <MDBox px={2} py={1}>
                      <MDBox mb={1}>
                        <strong>CCCD:</strong> {user?.cccd || "N/A"}
                      </MDBox>
                      <MDBox mb={1}>
                        <strong>Vai trò:</strong> {layTenHienThiRole(user?.roles)}
                      </MDBox>
                    </MDBox>
                    <NotificationItem
                      icon={<Icon>logout</Icon>}
                      title="Đăng Xuất"
                      onClick={handleLogout}
                    />
                  </Menu>
                </>
              ) : (
                <Link to="/authentication/sign-in">
                  <IconButton sx={navbarIconButton} size="small" disableRipple>
                    <Icon sx={iconsStyle}>login</Icon>
                  </IconButton>
                </Link>
              )}

              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>

              {isAuthenticated && (
                <>
                  <IconButton
                    size="small"
                    disableRipple
                    color="inherit"
                    sx={navbarIconButton}
                    aria-controls="notification-menu"
                    aria-haspopup="true"
                    variant="contained"
                    onClick={handleOpenMenu}
                  >
                    <Badge badgeContent={unreadCount} color="error" size="small">
                      <Icon sx={iconsStyle}>notifications</Icon>
                    </Badge>
                  </IconButton>
                  {renderMenu()}
                </>
              )}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
  customTitle: "", // Mặc định là rỗng
};

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
  customTitle: PropTypes.string, // Khai báo kiểu dữ liệu
};

export default DashboardNavbar;
