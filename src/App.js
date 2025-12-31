import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

// MUI
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Dashboard
import MDBox from "components/MDBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Routes & Context
import routes from "routes";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Assets
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

// Pages đặc biệt
import ChiTietPhanAnh from "layouts/chi-tiet-phan-anh";

// Auth
import { setUnauthorizedCallback } from "services/authService";
// Lưu ý: Nếu ProtectedRoute.js của bạn vẫn chặn cứng role cũ, hãy tạm thời không bọc nó ở đây
// hoặc cập nhật file ProtectedRoute.js đó sau.
import ProtectedRoute from "components/ProtectedRoute";

// Chatbot
import { ChatbotWidget } from "components/Chatbot";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;

  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);

  /* ================= RTL CACHE ================= */
  useMemo(() => {
    const cache = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });
    setRtlCache(cache);
  }, []);

  /* ================= SIDE NAV ================= */
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  /* ================= EFFECTS ================= */
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [location.pathname]);

  useEffect(() => {
    document.title = "Hệ thống Quản lý Công dân";
  }, [location.pathname]);

  useEffect(() => {
    setUnauthorizedCallback(() => {
      navigate("/authentication/sign-in");
    });
  }, [navigate]);

  /* ================= ROUTE BUILDER ================= */
  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        // 1. Lấy thông tin user an toàn
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;

        // 2. Lấy Role từ mọi trường có thể (vaiTro, role, roles)
        const userRole =
          user?.vaiTro ||
          user?.role ||
          (Array.isArray(user?.roles) ? user.roles[0] : user?.roles) ||
          "";

        // 3. Logic kiểm tra quyền truy cập
        let hasAccess = true;

        if (route.requireAuth) {
          if (!user) {
            hasAccess = false; // Chưa đăng nhập
          } else if (route.allowedRoles) {
            // Kiểm tra trong mảng allowedRoles (Ưu tiên)
            hasAccess = route.allowedRoles.includes(userRole);
          } else if (route.requiredRole) {
            // Tương thích ngược với logic cũ
            hasAccess = route.requiredRole === userRole;
          }
        }

        return (
          <Route
            exact
            path={route.route}
            element={
              hasAccess
                ? route.component
                : // Nếu không có quyền, log ra để debug và chuyển hướng
                  (console.log(`Access Denied for ${route.route}. UserRole: ${userRole}`),
                  (<Navigate to="/forbidden" />))
            }
            key={route.key}
          />
        );
      }
      return null;
    });

  /* ================= RENDER ================= */
  const content = (
    <>
      <CssBaseline />

      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="Hệ thống Quản lý Công dân"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
        </>
      )}

      <Routes>
        {/* Render toàn bộ routes từ file routes.js */}
        {getRoutes(routes)}

        {/* Route chi tiết (đảm bảo không bị đè bởi catch-all) */}
        <Route path="/chi-tiet-phan-anh/:id" element={<ChiTietPhanAnh />} />

        {/* Catch-all: Nếu không khớp trang nào, về trang mặc định */}
        <Route path="*" element={<Navigate to="/gui-phan-anh" />} />
      </Routes>

      <ChatbotWidget />
    </>
  );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>{content}</ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>{content}</ThemeProvider>
  );
}
