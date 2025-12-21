import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import routes from "routes";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

// IMPORT TRANG CHI TIẾT
import ChiTietPhanAnh from "layouts/chi-tiet-phan-anh";

// Auth service
import { setUnauthorizedCallback } from "services/authService";

// Protected Route
import ProtectedRoute from "components/ProtectedRoute";

export default function App() {
  const navigate = useNavigate();
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
  const { pathname } = useLocation();

  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });
    setRtlCache(cacheRtl);
  }, []);

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

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  useEffect(() => {
    document.title = "Hộ khẩu - Nhân khẩu";
  }, [pathname]);

  // Set up unauthorized callback for auth service
  useEffect(() => {
    setUnauthorizedCallback(() => {
      navigate("/authentication/sign-in");
    });
  }, [navigate]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }
      if (route.route) {
        // Wrap component with ProtectedRoute if authentication or role is required
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

  // const configsButton = (
  //   <MDBox
  //     display="flex"
  //     justifyContent="center"
  //     alignItems="center"
  //     width="3.25rem"
  //     height="3.25rem"
  //     bgColor="white"
  //     shadow="sm"
  //     borderRadius="50%"
  //     position="fixed"
  //     right="2rem"
  //     bottom="2rem"
  //     zIndex={99}
  //     color="dark"
  //     sx={{ cursor: "pointer" }}
  //     onClick={handleConfiguratorOpen}
  //   >
  //     <Icon fontSize="small" color="inherit">
  //       settings
  //     </Icon>
  //   </MDBox>
  // );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
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
            {/*<Configurator />*/}
            {/*{configsButton}*/}
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Routes>
          {getRoutes(routes)}
          <Route path="/chi-tiet-phan-anh/:id" element={<ChiTietPhanAnh />} />
          <Route path="*" element={<Navigate to="/gui-phan-anh" />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
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
          {/*{configsButton}*/}
        </>
      )}
      {layout === "vr" && <Configurator />}

      {/* --- PHẦN ROUTER QUAN TRỌNG NHẤT --- */}
      <Routes>
        {getRoutes(routes)}

        {/* Route Chi Tiết phải nằm TRƯỚC Route * */}
        <Route path="/chi-tiet-phan-anh/:id" element={<ChiTietPhanAnh />} />

        {/* Route Mặc định (Catch-all) phải nằm CUỐI CÙNG */}
        <Route path="*" element={<Navigate to="/gui-phan-anh" />} />
      </Routes>
      {/* ----------------------------------- */}
    </ThemeProvider>
  );
}
