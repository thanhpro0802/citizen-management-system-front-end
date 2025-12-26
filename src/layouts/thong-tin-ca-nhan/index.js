/**
 * Component hiển thị thông tin nhân khẩu của công dân đang đăng nhập
 * Bao gồm: Thông tin cá nhân + Thông tin hộ khẩu + Danh sách thành viên cùng hộ
 * Chế độ: Chỉ xem (Read-only)
 */

import { useState, useEffect } from "react";
// 1. Thêm import PropTypes
import PropTypes from "prop-types";
import { Card, Grid, CircularProgress, Alert, Divider } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import nhanKhauService from "services/nhanKhauService";

// Component hiển thị thông tin chi tiết một nhân khẩu (read-only)
function NhanKhauInfoCard({ nhanKhau, title, isCurrent = false }) {
  if (!nhanKhau) return null;

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  return (
    <Card sx={{ mb: 2 }}>
      <MDBox p={3}>
        <MDTypography variant="h6" fontWeight="medium" mb={2}>
          {title}{" "}
          {isCurrent && (
            <MDTypography variant="caption" color="info">
              (Bạn)
            </MDTypography>
          )}
        </MDTypography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <MDTypography variant="caption" color="text" fontWeight="regular">
              Mã Nhân Khẩu
            </MDTypography>
            <MDTypography variant="body2" fontWeight="medium">
              {nhanKhau.maNhanKhau || "N/A"}
            </MDTypography>
          </Grid>

          <Grid item xs={12} md={6}>
            <MDTypography variant="caption" color="text" fontWeight="regular">
              Họ Tên
            </MDTypography>
            <MDTypography variant="body2" fontWeight="medium">
              {nhanKhau.hoTen || "N/A"}
            </MDTypography>
          </Grid>

          <Grid item xs={12} md={6}>
            <MDTypography variant="caption" color="text" fontWeight="regular">
              Số CCCD
            </MDTypography>
            <MDTypography variant="body2" fontWeight="medium">
              {nhanKhau.soCCCD || "N/A"}
            </MDTypography>
          </Grid>

          <Grid item xs={12} md={6}>
            <MDTypography variant="caption" color="text" fontWeight="regular">
              Ngày Sinh
            </MDTypography>
            <MDTypography variant="body2" fontWeight="medium">
              {formatDate(nhanKhau.ngaySinh)}
            </MDTypography>
          </Grid>

          <Grid item xs={12} md={6}>
            <MDTypography variant="caption" color="text" fontWeight="regular">
              Giới Tính
            </MDTypography>
            <MDTypography variant="body2" fontWeight="medium">
              {nhanKhau.gioiTinh || "N/A"}
            </MDTypography>
          </Grid>

          <Grid item xs={12} md={6}>
            <MDTypography variant="caption" color="text" fontWeight="regular">
              Dân Tộc
            </MDTypography>
            <MDTypography variant="body2" fontWeight="medium">
              {nhanKhau.danToc || "N/A"}
            </MDTypography>
          </Grid>

          <Grid item xs={12} md={6}>
            <MDTypography variant="caption" color="text" fontWeight="regular">
              Quê Quán
            </MDTypography>
            <MDTypography variant="body2" fontWeight="medium">
              {nhanKhau.queQuan || "N/A"}
            </MDTypography>
          </Grid>

          <Grid item xs={12} md={6}>
            <MDTypography variant="caption" color="text" fontWeight="regular">
              Quan Hệ Với Chủ Hộ
            </MDTypography>
            <MDTypography variant="body2" fontWeight="medium">
              {nhanKhau.quanHeVoiChuHo || "N/A"}
            </MDTypography>
          </Grid>

          <Grid item xs={12} md={6}>
            <MDTypography variant="caption" color="text" fontWeight="regular">
              Trạng Thái
            </MDTypography>
            <MDTypography variant="body2" fontWeight="medium">
              {nhanKhau.trangThai || "N/A"}
            </MDTypography>
          </Grid>
        </Grid>
      </MDBox>
    </Card>
  );
}

// 2. Thêm định nghĩa PropTypes cho component
NhanKhauInfoCard.propTypes = {
  nhanKhau: PropTypes.shape({
    maNhanKhau: PropTypes.string,
    hoTen: PropTypes.string,
    soCCCD: PropTypes.string,
    ngaySinh: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
    gioiTinh: PropTypes.string,
    danToc: PropTypes.string,
    queQuan: PropTypes.string,
    quanHeVoiChuHo: PropTypes.string,
    trangThai: PropTypes.string,
  }),
  title: PropTypes.string,
  isCurrent: PropTypes.bool,
};

function ThongTinCaNhan() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await nhanKhauService.layThongTinNhanKhauCuaToi();
      setData(result);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin nhân khẩu:", err);
      setError(err.message || "Có lỗi xảy ra khi lấy thông tin");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3} textAlign="center">
          <CircularProgress />
          <MDTypography variant="body2" mt={2}>
            Đang tải thông tin...
          </MDTypography>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3}>
          <Alert severity="error">{error}</Alert>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  if (!data || !data.nhanKhau) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3}>
          <Alert severity="info">
            Tài khoản của bạn chưa được liên kết với nhân khẩu. Vui lòng liên hệ cán bộ để được hỗ
            trợ.
          </Alert>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox mb={3}>
          <MDTypography variant="h4" fontWeight="medium">
            Thông Tin Cá Nhân
          </MDTypography>
          <MDTypography variant="body2" color="text">
            Xem thông tin nhân khẩu của bạn và các thành viên trong hộ khẩu
          </MDTypography>
        </MDBox>

        {/* Thông tin nhân khẩu của người dùng */}
        <NhanKhauInfoCard
          nhanKhau={data.nhanKhau}
          title="Thông Tin Nhân Khẩu Của Bạn"
          isCurrent={true}
        />

        {/* Thông tin hộ khẩu */}
        {data.hoKhau && (
          <Card sx={{ mb: 2 }}>
            <MDBox p={3}>
              <MDTypography variant="h6" fontWeight="medium" mb={2}>
                Thông Tin Hộ Khẩu
              </MDTypography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <MDTypography variant="caption" color="text" fontWeight="regular">
                    Mã Hộ Khẩu
                  </MDTypography>
                  <MDTypography variant="body2" fontWeight="medium">
                    {data.hoKhau.maHoKhau || "N/A"}
                  </MDTypography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <MDTypography variant="caption" color="text" fontWeight="regular">
                    Địa Chỉ
                  </MDTypography>
                  <MDTypography variant="body2" fontWeight="medium">
                    {data.hoKhau.diaChi || "N/A"}
                  </MDTypography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <MDTypography variant="caption" color="text" fontWeight="regular">
                    Ngày Đăng Ký
                  </MDTypography>
                  <MDTypography variant="body2" fontWeight="medium">
                    {formatDate(data.hoKhau.ngayDangKy)}
                  </MDTypography>
                </Grid>

                {data.hoKhau.chuHo && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <MDTypography variant="caption" color="text" fontWeight="regular" mb={1}>
                      Chủ Hộ
                    </MDTypography>
                    <MDTypography variant="body2" fontWeight="medium">
                      {data.hoKhau.chuHo.hoTen} ({data.hoKhau.chuHo.soCCCD})
                    </MDTypography>
                  </Grid>
                )}
              </Grid>
            </MDBox>
          </Card>
        )}

        {/* Danh sách thành viên cùng hộ */}
        {data.thanhVienCungHo && data.thanhVienCungHo.length > 0 && (
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" mb={2}>
              Thành Viên Cùng Hộ Khẩu ({data.thanhVienCungHo.length})
            </MDTypography>
            {data.thanhVienCungHo.map((thanhVien, index) => (
              <NhanKhauInfoCard
                key={thanhVien.maNhanKhau || index}
                nhanKhau={thanhVien}
                title={`Thành Viên ${index + 1}: ${thanhVien.hoTen}`}
              />
            ))}
          </MDBox>
        )}

        {(!data.thanhVienCungHo || data.thanhVienCungHo.length === 0) && data.hoKhau && (
          <Alert severity="info">Bạn là thành viên duy nhất trong hộ khẩu này</Alert>
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ThongTinCaNhan;
