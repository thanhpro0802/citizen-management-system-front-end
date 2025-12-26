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
import ProtectedRoute from "components/ProtectedRoute";

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
    document.title = "Hộ khẩu - Nhân khẩu";
  }, [location.pathname]);

  // Khi backend trả 401 → về login
  useEffect(() => {
    setUnauthorizedCallback(() => {
      navigate("/authentication/sign-in");
    });
  }, [navigate]);

  /* ================= ROUTE BUILDER ================= */
  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) return getRoutes(route.collapse);

      if (route.route) {
        let element = route.component;

        if (route.requireAuth || route.requiredRole) {
          element = (
            <ProtectedRoute requiredRole={route.requiredRole}>{route.component}</ProtectedRoute>
          );
        }

        return <Route exact path={route.route} element={element} key={route.key} />;
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
            brandName="Material Dashboard 2"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
        </>
      )}

      <Routes>
        {getRoutes(routes)}

        {/* Route đặc biệt */}
        <Route path="/chi-tiet-phan-anh/:id" element={<ChiTietPhanAnh />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/gui-phan-anh" />} />
      </Routes>
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
