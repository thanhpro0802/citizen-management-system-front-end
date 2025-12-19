/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================
*/

// react-router-dom components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import { Breadcrumbs as MuiBreadcrumbs } from "@mui/material";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function Breadcrumbs({ icon, title, route, light }) {
  const routes = route.slice(0, -1);

  // 1. Bộ từ điển dịch sang Tiếng Việt (Bao gồm cả key có dấu gạch ngang và khoảng trắng)
  const translateMap = {
    // --- KHỚP VỚI URL (có gạch nối) ---
    "ho-khau": "Quản Lý Hộ Khẩu",
    "nhan-khau": "Quản Lý Nhân Khẩu",
    "tao-moi": "Thêm Mới",
    "chinh-sua": "Cập Nhật Thông Tin",
    "tach-ho": "Tách Hộ",
    "nhap-ho": "Nhập Hộ",
    "doi-chu-ho": "Thay Đổi Chủ Hộ",
    "gui-phan-anh": "Gửi Phản Ánh",
    "lich-su-phan-anh": "Lịch Sử",
    dashboard: "Trang Chủ",
    "quan-ly-chung": "Quản Lý Chung",
    "phan-hoi": "Trả Lời Dân",
    "xu-ly-phan-anh": "Cán Bộ Xử Lý",

    // --- KHỚP VỚI TIÊU ĐỀ TỰ SINH (có khoảng trắng do template tự format) ---
    "ho khau": "Quản Lý Hộ Khẩu",
    "nhan khau": "Quản Lý Nhân Khẩu",
    "tao moi": "Thêm Mới",
    "chinh sua": "Cập Nhật Thông Tin",
    "tach ho": "Tách Hộ",
    "nhap ho": "Nhập Hộ",
    "doi chu ho": "Thay Đổi Chủ Hộ",
    "gui phan anh": "Gửi Phản Ánh",
    "lich su phan anh": "Lịch Sử",
    "quan ly chung": "Quản Lý Chung",
    "phan hoi": "Trả Lời Dân",
    "xu ly phan anh": "Cán Bộ Xử Lý",
  };

  // 2. Hàm kiểm tra ID (UUID dài > 20 ký tự và có số)
  const isUUID = (str) => {
    return str && str.length > 20 && /\d/.test(str);
  };

  // 3. Hàm lấy tên hiển thị đẹp
  const getDisplayName = (key) => {
    if (!key) return "";

    // Nếu là ID -> hiển thị "Chi Tiết"
    if (isUUID(key)) return "Chi Tiết";

    // Chuyển hết về chữ thường để so sánh cho chắc chắn
    const lowerKey = key.toLowerCase();

    // Tìm trong từ điển
    if (translateMap[lowerKey]) return translateMap[lowerKey];

    // Fallback: Nếu không tìm thấy thì viết hoa chữ cái đầu (giữ nguyên logic cũ)
    return key.replace("-", " ").replace(/^\w/, (c) => c.toUpperCase());
  };

  return (
    <MDBox mr={{ xs: 0, xl: 8 }}>
      <MuiBreadcrumbs
        sx={{
          "& .MuiBreadcrumbs-separator": {
            color: ({ palette: { white, grey } }) => (light ? white.main : grey[600]),
          },
        }}
      >
        <Link to="/">
          <MDTypography
            component="span"
            variant="body2"
            color={light ? "white" : "dark"}
            opacity={light ? 0.8 : 0.5}
            sx={{ lineHeight: 0 }}
          >
            <Icon>{icon}</Icon>
          </MDTypography>
        </Link>

        {routes.map((el) => {
          // Ẩn ID khỏi đường dẫn cha
          if (isUUID(el)) return null;

          return (
            <Link to={`/${el}`} key={el}>
              <MDTypography
                component="span"
                variant="button"
                fontWeight="regular"
                textTransform="capitalize"
                color={light ? "white" : "dark"}
                opacity={light ? 0.8 : 0.5}
                sx={{ lineHeight: 0 }}
              >
                {getDisplayName(el)}
              </MDTypography>
            </Link>
          );
        })}

        {/* Ẩn phần hiển thị tên trang hiện tại ở dòng Breadcrumb nhỏ (tránh lặp) */}
      </MuiBreadcrumbs>

      {/* Tiêu đề To (H6) duy nhất */}
      <MDTypography
        fontWeight="bold"
        textTransform="capitalize"
        variant="h6"
        color={light ? "white" : "dark"}
        noWrap
      >
        {getDisplayName(title)}
      </MDTypography>
    </MDBox>
  );
}

// Setting default values for the props of Breadcrumbs
Breadcrumbs.defaultProps = {
  light: false,
};

// Typechecking props for the Breadcrumbs
Breadcrumbs.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  route: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  light: PropTypes.bool,
};

export default Breadcrumbs;
