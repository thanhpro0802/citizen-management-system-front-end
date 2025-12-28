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

  // Dialog & Message state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedHoKhau, setSelectedHoKhau] = useState(null);
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

    // Lấy role từ user object (kiểm tra cả vaiTro và roles)
    const role = user.vaiTro || (Array.isArray(user.roles) ? user.roles[0] : "");

    // Danh sách các role được phép vào quản lý hộ khẩu
    const ROLES_CHO_PHEP = ["ADMIN", "CAN_BO_HO_KHAU", "TO_TRUONG", "TO_PHO"];

    const hasPermission = ROLES_CHO_PHEP.includes(role);

    if (!hasPermission) {
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
      console.error("Lỗi khi tải danh sách:", error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        alert("Phiên đăng nhập hết hạn.");
        localStorage.clear();
        navigate("/authentication/sign-in");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- HÀM TÌM KIẾM TỔNG HỢP ---
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(0);

    if (!value.trim()) {
      setFilteredList(danhSach); // Nếu ô tìm kiếm trống, hiện tất cả
      return;
    }

    try {
      // Gọi API tìm kiếm tổng hợp (nếu Backend đã cập nhật)
      if (hoKhauService.searchGeneral) {
        const response = await hoKhauService.searchGeneral(value);
        if (Array.isArray(response.data)) {
          setFilteredList(response.data);
          return;
        }
      }
      // Nếu chưa có API searchGeneral, ném lỗi để chạy xuống fallback client-side
      throw new Error("API searchGeneral not implemented");
    } catch (error) {
      // Fallback: Tìm kiếm thủ công phía Client (gõ gì tìm nấy)
      console.warn("Dùng bộ lọc Client:", error.message);
      const lowerValue = value.toLowerCase();

      const filtered = danhSach.filter((item) => {
        // Kiểm tra Địa chỉ
        const matchDiaChi = item.diaChi?.toLowerCase().includes(lowerValue);
        // Kiểm tra Tên chủ hộ
        const matchTen = item.chuHo?.hoTen?.toLowerCase().includes(lowerValue);
        // Kiểm tra CCCD
        const matchCCCD = item.chuHo?.soCCCD?.includes(value);

        // Trả về true nếu thỏa mãn BẤT KỲ điều kiện nào
        return matchDiaChi || matchTen || matchCCCD;
      });
      setFilteredList(filtered);
    }
  };

  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // ... (Giữ nguyên logic Delete Dialog như cũ) ...
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
      setMessage({ type: "success", content: "Xóa thành công!" });
      handleCloseDeleteDialog();
      fetchData();
    } catch (error) {
      setMessage({ type: "error", content: "Lỗi xóa hộ khẩu" });
      handleCloseDeleteDialog();
    }
  };

  if (loading) {
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

                {/* --- 1 Ô TÌM KIẾM DUY NHẤT --- */}
                <Grid container spacing={2} mb={3}>
                  <Grid item xs={12} md={6}>
                    <MDInput
                      label="Tìm kiếm (Địa chỉ, Tên chủ hộ, CCCD)..."
                      fullWidth
                      value={searchTerm}
                      onChange={handleSearch}
                      InputProps={{
                        startAdornment: <Icon sx={{ mr: 1 }}>search</Icon>,
                      }}
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
                        <TableCell>Ngày Đăng Ký</TableCell>
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
                                  {row.chuHo?.hoTen || ""}
                                </MDTypography>
                                <br />
                                <MDTypography variant="caption" color="text">
                                  {row.chuHo?.soCCCD || ""}
                                </MDTypography>
                              </TableCell>
                              <TableCell align="center">
                                <MDTypography variant="button">
                                  {row.danhSachThanhVien?.length || 0}
                                </MDTypography>
                              </TableCell>
                              <TableCell>
                                <MDTypography variant="caption">
                                  {formatDate(row.ngayDangKy)}
                                </MDTypography>
                              </TableCell>
                              <TableCell align="center">
                                <MDBox display="flex" justifyContent="center" gap={1}>
                                  <MDButton
                                    variant="gradient"
                                    color="info"
                                    size="small"
                                    iconOnly
                                    circular
                                    onClick={() => navigate(`/chi-tiet-ho-khau/${row.maHoKhau}`)}
                                  >
                                    <Icon>visibility</Icon>
                                  </MDButton>
                                  <MDButton
                                    variant="gradient"
                                    color="warning"
                                    size="small"
                                    iconOnly
                                    circular
                                    onClick={() => navigate(`/sua-ho-khau/${row.maHoKhau}`)}
                                  >
                                    <Icon>edit</Icon>
                                  </MDButton>
                                  <MDButton
                                    variant="gradient"
                                    color="error"
                                    size="small"
                                    iconOnly
                                    circular
                                    onClick={() => handleOpenDeleteDialog(row)}
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
                  labelDisplayedRows={({ from, to, count }) => `${from}–${to} trong ${count}`}
                  labelRowsPerPage="Số dòng:"
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Xác Nhận Xóa</DialogTitle>
        <DialogContent>
          <MDTypography variant="body2">
            Bạn có chắc muốn xóa hộ khẩu <strong>{selectedHoKhau?.maHoKhau}</strong>?
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
