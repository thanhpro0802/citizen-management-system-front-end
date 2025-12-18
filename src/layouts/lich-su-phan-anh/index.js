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
import Icon from "@mui/material/Icon";
import TablePagination from "@mui/material/TablePagination";

// Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput"; // <--- 1. IMPORT INPUT

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API
import { getPhanAnhCuaToi } from "services/phanAnhService";

function LichSuPhanAnh() {
  const [danhSach, setDanhSach] = useState([]);
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // --- 2. STATE TÌM KIẾM ---
  const [searchTerm, setSearchTerm] = useState("");
  // ------------------------

  // --- Helpers (Giữ nguyên) ---
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
  const getLinhVucLabel = (c) => {
    // (Giữ nguyên logic cũ của bạn)
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
  const getStatusColor = (s) =>
    s === "DA_XU_LY" ? "success" : s === "DANG_XU_LY" ? "info" : "secondary";
  const getStatusLabel = (s) =>
    s === "DA_XU_LY" ? "Đã Xử Lý" : s === "DANG_XU_LY" ? "Đang Xử Lý" : "Chờ Tiếp Nhận";

  // --- Logic Sắp xếp (Giữ nguyên) ---
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
        const response = await getPhanAnhCuaToi();
        setDanhSach(sortPhanAnh(response.data));
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

  // --- 3. XỬ LÝ TÌM KIẾM ---
  // Mỗi khi ô tìm kiếm thay đổi, reset về trang 1
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  // Lọc danh sách dựa trên từ khóa
  const filteredList = danhSach.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    // Tìm theo Tiêu đề hoặc Mã phản ánh
    return (
      (item.tieuDe && item.tieuDe.toLowerCase().includes(term)) ||
      (item.maPhanAnh && item.maPhanAnh.toLowerCase().includes(term))
    );
  });
  // -------------------------

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
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Lịch Sử Phản Ánh Của Tôi
                </MDTypography>
              </MDBox>

              <MDBox pt={3}>
                {/* --- THANH TÌM KIẾM --- */}
                <MDBox px={3} mb={2}>
                  <MDInput
                    label="Tìm kiếm (Tiêu đề, Mã hồ sơ)..."
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
                        <TableCell>Tiêu đề</TableCell>
                        <TableCell>Lĩnh vực</TableCell>
                        <TableCell align="center">Mức độ</TableCell>
                        <TableCell align="center">Trạng thái</TableCell>
                        <TableCell align="center">Đánh giá</TableCell>
                        <TableCell align="center">Hành động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* SỬA: Dùng filteredList thay vì danhSach */}
                      {filteredList.length > 0 ? (
                        filteredList
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => (
                            <TableRow key={row.maPhanAnh}>
                              <TableCell style={{ maxWidth: "250px" }}>
                                <MDTypography variant="button" fontWeight="medium">
                                  {row.tieuDe}
                                </MDTypography>
                              </TableCell>
                              <TableCell>
                                <MDTypography variant="caption" color="text">
                                  {getLinhVucLabel(row.linhVuc)}
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
                                  <MDTypography variant="caption" fontWeight="bold" color="warning">
                                    {row.danhGiaHaiLong} ⭐
                                  </MDTypography>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell align="center">
                                <MDButton
                                  variant="text"
                                  color="info"
                                  size="small"
                                  onClick={() => navigate(`/chi-tiet-phan-anh/${row.maPhanAnh}`)}
                                >
                                  <Icon>visibility</Icon>&nbsp;Chi tiết
                                </MDButton>
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            <MDTypography variant="caption" color="text">
                              Không tìm thấy kết quả phù hợp.
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

export default LichSuPhanAnh;
