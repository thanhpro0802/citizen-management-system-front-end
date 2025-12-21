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

// Import thêm cho bộ lọc
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

// Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

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

  // --- STATE TÌM KIẾM & BỘ LỌC ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterMucDo, setFilterMucDo] = useState("ALL");
  const [filterLinhVuc, setFilterLinhVuc] = useState("ALL");
  // ------------------------------

  // Helpers
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

  // Logic Sắp xếp
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

  // --- XỬ LÝ LỌC KẾT HỢP ---
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const filteredList = danhSach.filter((item) => {
    // 1. Lọc theo từ khóa
    const term = searchTerm.toLowerCase();
    const matchSearch =
      !searchTerm ||
      (item.tieuDe && item.tieuDe.toLowerCase().includes(term)) ||
      (item.maPhanAnh && item.maPhanAnh.toLowerCase().includes(term));

    // 2. Lọc theo Trạng thái
    const matchStatus = filterStatus === "ALL" || item.trangThaiHienTai === filterStatus;

    // 3. Lọc theo Mức độ
    const matchMucDo = filterMucDo === "ALL" || item.mucDoKhanCap === filterMucDo;

    // 4. Lọc theo Lĩnh vực
    const matchLinhVuc = filterLinhVuc === "ALL" || item.linhVuc === filterLinhVuc;

    return matchSearch && matchStatus && matchMucDo && matchLinhVuc;
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

              <MDBox pt={3} px={3}>
                {/* --- KHU VỰC TÌM KIẾM & BỘ LỌC --- */}
                <Grid container spacing={2} mb={3}>
                  {/* Ô Tìm kiếm */}
                  <Grid item xs={12} md={4}>
                    <MDInput
                      label="Tìm kiếm (Tiêu đề, Mã hồ sơ)..."
                      fullWidth
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </Grid>

                  {/* Lọc Trạng Thái */}
                  <Grid item xs={6} md={2}>
                    <FormControl fullWidth size="small" sx={{ height: "44px" }}>
                      <InputLabel id="status-label">Trạng thái</InputLabel>
                      <Select
                        labelId="status-label"
                        value={filterStatus}
                        label="Trạng thái"
                        onChange={(e) => {
                          setFilterStatus(e.target.value);
                          setPage(0);
                        }}
                        sx={{ height: "44px" }}
                      >
                        <MenuItem value="ALL">Tất cả</MenuItem>
                        <MenuItem value="CHO">Chờ tiếp nhận</MenuItem>
                        <MenuItem value="DANG_XU_LY">Đang xử lý</MenuItem>
                        <MenuItem value="DA_XU_LY">Đã xử lý</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Lọc Mức Độ */}
                  <Grid item xs={6} md={2}>
                    <FormControl fullWidth size="small" sx={{ height: "44px" }}>
                      <InputLabel id="level-label">Mức độ</InputLabel>
                      <Select
                        labelId="level-label"
                        value={filterMucDo}
                        label="Mức độ"
                        onChange={(e) => {
                          setFilterMucDo(e.target.value);
                          setPage(0);
                        }}
                        sx={{ height: "44px" }}
                      >
                        <MenuItem value="ALL">Tất cả</MenuItem>
                        <MenuItem value="CAO">🔴 Cao</MenuItem>
                        <MenuItem value="TRUNG_BINH">🟡 Trung bình</MenuItem>
                        <MenuItem value="THAP">🟢 Thấp</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Lọc Lĩnh Vực */}
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small" sx={{ height: "44px" }}>
                      <InputLabel id="field-label">Lĩnh vực</InputLabel>
                      <Select
                        labelId="field-label"
                        value={filterLinhVuc}
                        label="Lĩnh vực"
                        onChange={(e) => {
                          setFilterLinhVuc(e.target.value);
                          setPage(0);
                        }}
                        sx={{ height: "44px" }}
                      >
                        <MenuItem value="ALL">Tất cả lĩnh vực</MenuItem>
                        <MenuItem value="AN_NINH_TRAT_TU">An ninh trật tự</MenuItem>
                        <MenuItem value="HA_TANG_DO_THI">Hạ tầng đô thị</MenuItem>
                        <MenuItem value="MOI_TRUONG">Môi trường</MenuItem>
                        <MenuItem value="Y_TE">Y tế</MenuItem>
                        <MenuItem value="GIAO_DUC">Giáo dục</MenuItem>
                        <MenuItem value="HANH_CHINH_CONG">Hành chính công</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                {/* ---------------------------------- */}

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
                      {filteredList.length > 0 ? (
                        filteredList
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => (
                            <TableRow key={row.maPhanAnh}>
                              <TableCell style={{ maxWidth: "200px" }}>
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
                  count={filteredList.length}
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
