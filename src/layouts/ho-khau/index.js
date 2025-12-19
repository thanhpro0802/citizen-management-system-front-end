import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  Icon,
  InputAdornment,
} from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput"; // Dùng input của template

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1"; // Nhập hộ
import PersonRemoveIcon from "@mui/icons-material/PersonRemove"; // Tách hộ
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts"; // Đổi chủ
import SearchIcon from "@mui/icons-material/Search";

import { fetchHoKhauList, deleteHoKhau } from "services/hokhauService";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function HoKhauList() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Search
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [keyword, setKeyword] = useState("");

  const [delDialog, setDelDialog] = useState({ open: false, maHoKhau: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetchHoKhauList()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setList(data);
      })
      .catch((err) => {
        console.error(err);
        setList([]);
        setSnackbar({ open: true, message: "Không thể tải danh sách", type: "error" });
      })
      .finally(() => setLoading(false));
  };

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return list;
    return list.filter((hk) => {
      const ma = (hk.maHoKhau || "").toLowerCase();
      const diaChi = (hk.diaChi || "").toLowerCase();
      const chuHo = (hk.chuHo?.hoTen || "").toLowerCase();
      return ma.includes(kw) || diaChi.includes(kw) || chuHo.includes(kw);
    });
  }, [keyword, list]);

  const paginated = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleDelete = async () => {
    const maHoKhau = delDialog.maHoKhau;
    if (!maHoKhau) return;
    try {
      await deleteHoKhau(maHoKhau);
      setSnackbar({ open: true, message: "Đã xóa hộ khẩu", type: "success" });
      setDelDialog({ open: false, maHoKhau: null });
      setList((prev) => prev.filter((hk) => hk.maHoKhau !== maHoKhau));
    } catch (e) {
      setSnackbar({ open: true, message: "Xóa thất bại", type: "error" });
    }
  };

  // Helper render cột tiêu đề
  const renderHeaderCell = (name, align = "left") => (
    <TableCell align={align}>
      <MDTypography variant="caption" color="secondary" fontWeight="bold" textTransform="uppercase">
        {name}
      </MDTypography>
    </TableCell>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              {/* Header Gradient Xanh đặc trưng của Template */}
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
                <MDTypography variant="h6" color="white">
                  Danh sách Hộ Khẩu
                </MDTypography>

                <MDButton
                  variant="gradient"
                  color="dark"
                  size="small"
                  onClick={() => navigate("/ho-khau/tao-moi")}
                >
                  <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                  &nbsp;Thêm mới
                </MDButton>
              </MDBox>

              <MDBox p={3}>
                {/* Thanh tìm kiếm */}
                <MDBox display="flex" justifyContent="flex-end" mb={3}>
                  <MDBox width={{ xs: "100%", md: "300px" }}>
                    <MDInput
                      label="Tìm kiếm..."
                      fullWidth
                      value={keyword}
                      onChange={(e) => {
                        setKeyword(e.target.value);
                        setPage(0);
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </MDBox>
                </MDBox>

                {/* Bảng dữ liệu */}
                <TableContainer>
                  <Table>
                    <TableHead sx={{ display: "table-header-group" }}>
                      <TableRow>
                        {renderHeaderCell("Mã hộ khẩu")}
                        {renderHeaderCell("Chủ hộ")}
                        {renderHeaderCell("Địa chỉ")}
                        {renderHeaderCell("Thành viên", "center")}
                        {renderHeaderCell("Hành động", "center")}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <MDTypography variant="button" color="text">
                              Đang tải dữ liệu...
                            </MDTypography>
                          </TableCell>
                        </TableRow>
                      ) : paginated.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <MDTypography variant="button" color="text">
                              Không tìm thấy dữ liệu
                            </MDTypography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginated.map((row) => (
                          <TableRow key={row.maHoKhau} hover>
                            {/* Mã hộ khẩu: Cắt ngắn cho đẹp */}
                            <TableCell>
                              <Tooltip title={row.maHoKhau} placement="top">
                                <MDBox display="flex" flexDirection="column">
                                  <MDTypography variant="caption" fontWeight="medium" color="text">
                                    {row.maHoKhau.substring(0, 8)}...
                                  </MDTypography>
                                  <MDTypography variant="caption" color="secondary">
                                    {row.ngayDangKy
                                      ? new Date(row.ngayDangKy).toLocaleDateString("vi-VN")
                                      : ""}
                                  </MDTypography>
                                </MDBox>
                              </Tooltip>
                            </TableCell>

                            {/* Chủ hộ: In đậm */}
                            <TableCell>
                              <MDTypography variant="button" fontWeight="medium" color="dark">
                                {row.chuHo?.hoTen || "(Chưa có chủ hộ)"}
                              </MDTypography>
                            </TableCell>

                            {/* Địa chỉ */}
                            <TableCell>
                              <MDTypography variant="caption" color="text" fontWeight="regular">
                                {row.diaChi}
                              </MDTypography>
                            </TableCell>

                            {/* Số lượng thành viên */}
                            <TableCell align="center">
                              <MDTypography variant="caption" fontWeight="bold">
                                {row.danhSachThanhVien?.length || 0}
                              </MDTypography>
                            </TableCell>

                            {/* Cột Hành Động */}
                            <TableCell align="center">
                              <MDBox display="flex" justifyContent="center" gap={0.5}>
                                <Tooltip title="Xem chi tiết">
                                  <IconButton
                                    color="info"
                                    size="small"
                                    onClick={() => navigate(`/ho-khau/${row.maHoKhau}`)}
                                  >
                                    <VisibilityIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title="Chỉnh sửa">
                                  <IconButton
                                    color="warning"
                                    size="small"
                                    onClick={() => navigate(`/ho-khau/${row.maHoKhau}/chinh-sua`)}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>

                                {/* Nhóm chức năng nghiệp vụ */}
                                <Tooltip title="Đổi chủ hộ">
                                  <IconButton
                                    color="secondary"
                                    size="small"
                                    onClick={() => navigate(`/ho-khau/${row.maHoKhau}/doi-chu-ho`)}
                                  >
                                    <ManageAccountsIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title="Tách hộ">
                                  <IconButton
                                    color="success"
                                    size="small"
                                    onClick={() => navigate(`/ho-khau/${row.maHoKhau}/tach-ho`)}
                                  >
                                    <PersonRemoveIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title="Nhập hộ">
                                  <IconButton
                                    color="primary"
                                    size="small"
                                    onClick={() => navigate(`/ho-khau/${row.maHoKhau}/nhap-ho`)}
                                  >
                                    <PersonAddAlt1Icon fontSize="small" />
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title="Xóa hộ khẩu">
                                  <IconButton
                                    color="error"
                                    size="small"
                                    onClick={() =>
                                      setDelDialog({ open: true, maHoKhau: row.maHoKhau })
                                    }
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </MDBox>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  rowsPerPageOptions={[5, 10, 20]}
                  component="div"
                  count={filtered.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={(_, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                  labelRowsPerPage="Số dòng:"
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Dialog Xóa */}
      <Dialog open={delDialog.open} onClose={() => setDelDialog({ open: false, maHoKhau: null })}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <MDTypography variant="body2">
            Bạn có chắc chắn muốn xóa hộ khẩu này? Hành động này không thể hoàn tác.
          </MDTypography>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setDelDialog({ open: false, maHoKhau: null })} color="dark">
            Hủy
          </MDButton>
          <MDButton onClick={handleDelete} color="error" variant="gradient">
            Xóa ngay
          </MDButton>
        </DialogActions>
      </Dialog>

      {/* Thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.type} variant="filled" sx={{ color: "#fff" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default HoKhauList;
