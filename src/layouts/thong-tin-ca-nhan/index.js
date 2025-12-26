/**
 * src/layouts/thong-tin-ca-nhan/index.js
 * Trang thông tin cá nhân tùy chỉnh (Custom UI)
 * Đã xóa chức năng chỉnh sửa SĐT (Chế độ Xem).
 */

import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Service
import nhanKhauService from "services/nhanKhauService";

// Ảnh mặc định
import defaultAvatar from "assets/images/bruce-mars.jpg";

// Helper: Dòng thông tin nhỏ (Đơn giản hóa, bỏ action button)
const InfoRow = ({ icon, label, value }) => (
  <MDBox
    display="flex"
    alignItems="flex-start"
    py={1.5}
    borderBottom="1px dashed #e0e0e0"
    width="100%"
  >
    <MDBox
      mr={2}
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="2.5rem"
      height="2.5rem"
      borderRadius="50%"
      bgColor="grey-100"
      color="info"
    >
      <Icon fontSize="small">{icon}</Icon>
    </MDBox>
    <MDBox display="flex" flexDirection="column">
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {label}
      </MDTypography>
      <MDTypography variant="body2" fontWeight="bold" color="dark">
        {value || "---"}
      </MDTypography>
    </MDBox>
  </MDBox>
);

InfoRow.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

function ThongTinCaNhan() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ nhanKhau: null, hoKhau: null });
  const [accountPhone, setAccountPhone] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "info" });

  useEffect(() => {
    fetchData();
    getAccountInfo();
  }, []);

  const getAccountInfo = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        // Lấy SĐT hiển thị từ account (nếu có)
        setAccountPhone(user.soDienThoai || user.phoneNumber || user.phone || "");
      }
    } catch (e) {
      console.error("Lỗi lấy thông tin tài khoản:", e);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await nhanKhauService.layThongTinNhanKhauCuaToi();
      if (result && result.nhanKhau) {
        setData({
          nhanKhau: result.nhanKhau,
          hoKhau: result.hoKhau,
        });
      } else {
        setAlert({
          show: true,
          message: "Không tìm thấy dữ liệu nhân khẩu liên kết.",
          type: "warning",
        });
      }
    } catch (err) {
      console.error(err);
      setAlert({ show: true, message: "Lỗi kết nối: " + err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Chưa cập nhật";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const renderStatus = (status) => {
    const map = {
      THUONG_TRU: { label: "Thường Trú", color: "success" },
      TAM_TRU: { label: "Tạm Trú", color: "info" },
      TAM_VANG: { label: "Tạm Vắng", color: "warning" },
      KHAI_TU: { label: "Đã Mất", color: "error" },
      UNKNOWN: { label: "Chưa Xác Định", color: "default" },
    };
    const current = map[status] || map.UNKNOWN;

    return (
      <Chip
        label={current.label}
        color={current.color}
        variant="filled"
        size="small"
        sx={{ color: "#fff", fontWeight: "bold", textTransform: "uppercase", mt: 1 }}
      />
    );
  };

  const { nhanKhau, hoKhau } = data;

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox
        position="relative"
        minHeight="300px"
        borderRadius="xl"
        mx={2}
        mt={2}
        sx={{
          background: "linear-gradient(195deg, #49a3f1, #1A73E8)",
          boxShadow: ({ boxShadows: { md } }) => md,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MDTypography variant="h3" color="white" opacity={0.8}>
          HỒ SƠ CÔNG DÂN ĐIỆN TỬ
        </MDTypography>
      </MDBox>

      <MDBox px={3} mt={-10} mb={4}>
        {alert.show && (
          <MDBox mb={2}>
            <MDAlert
              color={alert.type}
              dismissible
              onClose={() => setAlert({ ...alert, show: false })}
            >
              {alert.message}
            </MDAlert>
          </MDBox>
        )}

        {loading ? (
          <Card sx={{ p: 5, textAlign: "center" }}>
            <CircularProgress color="info" />
          </Card>
        ) : nhanKhau ? (
          <Card sx={{ overflow: "visible" }}>
            <Grid container>
              {/* Cột Trái */}
              <Grid item xs={12} md={4} sx={{ borderRight: { md: "1px solid #f0f2f5" } }}>
                <MDBox
                  p={4}
                  textAlign="center"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Avatar
                    src={defaultAvatar}
                    alt="profile-avatar"
                    sx={{
                      width: 150,
                      height: 150,
                      boxShadow: "0 4px 20px 0 rgba(0,0,0,0.14)",
                      border: "4px solid #fff",
                      mb: 2,
                    }}
                  />
                  <MDTypography variant="h4" fontWeight="bold" textTransform="capitalize" mt={1}>
                    {nhanKhau.hoTen}
                  </MDTypography>
                  {renderStatus(nhanKhau.trangThai)}
                </MDBox>
              </Grid>

              {/* Cột Phải */}
              <Grid item xs={12} md={8}>
                <MDBox p={4}>
                  <MDTypography variant="h5" fontWeight="medium" mb={3}>
                    Thông Tin Chi Tiết
                  </MDTypography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <InfoRow icon="fingerprint" label="Số CCCD / CMND" value={nhanKhau.soCCCD} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <InfoRow
                        icon="cake"
                        label="Ngày Sinh"
                        value={formatDate(nhanKhau.ngaySinh)}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <InfoRow icon="wc" label="Giới Tính" value={nhanKhau.gioiTinh} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <InfoRow icon="phone" label="Số Điện Thoại" value={accountPhone} />
                    </Grid>

                    <Grid item xs={12}>
                      <InfoRow
                        icon="location_on"
                        label="Địa Chỉ Thường Trú"
                        value={hoKhau?.diaChi || "Chưa có thông tin"}
                      />
                    </Grid>
                  </Grid>
                </MDBox>
              </Grid>
            </Grid>
          </Card>
        ) : (
          <Card sx={{ p: 3 }}>
            <MDTypography variant="body1" textAlign="center">
              Không có dữ liệu hiển thị
            </MDTypography>
          </Card>
        )}
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default ThongTinCaNhan;
