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
import { getYeuCauCuaToi } from "services/yeuCauCuTruService";

function YeuCauCuTru() {
  const [danhSach, setDanhSach] = useState([]);
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // --- STATE TÌM KIẾM & BỘ LỌC ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTrangThai, setFilterTrangThai] = useState("ALL");
  const [filterLoaiYeuCau, setFilterLoaiYeuCau] = useState("ALL");

  // Mapping labels
  const getLoaiYeuCauLabel = (loai) => {
    switch (loai) {
      case "DANG_KY_TAM_TRU":
        return "Đăng ký tạm trú";
      case "DANG_KY_THUONG_TRU":
        return "Đăng ký thường trú";
      case "KHAI_BAO_TAM_VANG":
        return "Khai báo tạm vắng";
      case "DIEU_CHINH_THONG_TIN":
        return "Điều chỉnh thông tin";
      case "XOA_DANG_KY":
        return "Xóa đăng ký";
      default:
        return loai || "Không rõ";
    }
  };

  const getTrangThaiLabel = (trangThai) => {
    switch (trangThai) {
      case "CHO_XU_LY":
        return "Chờ xử lý";
      case "DANG_XU_LY":
        return "Đang xử lý";
      case "DA_PHE_DUYET":
        return "Đã phê duyệt";
      case "TU_CHOI":
        return "Từ chối";
      case "HUY":
        return "Đã hủy";
      default:
        return trangThai || "";
    }
  };

  const getTrangThaiColor = (trangThai) => {
    switch (trangThai) {
      case "CHO_XU_LY":
        return "secondary";
      case "DANG_XU_LY":
        return "info";
      case "DA_PHE_DUYET":
        return "success";
      case "TU_CHOI":
        return "error";
      case "HUY":
        return "dark";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getYeuCauCuaToi();
        console.log("📥 Dữ liệu yêu cầu của tôi:", response);
        if (Array.isArray(response)) {
          setDanhSach(response);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách yêu cầu:", error);
      }
    };
    fetchData();
  }, []);

  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  // Bộ lọc
  const filteredList = danhSach.filter((item) => {
    const term = searchTerm.toLowerCase();

    const matchSearch =
      !searchTerm || (item.maYeuCau && item.maYeuCau.toLowerCase().includes(term));

    const matchTrangThai = filterTrangThai === "ALL" || item.trangThai === filterTrangThai;
    const matchLoai = filterLoaiYeuCau === "ALL" || item.loaiYeuCau === filterLoaiYeuCau;

    return matchSearch && matchTrangThai && matchLoai;
  });

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
                  background: "linear-gradient(195deg, #49a3f1, #1A73E8)",
                  boxShadow:
                    "0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(0, 187, 212, 0.4)",
                }}
              >
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" color="white">
                    Yêu Cầu Cư Trú Của Tôi
                  </MDTypography>
                  <MDButton
                    variant="contained"
                    color="white"
                    size="small"
                    onClick={() => navigate("/tao-yeu-cau-cu-tru")}
                  >
                    + Tạo yêu cầu mới
                  </MDButton>
                </MDBox>
              </MDBox>

              <MDBox pt={3} px={3}>
                <Grid container spacing={2} mb={3}>
                  <Grid item xs={12} md={4}>
                    <MDInput
                      label="Tìm kiếm mã yêu cầu..."
                      fullWidth
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControl fullWidth size="small" sx={{ height: "44px" }}>
                      <InputLabel id="filter-trang-thai">Trạng thái</InputLabel>
                      <Select
                        labelId="filter-trang-thai"
                        value={filterTrangThai}
                        label="Trạng thái"
                        onChange={(e) => {
                          setFilterTrangThai(e.target.value);
                          setPage(0);
                        }}
                        sx={{ height: "44px" }}
                      >
                        <MenuItem value="ALL">Tất cả</MenuItem>
                        <MenuItem value="CHO_XU_LY">Chờ xử lý</MenuItem>
                        <MenuItem value="DANG_XU_LY">Đang xử lý</MenuItem>
                        <MenuItem value="DA_PHE_DUYET">Đã phê duyệt</MenuItem>
                        <MenuItem value="TU_CHOI">Từ chối</MenuItem>
                        <MenuItem value="HUY">Đã hủy</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={5}>
                    <FormControl fullWidth size="small" sx={{ height: "44px" }}>
                      <InputLabel id="filter-loai">Loại yêu cầu</InputLabel>
                      <Select
                        labelId="filter-loai"
                        value={filterLoaiYeuCau}
                        label="Loại yêu cầu"
                        onChange={(e) => {
                          setFilterLoaiYeuCau(e.target.value);
                          setPage(0);
                        }}
                        sx={{ height: "44px" }}
                      >
                        <MenuItem value="ALL">Tất cả loại</MenuItem>
                        <MenuItem value="DANG_KY_TAM_TRU"> Đăng ký tạm trú</MenuItem>
                        <MenuItem value="DANG_KY_THUONG_TRU"> Đăng ký thường trú</MenuItem>
                        <MenuItem value="KHAI_BAO_TAM_VANG"> Khai báo tạm vắng</MenuItem>
                        <MenuItem value="DIEU_CHINH_THONG_TIN"> Điều chỉnh thông tin</MenuItem>
                        <MenuItem value="XOA_DANG_KY"> Xóa đăng ký</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <TableContainer>
                  <Table>
                    <TableHead style={{ display: "table-header-group" }}>
                      <TableRow>
                        <TableCell>Mã yêu cầu</TableCell>
                        <TableCell>Loại yêu cầu</TableCell>
                        <TableCell align="center">Ngày tạo</TableCell>
                        <TableCell align="center">Trạng thái</TableCell>
                        <TableCell align="center">Tác vụ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredList.length > 0 ? (
                        filteredList
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => (
                            <TableRow key={row.maYeuCau}>
                              <TableCell>
                                <MDTypography variant="caption" fontWeight="bold">
                                  {row.maYeuCau}
                                </MDTypography>
                              </TableCell>
                              <TableCell>
                                <MDTypography variant="caption">
                                  {getLoaiYeuCauLabel(row.loaiYeuCau)}
                                </MDTypography>
                              </TableCell>
                              <TableCell align="center">
                                <MDTypography variant="caption">
                                  {formatDate(row.ngayTao)}
                                </MDTypography>
                              </TableCell>
                              <TableCell align="center">
                                {row.trangThai === "DA_PHE_DUYET" ||
                                row.trangThai === "TU_CHOI" ||
                                row.trangThai === "HUY" ? (
                                  <MDTypography variant="caption" color="text" fontSize="0.75rem">
                                    {getTrangThaiLabel(row.trangThai)}
                                  </MDTypography>
                                ) : (
                                  <MDBadge
                                    badgeContent={getTrangThaiLabel(row.trangThai)}
                                    color={getTrangThaiColor(row.trangThai)}
                                    variant="gradient"
                                    size="sm"
                                  />
                                )}
                              </TableCell>
                              <TableCell align="center">
                                <MDButton
                                  variant="gradient"
                                  color="info"
                                  size="small"
                                  onClick={() => navigate(`/xu-ly-yeu-cau-cu-tru/${row.maYeuCau}`)}
                                >
                                  Xem chi tiết
                                </MDButton>
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <MDTypography variant="caption" color="text">
                              Bạn chưa tạo yêu cầu nào
                            </MDTypography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  component="div"
                  count={filteredList.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Số hàng mỗi trang:"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} trong tổng số ${count}`
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

export default YeuCauCuTru;
