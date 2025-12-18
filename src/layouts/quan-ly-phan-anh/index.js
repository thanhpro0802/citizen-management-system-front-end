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
import Rating from "@mui/material/Rating";
import Icon from "@mui/material/Icon";

// Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput"; // <--- IMPORT INPUT

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API
import { getAllPhanAnh } from "services/phanAnhService";

function QuanLyPhanAnh() {
  const [danhSach, setDanhSach] = useState([]);
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // --- STATE TÌM KIẾM ---
  const [searchTerm, setSearchTerm] = useState("");

  // Helpers (Giữ nguyên)
  const getMucDoLabel = (m) => {
    if (m === "CAO") return "Cao";
    if (m === "TRUNG_BINH") return "TB";
    return "Thấp";
  };
  const getMucDoColor = (m) => {
    if (m === "CAO") return "error";
    if (m === "TRUNG_BINH") return "warning";
    return "success";
  };
  const getStatusColor = (s) =>
    s === "DA_XU_LY" ? "success" : s === "DANG_XU_LY" ? "info" : "secondary";
  const getStatusLabel = (s) =>
    s === "DA_XU_LY" ? "Đã Xử Lý" : s === "DANG_XU_LY" ? "Đang Xử Lý" : "Chờ Tiếp Nhận";
  const getLinhVucLabel = (c) => {
    // (Giữ nguyên logic cũ)
    switch (c) {
      case "AN_NINH_TRAT_TU":
        return "An ninh trật tự";
      case "HA_TANG_DO_THI":
        return "Hạ tầng đô thị";
      case "MOI_TRUONG":
        return "Môi trường";
      case "Y_TE":
        return "Y tế";
      case "GIAO_DUC":
        return "Giáo dục";
      case "HANH_CHINH_CONG":
        return "Hành chính công";
      default:
        return c ? c.replace(/_/g, " ") : "Khác";
    }
  };
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "");

  // Check quyền (Giữ nguyên)
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/authentication/sign-in");
      return;
    }
    const user = JSON.parse(userStr);
    const role = user.roles || user.role || "";
    const isCanBo = Array.isArray(role) ? role.includes("CAN_BO") : role === "CAN_BO";
    if (!isCanBo) {
      alert("⛔ CẢNH BÁO: Bạn không có quyền truy cập trang quản lý!");
      navigate("/lich-su-phan-anh");
    }
  }, [navigate]);

  // Logic sắp xếp (Giữ nguyên)
  const sortPhanAnh = (data) => {
    return data.sort((a, b) => {
      const statusScore = { CHO: 1, DANG_XU_LY: 2, DA_XU_LY: 3 };
      const scoreA = statusScore[a.trangThaiHienTai] || 4;
      const scoreB = statusScore[b.trangThaiHienTai] || 4;
      if (scoreA !== scoreB) return scoreA - scoreB;

      const priorityScore = { CAO: 3, TRUNG_BINH: 2, THAP: 1 };
      const pA = priorityScore[a.mucDoKhanCap] || 0;
      const pB = priorityScore[b.mucDoKhanCap] || 0;
      if (pA !== pB) return pB - pA;

      return (b.thoiGianTao || "").localeCompare(a.thoiGianTao || "");
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPhanAnh();
        if (Array.isArray(response.data)) {
          setDanhSach(sortPhanAnh(response.data));
        }
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };
    fetchData();
  }, []);

  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // --- XỬ LÝ TÌM KIẾM ---
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const filteredList = danhSach.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();

    // Lấy thông tin người gửi an toàn
    const tenNguoiGui = item.nguoiGui ? (item.nguoiGui.hoTen || "").toLowerCase() : "";
    const cccdNguoiGui = item.nguoiGui ? (item.nguoiGui.cccd || "").toLowerCase() : "";

    return (
      (item.tieuDe && item.tieuDe.toLowerCase().includes(term)) ||
      tenNguoiGui.includes(term) || // Tìm theo tên người gửi
      cccdNguoiGui.includes(term) // Tìm theo CCCD
    );
  });
  // ---------------------

  return (
    <DashboardLayout>
      <DashboardNavbar />
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
                bgColor="warning"
                borderRadius="lg"
                coloredShadow="warning"
              >
                <MDTypography variant="h6" color="white">
                  Quản Lý Tiếp Nhận Phản Ánh
                </MDTypography>
              </MDBox>

              <MDBox pt={3}>
                {/* --- THANH TÌM KIẾM --- */}
                <MDBox px={3} mb={2}>
                  <MDInput
                    label="Tìm kiếm (Tiêu đề, Người gửi, CCCD)..."
                    fullWidth
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </MDBox>
                {/* ---------------------- */}

                <TableContainer>
                  <Table>
                    <TableHead style={{ display: "table-header-group" }}>
                      <TableRow>
                        <TableCell>Người Gửi / Ngày</TableCell>
                        <TableCell>Tiêu đề / Lĩnh vực</TableCell>
                        <TableCell align="center">Mức độ</TableCell>
                        <TableCell align="center">Trạng thái</TableCell>
                        <TableCell align="center">Đánh giá</TableCell>
                        <TableCell align="center">Tác vụ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredList.length > 0 ? (
                        filteredList
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => (
                            <TableRow key={row.maPhanAnh}>
                              <TableCell>
                                <MDTypography variant="caption" fontWeight="bold" display="block">
                                  {row.nguoiGui
                                    ? row.nguoiGui.hoTen || row.nguoiGui.cccd
                                    : "Ẩn danh"}
                                </MDTypography>
                                <MDTypography variant="caption" color="text">
                                  📅 {formatDate(row.thoiGianTao)}
                                </MDTypography>
                              </TableCell>
                              <TableCell style={{ maxWidth: "250px" }}>
                                <MDTypography variant="button" fontWeight="medium" display="block">
                                  {row.tieuDe}
                                </MDTypography>
                                <MDTypography variant="caption" color="info" fontWeight="regular">
                                  📂 {getLinhVucLabel(row.linhVuc)}
                                </MDTypography>
                              </TableCell>
                              <TableCell align="center">
                                <MDBadge
                                  badgeContent={getMucDoLabel(row.mucDoKhanCap)}
                                  color={getMucDoColor(row.mucDoKhanCap)}
                                  variant="gradient"
                                  size="sm"
                                />
                              </TableCell>
                              <TableCell align="center">
                                <MDBadge
                                  badgeContent={getStatusLabel(row.trangThaiHienTai)}
                                  color={getStatusColor(row.trangThaiHienTai)}
                                  variant="gradient"
                                  size="sm"
                                />
                              </TableCell>
                              <TableCell align="center">
                                {row.danhGiaHaiLong ? (
                                  <Rating value={row.danhGiaHaiLong} readOnly size="small" />
                                ) : (
                                  <MDTypography variant="caption" color="text">
                                    -
                                  </MDTypography>
                                )}
                              </TableCell>
                              <TableCell align="center">
                                <MDBox display="flex" justifyContent="center" gap={1}>
                                  <MDButton
                                    variant="gradient"
                                    color="warning"
                                    size="small"
                                    onClick={() => navigate(`/xu-ly-phan-anh/${row.maPhanAnh}`)}
                                  >
                                    <Icon>edit</Icon>&nbsp;Xử lý
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
                  rowsPerPageOptions={[]}
                  component="div"
                  count={filteredList.length} // SỬA: Đếm trên filteredList
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}–${to} trong tổng số ${count}`
                  }
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default QuanLyPhanAnh;
