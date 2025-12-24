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

// Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDAlert from "components/MDAlert";

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API
import hoKhauService from "services/hoKhauService";

function QuanLyHoKhau() {
  const [danhSach, setDanhSach] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedHoKhau, setSelectedHoKhau] = useState(null);

  // Message state
  const [message, setMessage] = useState({ type: "", content: "" });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Check role permission
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/authentication/sign-in");
      return;
    }
    const user = JSON.parse(userStr);
    const role = user.vaiTro || (user.roles ? user.roles[0] : "");
    const isCanBo = Array.isArray(user.roles)
      ? user.roles.includes("CAN_BO")
      : role === "CAN_BO";
    if (!isCanBo) {
      alert("⛔ CẢNH BÁO: Bạn không có quyền truy cập trang quản lý!");
      navigate("/ho-khau-cua-toi");
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await hoKhauService.getAll();
      if (Array.isArray(response.data)) {
        setDanhSach(response.data);
        setFilteredList(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách hộ khẩu:", error);
      setMessage({ type: "error", content: "Không thể tải danh sách hộ khẩu" });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(0);

    if (!value.trim()) {
      setFilteredList(danhSach);
      return;
    }

    try {
      const response = await hoKhauService.searchByDiaChi(value);
      if (Array.isArray(response.data)) {
        setFilteredList(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      // Fallback to client-side filtering
      const filtered = danhSach.filter((item) =>
        item.diaChi?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredList(filtered);
    }
  };

  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleOpenDeleteDialog = (hoKhau) => {
    setSelectedHoKhau(hoKhau);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedHoKhau(null);
  };

  const handleDelete = async () => {
    if (!selectedHoKhau) return;

    try {
      await hoKhauService.delete(selectedHoKhau.maHoKhau);
      setMessage({ type: "success", content: "Xóa hộ khẩu thành công!" });
      handleCloseDeleteDialog();
      fetchData(); // Reload data
    } catch (error) {
      console.error("Lỗi khi xóa hộ khẩu:", error);
      setMessage({
        type: "error",
        content: error.response?.data?.message || "Không thể xóa hộ khẩu",
      });
      handleCloseDeleteDialog();
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3} display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
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
                sx={{
                  background: "linear-gradient(195deg, #42424a, #191919)",
                  boxShadow:
                    "0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(66, 66, 74, 0.4)",
                }}
              >
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" color="white">
                    Quản Lý Hộ Khẩu
                  </MDTypography>
                  <MDButton
                    variant="gradient"
                    color="success"
                    size="small"
                    onClick={() => navigate("/them-ho-khau")}
                  >
                    <Icon>add</Icon>&nbsp; Thêm Hộ Khẩu
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

                <Grid container spacing={2} mb={3}>
                  <Grid item xs={12} md={6}>
                    <MDInput
                      label="Tìm kiếm theo địa chỉ..."
                      fullWidth
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </Grid>
                </Grid>

                <TableContainer>
                  <Table>
                    <TableHead style={{ display: "table-header-group" }}>
                      <TableRow>
                        <TableCell>Mã Hộ Khẩu</TableCell>
                        <TableCell>Địa Chỉ</TableCell>
                        <TableCell>Chủ Hộ</TableCell>
                        <TableCell align="center">Số Thành Viên</TableCell>
                        <TableCell>Ngày Tạo</TableCell>
                        <TableCell align="center">Tác Vụ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredList.length > 0 ? (
                        filteredList
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => (
                            <TableRow key={row.maHoKhau}>
                              <TableCell>
                                <MDTypography variant="button" fontWeight="bold">
                                  {row.maHoKhau}
                                </MDTypography>
                              </TableCell>
                              <TableCell style={{ maxWidth: "300px" }}>
                                <MDTypography variant="caption">{row.diaChi}</MDTypography>
                              </TableCell>
                              <TableCell>
                                <MDTypography variant="button" fontWeight="medium">
                                  {row.chuHo ? row.chuHo.hoTen : ""}
                                </MDTypography>
                                <br />
                                <MDTypography variant="caption" color="text">
                                  {row.chuHo ? row.chuHo.cccd : ""}
                                </MDTypography>
                              </TableCell>
                              <TableCell align="center">
                                <MDTypography variant="button">
                                  {row.thanhVien?.length || 0}
                                </MDTypography>
                              </TableCell>
                              <TableCell>
                                <MDTypography variant="caption">
                                  {formatDate(row.ngayTao)}
                                </MDTypography>
                              </TableCell>
                              <TableCell align="center">
                                <MDBox display="flex" justifyContent="center" gap={1}>
                                  <MDButton
                                    variant="gradient"
                                    color="info"
                                    size="small"
                                    iconOnly={true}
                                    circular
                                    onClick={() => navigate(`/chi-tiet-ho-khau/${row.maHoKhau}`)}
                                    title="Xem chi tiết"
                                  >
                                    <Icon>visibility</Icon>
                                  </MDButton>
                                  <MDButton
                                    variant="gradient"
                                    color="warning"
                                    size="small"
                                    iconOnly={true}
                                    circular
                                    onClick={() => navigate(`/sua-ho-khau/${row.maHoKhau}`)}
                                    title="Sửa"
                                  >
                                    <Icon>edit</Icon>
                                  </MDButton>
                                  <MDButton
                                    variant="gradient"
                                    color="error"
                                    size="small"
                                    iconOnly={true}
                                    circular
                                    onClick={() => handleOpenDeleteDialog(row)}
                                    title="Xóa"
                                  >
                                    <Icon>delete</Icon>
                                  </MDButton>
                                </MDBox>
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            <MDTypography variant="caption" color="text">
                              Không tìm thấy kết quả.
                            </MDTypography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  rowsPerPageOptions={[10, 25, 50]}
                  component="div"
                  count={filteredList.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}–${to} trong tổng số ${count}`
                  }
                  labelRowsPerPage="Số dòng mỗi trang:"
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Xác Nhận Xóa</DialogTitle>
        <DialogContent>
          <MDTypography variant="body2">
            Bạn có chắc chắn muốn xóa hộ khẩu <strong>{selectedHoKhau?.maHoKhau}</strong> tại địa
            chỉ <strong>{selectedHoKhau?.diaChi}</strong>?
          </MDTypography>
          <MDTypography variant="body2" color="error" mt={1}>
            Hành động này không thể hoàn tác!
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

export default QuanLyHoKhau;
