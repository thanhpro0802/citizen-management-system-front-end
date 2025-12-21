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

// Import cho bộ lọc
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
import { getAllPhanAnh } from "services/phanAnhService";

function QuanLyPhanAnh() {
  const [danhSach, setDanhSach] = useState([]);
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // --- STATE TÌM KIẾM & BỘ LỌC ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterMucDo, setFilterMucDo] = useState("ALL");
  const [filterLinhVuc, setFilterLinhVuc] = useState("ALL");

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
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "");

  // Logic Quá Hạn
  const checkQuaHan = (thoiHan, trangThai) => {
    if (!thoiHan || trangThai === "DA_XU_LY") return false;
    const deadlineDate = new Date(thoiHan);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);
    return today > deadlineDate;
  };

  // Check quyền
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

  // Logic Sắp xếp
  const sortPhanAnh = (data) => {
    return data.sort((a, b) => {
      const overA = checkQuaHan(a.thoiHanXuLy, a.trangThaiHienTai);
      const overB = checkQuaHan(b.thoiHanXuLy, b.trangThaiHienTai);
      if (overA !== overB) return overA ? -1 : 1;

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

  // --- LOGIC LỌC DỮ LIỆU ---
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const filteredList = danhSach.filter((item) => {
    // 1. Search
    const term = searchTerm.toLowerCase();
    const tenNguoiGui = item.nguoiGui ? (item.nguoiGui.hoTen || "").toLowerCase() : "";
    const cccdNguoiGui = item.nguoiGui ? (item.nguoiGui.cccd || "").toLowerCase() : "";
    const matchSearch =
      !searchTerm ||
      (item.tieuDe && item.tieuDe.toLowerCase().includes(term)) ||
      tenNguoiGui.includes(term) ||
      cccdNguoiGui.includes(term);

    // 2. Filter Status
    const matchStatus = filterStatus === "ALL" || item.trangThaiHienTai === filterStatus;
    // 3. Filter Priority
    const matchMucDo = filterMucDo === "ALL" || item.mucDoKhanCap === filterMucDo;
    // 4. Filter Field
    const matchLinhVuc = filterLinhVuc === "ALL" || item.linhVuc === filterLinhVuc;

    return matchSearch && matchStatus && matchMucDo && matchLinhVuc;
  });

  // Render Status Badge có check Quá Hạn
  const renderTrangThai = (row) => {
    const isOverdue = checkQuaHan(row.thoiHanXuLy, row.trangThaiHienTai);
    if (isOverdue)
      return (
        <MDBox display="flex" flexDirection="column" alignItems="center">
          <MDBadge badgeContent="Đang Xử Lý" color="info" variant="gradient" size="sm" />
          <MDTypography variant="caption" color="error" fontWeight="bold" mt={0.5}>
            ⚠️ QUÁ HẠN
          </MDTypography>
        </MDBox>
      );

    let label = "Chờ Tiếp Nhận",
      color = "secondary";
    if (row.trangThaiHienTai === "DA_XU_LY") {
      label = "Đã Xử Lý";
      color = "success";
    } else if (row.trangThaiHienTai === "DANG_XU_LY") {
      label = "Đang Xử Lý";
      color = "info";
    }
    return <MDBadge badgeContent={label} color={color} variant="gradient" size="sm" />;
  };

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

              <MDBox pt={3} px={3}>
                {/* --- KHU VỰC TÌM KIẾM & BỘ LỌC --- */}
                <Grid container spacing={2} mb={3}>
                  {/* Ô Tìm kiếm */}
                  <Grid item xs={12} md={4}>
                    <MDInput
                      label="Tìm kiếm (Tiêu đề, Người gửi, CCCD)..."
                      fullWidth
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </Grid>

                  {/* Lọc Trạng Thái */}
                  <Grid item xs={6} md={2}>
                    <FormControl fullWidth size="small" sx={{ height: "44px" }}>
                      <InputLabel id="status-filter">Trạng thái</InputLabel>
                      <Select
                        labelId="status-filter"
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
                      <InputLabel id="level-filter">Mức độ</InputLabel>
                      <Select
                        labelId="level-filter"
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
                      <InputLabel id="field-filter">Lĩnh vực</InputLabel>
                      <Select
                        labelId="field-filter"
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

                <TableContainer>
                  <Table>
                    <TableHead style={{ display: "table-header-group" }}>
                      <TableRow>
                        <TableCell>Người Gửi / Ngày</TableCell>
                        <TableCell>Tiêu đề / Lĩnh vực</TableCell>
                        <TableCell align="center">Deadline</TableCell>
                        <TableCell align="center">Mức độ</TableCell>
                        <TableCell align="center">Trạng thái</TableCell>
                        <TableCell align="center">Tác vụ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredList.length > 0 ? (
                        filteredList
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => {
                            const isOverdue = checkQuaHan(row.thoiHanXuLy, row.trangThaiHienTai);
                            return (
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
                                <TableCell style={{ maxWidth: "200px" }}>
                                  <MDTypography
                                    variant="button"
                                    fontWeight="medium"
                                    display="block"
                                  >
                                    {row.tieuDe}
                                  </MDTypography>
                                  <MDTypography variant="caption" color="info" fontWeight="regular">
                                    📂 {getLinhVucLabel(row.linhVuc)}
                                  </MDTypography>
                                </TableCell>
                                <TableCell align="center">
                                  {row.thoiHanXuLy ? (
                                    <MDTypography
                                      variant="caption"
                                      fontWeight="bold"
                                      color={isOverdue ? "error" : "dark"}
                                    >
                                      {formatDate(row.thoiHanXuLy)}
                                    </MDTypography>
                                  ) : (
                                    <MDTypography variant="caption" color="text">
                                      _
                                    </MDTypography>
                                  )}
                                </TableCell>
                                <TableCell align="center">
                                  <MDBadge
                                    badgeContent={getMucDoLabel(row.mucDoKhanCap)}
                                    color={getMucDoColor(row.mucDoKhanCap)}
                                    variant="gradient"
                                    size="sm"
                                  />
                                </TableCell>
                                <TableCell align="center">{renderTrangThai(row)}</TableCell>
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
                            );
                          })
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

export default QuanLyPhanAnh;
