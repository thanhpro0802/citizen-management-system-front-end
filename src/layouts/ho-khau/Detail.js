import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchHoKhauDetail, deleteHoKhau } from "services/hokhauService";

// [SỬA LỖI 1]: Import PropTypes để kiểm tra dữ liệu
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// [SỬA LỖI 2]: Tách Component hiển thị thông tin ra ngoài và khai báo PropTypes
const InfoItem = ({ label, value }) => (
  <MDBox mb={2}>
    <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
      {label}
    </MDTypography>
    <MDTypography variant="body2" fontWeight="medium" color="dark">
      {value || "---"}
    </MDTypography>
  </MDBox>
);

// Khai báo kiểu dữ liệu cho InfoItem để ESLint không báo lỗi nữa
InfoItem.propTypes = {
  label: PropTypes.string, // label có thể không bắt buộc, nhưng tốt nhất nên khai báo
  value: PropTypes.string,
};

function HoKhauDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hoKhau, setHoKhau] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchHoKhauDetail(id)
      .then((res) => {
        setHoKhau(res.data);
      })
      .catch(() => {
        setError("Không thể tải thông tin hộ khẩu. Vui lòng thử lại sau.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteHoKhau(id);
      navigate("/ho-khau");
    } catch (e) {
      alert("Lỗi khi xóa hộ khẩu: " + e.message);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress color="info" />
        </MDBox>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3} px={3}>
          <MDTypography color="error" variant="h6">
            {error}
          </MDTypography>
          <MDButton
            variant="outlined"
            color="info"
            onClick={() => navigate("/ho-khau")}
            sx={{ mt: 2 }}
          >
            Quay lại danh sách
          </MDButton>
        </MDBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12}>
            <Card>
              {/* Header Gradient Xanh */}
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDBox>
                  <MDTypography variant="h6" color="white">
                    Chi Tiết Hộ Khẩu
                  </MDTypography>
                  <MDTypography variant="caption" color="white" opacity={0.8}>
                    Mã HK: {hoKhau?.maHoKhau}
                  </MDTypography>
                </MDBox>

                <MDButton
                  variant="outlined"
                  color="white"
                  size="small"
                  onClick={() => navigate("/ho-khau")}
                >
                  <Icon>arrow_back</Icon>&nbsp;Quay lại
                </MDButton>
              </MDBox>

              <MDBox p={4}>
                {/* Thông tin chung */}
                <MDTypography variant="h6" color="dark" mb={2}>
                  Thông tin chung
                </MDTypography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <InfoItem label="Chủ hộ" value={hoKhau?.chuHo?.hoTen} />
                    <InfoItem
                      label="CCCD Chủ hộ"
                      value={hoKhau?.chuHo?.soCCCD || hoKhau?.chuHo?.soCccd}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InfoItem label="Địa chỉ thường trú" value={hoKhau?.diaChi} />
                    <InfoItem
                      label="Ngày đăng ký"
                      value={
                        hoKhau?.ngayDangKy
                          ? new Date(hoKhau.ngayDangKy).toLocaleDateString("vi-VN")
                          : ""
                      }
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Danh sách thành viên */}
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <MDTypography variant="h6" color="dark">
                    Thành viên trong hộ ({hoKhau?.danhSachThanhVien?.length || 0})
                  </MDTypography>
                </MDBox>

                <TableContainer
                  sx={{ boxShadow: "none", border: "1px solid #f0f2f5", borderRadius: "8px" }}
                >
                  <Table>
                    <TableHead sx={{ display: "table-header-group" }}>
                      <TableRow>
                        <TableCell>
                          <MDTypography variant="button" fontWeight="bold" color="secondary">
                            HỌ TÊN
                          </MDTypography>
                        </TableCell>
                        <TableCell>
                          <MDTypography variant="button" fontWeight="bold" color="secondary">
                            QUAN HỆ VỚI CHỦ HỘ
                          </MDTypography>
                        </TableCell>
                        <TableCell>
                          <MDTypography variant="button" fontWeight="bold" color="secondary">
                            CCCD
                          </MDTypography>
                        </TableCell>
                        <TableCell>
                          <MDTypography variant="button" fontWeight="bold" color="secondary">
                            NGÀY SINH
                          </MDTypography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(hoKhau?.danhSachThanhVien || []).map((nk) => (
                        <TableRow key={nk.maNhanKhau} hover>
                          <TableCell>
                            <MDBox display="flex" alignItems="center">
                              <Icon
                                fontSize="small"
                                color={
                                  nk.maNhanKhau === hoKhau?.chuHo?.maNhanKhau ? "error" : "info"
                                }
                              >
                                person
                              </Icon>
                              <MDBox ml={1}>
                                <MDTypography variant="button" fontWeight="medium">
                                  {nk.hoTen}{" "}
                                  {nk.maNhanKhau === hoKhau?.chuHo?.maNhanKhau && "(Chủ hộ)"}
                                </MDTypography>
                              </MDBox>
                            </MDBox>
                          </TableCell>
                          <TableCell>
                            <MDTypography variant="caption" color="text">
                              {nk.quanHeVoiChuHo || "-"}
                            </MDTypography>
                          </TableCell>
                          <TableCell>
                            <MDTypography variant="caption" color="text" fontWeight="medium">
                              {nk.soCCCD || nk.soCccd || "-"}
                            </MDTypography>
                          </TableCell>
                          <TableCell>
                            <MDTypography variant="caption" color="text">
                              {nk.ngaySinh
                                ? new Date(nk.ngaySinh).toLocaleDateString("vi-VN")
                                : "-"}
                            </MDTypography>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(hoKhau?.danhSachThanhVien || []).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            <MDTypography variant="caption">Chưa có thành viên nào</MDTypography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Nhóm nút hành động */}
                <MDBox mt={4} display="flex" flexWrap="wrap" gap={2} justifyContent="flex-end">
                  <MDButton
                    variant="outlined"
                    color="info"
                    onClick={() => navigate(`/ho-khau/${id}/nhap-ho`)}
                  >
                    <Icon>person_add</Icon>&nbsp;Nhập hộ
                  </MDButton>

                  <MDButton
                    variant="outlined"
                    color="warning"
                    onClick={() => navigate(`/ho-khau/${id}/tach-ho`)}
                  >
                    <Icon>person_remove</Icon>&nbsp;Tách hộ
                  </MDButton>

                  <MDButton
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate(`/ho-khau/${id}/doi-chu-ho`)}
                  >
                    <Icon>manage_accounts</Icon>&nbsp;Đổi chủ
                  </MDButton>

                  <MDBox flexGrow={1} />

                  <MDButton
                    variant="gradient"
                    color="dark"
                    onClick={() => navigate(`/ho-khau/${id}/chinh-sua`)}
                  >
                    <Icon>edit</Icon>&nbsp;Chỉnh sửa
                  </MDButton>

                  <MDButton variant="gradient" color="error" onClick={() => setOpenDelete(true)}>
                    <Icon>delete</Icon>&nbsp;Xóa Hộ
                  </MDButton>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Dialog Xóa */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <MDTypography variant="body2">
            Bạn có chắc chắn muốn xóa hộ khẩu này không? <br />
            Hành động này sẽ xóa hộ khẩu khỏi hệ thống vĩnh viễn.
          </MDTypography>
        </DialogContent>
        <DialogActions>
          <MDButton color="dark" onClick={() => setOpenDelete(false)}>
            Hủy
          </MDButton>
          <MDButton variant="gradient" color="error" onClick={handleDelete}>
            Xóa ngay
          </MDButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default HoKhauDetail;
