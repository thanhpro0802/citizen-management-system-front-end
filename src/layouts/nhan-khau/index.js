/**
 * src/layouts/nhan-khau/index.js
 * Phiên bản: Đã sửa lỗi đọc totalElements từ object 'page'
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDAlert from "components/MDAlert";

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Service
import nhanKhauService from "services/nhanKhauService";

function NhanKhauList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // Search State
  const [searchCriteria, setSearchCriteria] = useState({
    q: "",
    gioiTinh: "",
    status: "",
    maHoKhau: "",
  });
  const [searchTrigger, setSearchTrigger] = useState(0);

  // Dialog & Message State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNhanKhau, setSelectedNhanKhau] = useState(null);
  const [message, setMessage] = useState({ type: "", content: "" });

  const textFieldLikeMDInput = {
    "& .MuiInputBase-root": {
      height: 44,
      boxSizing: "border-box",
    },
    "& .MuiInputBase-input": {
      padding: "10px 12px",
    },
  };

  // Check role permission
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/authentication/sign-in");
      return;
    }
  }, [navigate]);

  // Load Data
  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, searchTrigger]);

  // --- HÀM FETCH DATA ĐÃ SỬA ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const rawResult = await nhanKhauService.searchNhanKhau(searchCriteria, page, rowsPerPage);

      console.log("Debug API Result:", rawResult);

      // 1. Chuẩn hóa để lấy đúng object chứa dữ liệu
      const result = rawResult.data || rawResult;

      // 2. Lấy danh sách nội dung
      const content = result.content || [];
      setData(content);

      // 3. Lấy tổng số bản ghi (FIX CHÍNH CHO LOG CỦA BẠN)
      let total = 0;

      // Ưu tiên 1: Kiểm tra trong object 'page' (Theo log bạn gửi: result.page.totalElements)
      if (result.page && result.page.totalElements !== undefined) {
        total = result.page.totalElements;
      }
      // Ưu tiên 2: Kiểm tra ở root (Cấu trúc Spring Boot mặc định)
      else if (result.totalElements !== undefined) {
        total = result.totalElements;
      }
      // Ưu tiên 3: Các trường hợp tên biến khác
      else {
        total = result.total ?? result.totalItems ?? content.length;
      }

      setTotalElements(total);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      setData([]);
      setTotalElements(0);
      if (error.response?.status === 403 || error.response?.status === 401) {
        alert("Phiên đăng nhập hết hạn.");
        localStorage.clear();
        navigate("/authentication/sign-in");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    setSearchTrigger((prev) => prev + 1);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Delete logic
  const handleOpenDeleteDialog = (item) => {
    setSelectedNhanKhau(item);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedNhanKhau(null);
  };

  const handleDelete = async () => {
    if (!selectedNhanKhau) return;
    try {
      await nhanKhauService.deleteNhanKhau(selectedNhanKhau.maNhanKhau);
      setMessage({ type: "success", content: "Xóa nhân khẩu thành công!" });
      handleCloseDeleteDialog();

      if (data.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        fetchData();
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      setMessage({ type: "error", content: "Không thể xóa: " + (error.message || "Lỗi hệ thống") });
      handleCloseDeleteDialog();
    }
  };

  // Helper formats
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const renderStatus = (status) => {
    const statusColors = {
      THUONG_TRU: "success",
      TAM_TRU: "info",
      TAM_VANG: "warning",
      KHAI_TU: "error",
      UNKNOWN: "default",
    };
    const statusLabels = {
      THUONG_TRU: "Thường trú",
      TAM_TRU: "Tạm trú",
      TAM_VANG: "Tạm vắng",
      KHAI_TU: "Đã mất",
      UNKNOWN: "Chưa xác định",
    };
    return (
      <Chip
        label={statusLabels[status] || status}
        color={statusColors[status] || "default"}
        size="small"
        sx={{ color: "white", fontWeight: "bold", minWidth: "90px" }}
      />
    );
  };

  if (loading && data.length === 0 && page === 0) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3} display="flex" justifyContent="center">
          <CircularProgress color="info" />
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <MDBox position="relative" zIndex={10}>
        <DashboardNavbar />
      </MDBox>

      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                borderRadius="lg"
                coloredShadow="none"
                sx={{ background: "linear-gradient(195deg, #42424a, #191919)" }}
              >
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" color="white">
                    Danh Sách Nhân Khẩu
                  </MDTypography>
                  <MDButton
                    variant="gradient"
                    color="success"
                    size="small"
                    onClick={() => navigate("/nhan-khau/create")}
                  >
                    <Icon>add</Icon>&nbsp; Thêm Nhân Khẩu
                  </MDButton>
                </MDBox>
              </MDBox>

              <MDBox pt={3} px={3}>
                {message.content && (
                  <MDBox mb={2}>
                    <MDAlert
                      color={message.type}
                      dismissible
                      onClose={() => setMessage({ type: "", content: "" })}
                    >
                      {message.content}
                    </MDAlert>
                  </MDBox>
                )}

                <Grid container spacing={2} mb={3} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <MDInput
                      label="Tìm kiếm (Họ tên, CCCD)"
                      fullWidth
                      value={searchCriteria.q}
                      onChange={(e) => setSearchCriteria({ ...searchCriteria, q: e.target.value })}
                      InputProps={{
                        startAdornment: <Icon sx={{ mr: 1 }}>search</Icon>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      select
                      label="Giới tính"
                      fullWidth
                      value={searchCriteria.gioiTinh}
                      onChange={(e) =>
                        setSearchCriteria({ ...searchCriteria, gioiTinh: e.target.value })
                      }
                      sx={textFieldLikeMDInput}
                    >
                      <MenuItem value="">Tất cả</MenuItem>
                      <MenuItem value="Nam">Nam</MenuItem>
                      <MenuItem value="Nữ">Nữ</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      select
                      label="Trạng thái"
                      fullWidth
                      value={searchCriteria.status}
                      onChange={(e) =>
                        setSearchCriteria({ ...searchCriteria, status: e.target.value })
                      }
                      sx={textFieldLikeMDInput}
                    >
                      <MenuItem value="">Tất cả</MenuItem>
                      <MenuItem value="THUONG_TRU">Thường trú</MenuItem>
                      <MenuItem value="TAM_TRU">Tạm trú</MenuItem>
                      <MenuItem value="TAM_VANG">Tạm vắng</MenuItem>
                      <MenuItem value="KHAI_TU">Đã mất</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <MDInput
                      label="Mã hộ khẩu"
                      fullWidth
                      value={searchCriteria.maHoKhau}
                      onChange={(e) =>
                        setSearchCriteria({ ...searchCriteria, maHoKhau: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <MDButton variant="gradient" color="info" fullWidth onClick={handleSearch}>
                      Áp dụng
                    </MDButton>
                  </Grid>
                </Grid>

                <TableContainer>
                  {loading && data.length > 0 ? (
                    <MDBox display="flex" justifyContent="center" py={3}>
                      <CircularProgress color="info" size={30} />
                    </MDBox>
                  ) : (
                    <Table>
                      <TableHead style={{ display: "table-header-group" }}>
                        <TableRow>
                          <TableCell>Mã Nhân Khẩu</TableCell>
                          <TableCell>Họ Tên</TableCell>
                          <TableCell>Ngày Sinh</TableCell>
                          <TableCell>Giới Tính</TableCell>
                          <TableCell>Số CCCD</TableCell>
                          <TableCell align="center">Trạng Thái</TableCell>
                          <TableCell align="center">Thao Tác</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.length > 0 ? (
                          data.map((item) => (
                            <TableRow key={item.maNhanKhau}>
                              <TableCell>
                                <MDTypography variant="caption" fontWeight="bold">
                                  {item.maNhanKhau}
                                </MDTypography>
                              </TableCell>
                              <TableCell>
                                <MDTypography variant="button" fontWeight="medium">
                                  {item.hoTen}
                                </MDTypography>
                              </TableCell>
                              <TableCell>
                                <MDTypography variant="caption">
                                  {formatDate(item.ngaySinh)}
                                </MDTypography>
                              </TableCell>
                              <TableCell>
                                <MDTypography variant="caption">{item.gioiTinh}</MDTypography>
                              </TableCell>
                              <TableCell>
                                <MDTypography variant="caption">
                                  {item.soCCCD || "N/A"}
                                </MDTypography>
                              </TableCell>
                              <TableCell align="center">{renderStatus(item.trangThai)}</TableCell>
                              <TableCell align="center">
                                <MDBox display="flex" justifyContent="center" gap={1}>
                                  <MDButton
                                    variant="gradient"
                                    color="info"
                                    size="small"
                                    iconOnly
                                    circular
                                    onClick={() => navigate(`/nhan-khau/${item.maNhanKhau}`)}
                                  >
                                    <Icon>visibility</Icon>
                                  </MDButton>
                                  <MDButton
                                    variant="gradient"
                                    color="warning"
                                    size="small"
                                    iconOnly
                                    circular
                                    onClick={() => navigate(`/nhan-khau/edit/${item.maNhanKhau}`)}
                                  >
                                    <Icon>edit</Icon>
                                  </MDButton>
                                  <MDButton
                                    variant="gradient"
                                    color="error"
                                    size="small"
                                    iconOnly
                                    circular
                                    onClick={() => handleOpenDeleteDialog(item)}
                                  >
                                    <Icon>delete</Icon>
                                  </MDButton>
                                </MDBox>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} align="center">
                              <MDTypography variant="caption" color="text">
                                Không tìm thấy dữ liệu nhân khẩu nào.
                              </MDTypography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </TableContainer>

                <TablePagination
                  rowsPerPageOptions={[10, 20, 50]}
                  component="div"
                  count={totalElements}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}–${to} trong ${count !== -1 ? count : `nhiều hơn ${to}`}`
                  }
                  labelRowsPerPage="Số dòng:"
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Xác Nhận Xóa</DialogTitle>
        <DialogContent>
          <MDTypography variant="body2">
            Bạn có chắc chắn muốn xóa nhân khẩu <strong>{selectedNhanKhau?.hoTen}</strong>?
            <br />
            Hành động này không thể hoàn tác.
          </MDTypography>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseDeleteDialog} color="secondary">
            Hủy
          </MDButton>
          <MDButton onClick={handleDelete} color="error" variant="gradient">
            Xóa
          </MDButton>
        </DialogActions>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}

export default NhanKhauList;
