import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// Service
import { fetchHoKhauDetail, deleteHoKhau, fetchMyHoKhau } from "services/hokhauService";

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
  Avatar,
} from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Component con để hiển thị từng dòng thông tin (Label - Value)
const InfoRow = ({ icon, label, value }) => (
  <MDBox display="flex" alignItems="center" mb={1.5}>
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgColor="info"
      color="white"
      width="2rem"
      height="2rem"
      borderRadius="50%"
      shadow="sm"
      mr={2}
    >
      <Icon fontSize="small">{icon}</Icon>
    </MDBox>
    <MDBox display="flex" flexDirection="column">
      <MDTypography variant="caption" fontWeight="regular" color="text">
        {label}
      </MDTypography>
      <MDTypography variant="button" fontWeight="medium" color="dark">
        {value || "---"}
      </MDTypography>
    </MDBox>
  </MDBox>
);

InfoRow.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

function HoKhauDetail({ isMe }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hoKhau, setHoKhau] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchData = isMe ? fetchMyHoKhau() : fetchHoKhauDetail(id);

    fetchData
      .then((res) => {
        setHoKhau(res.data);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || "Không thể tải thông tin hộ khẩu.";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [id, isMe]);

  const handleDelete = async () => {
    try {
      await deleteHoKhau(id);
      navigate("/ho-khau");
    } catch (e) {
      alert("Lỗi khi xóa hộ khẩu: " + e.message);
    }
  };

  // --- XỬ LÝ Loading ---
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

  // --- XỬ LÝ Lỗi ---
  if (error) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3} px={3}>
          <Grid container justifyContent="center">
            <Grid item xs={12} md={8}>
              <MDAlert color="error">{error}</MDAlert>
              <MDButton
                variant="outlined"
                color="info"
                onClick={() => navigate("/ho-khau")}
                sx={{ mt: 2 }}
              >
                Quay lại danh sách
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>
      </DashboardLayout>
    );
  }

  const showActions = !isMe;
  const chuHo = hoKhau?.chuHo;

  // --- LOGIC QUAN TRỌNG: LỌC DANH SÁCH THÀNH VIÊN ---
  // Lấy danh sách gốc từ API
  const rawMembers = hoKhau?.danhSachThanhVien || [];

  // 1. Danh sách hiển thị trong bảng (Loại bỏ Chủ hộ để không bị lặp)
  const membersToDisplay = rawMembers.filter(
    (tv) => tv.soCCCD !== chuHo?.soCCCD && tv.maNhanKhau !== chuHo?.maNhanKhau
  );

  // 2. Tổng số thành viên (Dùng cho ô thống kê)
  // Nếu danh sách raw đã bao gồm chủ hộ thì dùng length, nếu không thì +1
  // Theo logic backend JPA thường trả về, chủ hộ cũng nằm trong danh sách thành viên
  const totalMemberCount = rawMembers.length;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* CARD CHÍNH */}
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12}>
            <Card>
              {/* --- HEADER CARD: Gradient Xanh --- */}
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
                  <MDTypography variant="h5" color="white" fontWeight="medium">
                    {isMe ? "Thông Tin Hộ Khẩu Của Tôi" : "Chi Tiết Hộ Khẩu"}
                  </MDTypography>
                  <MDTypography variant="caption" color="white" opacity={0.8}>
                    Mã số: {hoKhau?.maHoKhau}
                  </MDTypography>
                </MDBox>

                {/* Nút quay lại (chỉ hiện khi không phải 'isMe') */}
                {!isMe && (
                  <MDButton
                    variant="outlined"
                    color="white"
                    size="small"
                    onClick={() => navigate("/ho-khau")}
                  >
                    <Icon sx={{ fontWeight: "bold" }}>arrow_back</Icon>&nbsp;Quay lại
                  </MDButton>
                )}
              </MDBox>

              {/* --- BODY CARD --- */}
              <MDBox p={3}>
                <Grid container spacing={3}>
                  {/* Cột Trái: Thông tin chung */}
                  <Grid item xs={12} md={6}>
                    <MDTypography variant="h6" fontWeight="medium" textTransform="uppercase" mb={2}>
                      Thông tin chung
                    </MDTypography>
                    <MDBox>
                      <InfoRow icon="home" label="Địa chỉ thường trú" value={hoKhau?.diaChi} />
                      <InfoRow
                        icon="event"
                        label="Ngày đăng ký"
                        value={
                          hoKhau?.ngayDangKy
                            ? new Date(hoKhau.ngayDangKy).toLocaleDateString("vi-VN")
                            : ""
                        }
                      />
                      <InfoRow icon="badge" label="Chủ Hộ" value={chuHo?.hoTen} />
                      <InfoRow
                        icon="fingerprint"
                        label="CCCD Chủ Hộ"
                        value={chuHo?.soCCCD || chuHo?.soCccd}
                      />
                    </MDBox>
                  </Grid>

                  {/* Cột Phải: Thống kê / Ghi chú */}
                  <Grid item xs={12} md={6}>
                    <MDTypography variant="h6" fontWeight="medium" textTransform="uppercase" mb={2}>
                      Thống kê
                    </MDTypography>
                    <MDBox
                      bgColor="grey-100"
                      borderRadius="lg"
                      p={2}
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      minHeight="150px"
                    >
                      <MDTypography variant="h1" color="info" fontWeight="bold">
                        {totalMemberCount}
                      </MDTypography>
                      <MDTypography variant="button" color="text" fontWeight="regular">
                        Tổng nhân khẩu
                      </MDTypography>
                    </MDBox>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                {/* --- DANH SÁCH THÀNH VIÊN --- */}
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <MDTypography variant="h6" fontWeight="medium" textTransform="uppercase">
                    Danh sách thành viên khác
                  </MDTypography>
                </MDBox>

                <TableContainer
                  sx={{ boxShadow: "none", border: "1px solid #f0f2f5", borderRadius: "8px" }}
                >
                  <Table sx={{ minWidth: 900 }}>
                    <TableHead sx={{ display: "table-header-group" }}>
                      <TableRow>
                        {/* Cột 1: Thành viên (40%) */}
                        <TableCell width="40%" align="left" sx={{ pl: 3 }}>
                          Thành viên
                        </TableCell>

                        {/* Cột 2: Quan hệ (20%) */}
                        <TableCell width="20%" align="left">
                          Quan hệ với chủ hộ
                        </TableCell>

                        {/* Cột 3: Ngày sinh (15%) */}
                        <TableCell width="15%" align="center">
                          Ngày sinh
                        </TableCell>

                        {/* Cột 4: Giới tính (10%) */}
                        <TableCell width="10%" align="center">
                          Giới tính
                        </TableCell>

                        {/* Cột 5: CCCD (15%) */}
                        <TableCell width="15%" align="center">
                          CCCD
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {membersToDisplay.length > 0 ? (
                        membersToDisplay.map((tv) => (
                          <TableRow key={tv.maNhanKhau} hover>
                            {/* Dữ liệu Cột 1: Avatar + Tên */}
                            <TableCell align="left" sx={{ pl: 3 }}>
                              <MDBox display="flex" alignItems="center">
                                <Avatar
                                  src=""
                                  alt={tv.hoTen}
                                  size="sm"
                                  shadow="sm"
                                  sx={{ mr: 2, bgcolor: "info.main", color: "white" }}
                                >
                                  <Icon>{tv.gioiTinh === "Nam" ? "face" : "face_3"}</Icon>
                                </Avatar>
                                <MDBox display="flex" flexDirection="column">
                                  <MDTypography variant="button" fontWeight="medium" color="dark">
                                    {tv.hoTen}
                                  </MDTypography>
                                  <MDTypography variant="caption" color="text">
                                    {tv.maNhanKhau}
                                  </MDTypography>
                                </MDBox>
                              </MDBox>
                            </TableCell>

                            {/* Dữ liệu Cột 2: Quan hệ */}
                            <TableCell align="left">
                              <MDTypography
                                variant="caption"
                                fontWeight="bold"
                                color="dark"
                                sx={{ textTransform: "uppercase" }}
                              >
                                {tv.quanHeVoiChuHo || "---"}
                              </MDTypography>
                            </TableCell>

                            {/* Dữ liệu Cột 3: Ngày sinh */}
                            <TableCell align="center">
                              <MDTypography variant="caption" color="text" fontWeight="medium">
                                {tv.ngaySinh
                                  ? new Date(tv.ngaySinh).toLocaleDateString("vi-VN")
                                  : "---"}
                              </MDTypography>
                            </TableCell>

                            {/* Dữ liệu Cột 4: Giới tính */}
                            <TableCell align="center">
                              <MDTypography variant="caption" color="text" fontWeight="regular">
                                {tv.gioiTinh}
                              </MDTypography>
                            </TableCell>

                            {/* Dữ liệu Cột 5: CCCD */}
                            <TableCell align="center">
                              <MDTypography variant="caption" color="text" fontWeight="bold">
                                {tv.soCCCD || tv.soCccd || "---"}
                              </MDTypography>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                            <MDTypography variant="button" color="text">
                              Không có thành viên khác ngoài chủ hộ.
                            </MDTypography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* --- ACTIONS BUTTONS (Chỉ hiện với Cán bộ) --- */}
                {showActions && (
                  <MDBox mt={4} display="flex" flexWrap="wrap" gap={2} justifyContent="flex-end">
                    <MDButton
                      variant="outlined"
                      color="info"
                      onClick={() => navigate(`/ho-khau/${id || hoKhau?.maHoKhau}/nhap-ho`)}
                    >
                      <Icon>person_add</Icon>&nbsp;Nhập hộ
                    </MDButton>

                    <MDButton
                      variant="outlined"
                      color="warning"
                      onClick={() => navigate(`/ho-khau/${id || hoKhau?.maHoKhau}/tach-ho`)}
                    >
                      <Icon>person_remove</Icon>&nbsp;Tách hộ
                    </MDButton>

                    <MDBox flexGrow={1} />

                    <MDButton
                      variant="gradient"
                      color="dark"
                      onClick={() => navigate(`/ho-khau/${id || hoKhau?.maHoKhau}/chinh-sua`)}
                    >
                      <Icon>edit</Icon>&nbsp;Chỉnh sửa
                    </MDButton>

                    <MDButton variant="gradient" color="error" onClick={() => setOpenDelete(true)}>
                      <Icon>delete</Icon>&nbsp;Xóa Hộ
                    </MDButton>
                  </MDBox>
                )}
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
            Bạn có chắc chắn muốn xóa hộ khẩu này? Hành động này không thể hoàn tác.
          </MDTypography>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setOpenDelete(false)} color="dark">
            Hủy
          </MDButton>
          <MDButton onClick={handleDelete} color="error" variant="gradient">
            Xóa ngay
          </MDButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

HoKhauDetail.propTypes = {
  isMe: PropTypes.bool,
};

HoKhauDetail.defaultProps = {
  isMe: false,
};

export default HoKhauDetail;
