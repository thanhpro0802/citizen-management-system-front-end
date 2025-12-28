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
    if (m === "CAO") return "Khẩn cấp";
    if (m === "TRUNG_BINH") return "Bình thường";
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
    // Lấy role từ user object
    const role = user.roles || user.role || user.vaiTro || "";

    // Danh sách các role được phép vào trang quản lý
    const ROLES_QUAN_LY = [
      "ADMIN",
      "CAN_BO",
      "CAN_BO_PHAN_ANH",
      "TO_TRUONG",
      "TO_PHO",
      "CAN_BO_HO_KHAU",
    ];

    // Kiểm tra xem role của user có nằm trong danh sách cho phép không
    const isAllowed = Array.isArray(role)
      ? role.some((r) => ROLES_QUAN_LY.includes(r))
      : ROLES_QUAN_LY.includes(role);

    if (!isAllowed) {
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

        // --- THÊM DÒNG NÀY ĐỂ KIỂM TRA ---
        console.log("🔥 Dữ liệu API trả về:", response.data);
        if (response.data && response.data.length > 0) {
          console.log("🕵️ Soi thử dòng đầu tiên:", response.data[0]);
          console.log("🕵️ Cán bộ của dòng 1:", response.data[0].canBoPhuTrach);
        }
        // ----------------------------------

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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const filteredList = danhSach.filter((item) => {
    const term = searchTerm.toLowerCase();
    const tenNguoiGui = item.nguoiGui ? (item.nguoiGui.hoTen || "").toLowerCase() : "";
    const cccdNguoiGui = item.nguoiGui ? (item.nguoiGui.cccd || "").toLowerCase() : "";
    const tenCanBo =
      item.canBoPhuTrach && item.canBoPhuTrach.nhanKhau
        ? (item.canBoPhuTrach.nhanKhau.hoTen || "").toLowerCase()
        : "";

    const matchSearch =
      !searchTerm ||
      (item.tieuDe && item.tieuDe.toLowerCase().includes(term)) ||
      tenNguoiGui.includes(term) ||
      cccdNguoiGui.includes(term) ||
      tenCanBo.includes(term);

    const matchStatus = filterStatus === "ALL" || item.trangThaiHienTai === filterStatus;
    const matchMucDo = filterMucDo === "ALL" || item.mucDoKhanCap === filterMucDo;
    const matchLinhVuc = filterLinhVuc === "ALL" || item.linhVuc === filterLinhVuc;

    return matchSearch && matchStatus && matchMucDo && matchLinhVuc;
  });

  // Render Status Badge
  const renderTrangThai = (row) => {
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
      {/* Sửa lại: Thêm MDBox bọc Navbar để sửa lỗi không bấm được nút Configurator */}
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
                  background: "linear-gradient(195deg, #0f766e, #115e59)",
                  boxShadow:
                    "0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(15, 118, 110, 0.4)",
                }}
              >
                <MDTypography variant="h6" color="white">
                  Quản Lý Tiếp Nhận Phản Ánh
                </MDTypography>
              </MDBox>

              <MDBox pt={3} px={3}>
                <Grid container spacing={2} mb={3}>
                  <Grid item xs={12} md={4}>
                    <MDInput
                      label="Tìm kiếm..."
                      fullWidth
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </Grid>
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
                        <MenuItem value="CAO">🔴 Khẩn cấp</MenuItem>
                        <MenuItem value="TRUNG_BINH">🟡 Bình thường</MenuItem>
                        <MenuItem value="THAP">🟢 Thấp</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
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
                        <TableCell>Tiêu đề / Lĩnh vực / Mức độ</TableCell>
                        <TableCell>Cán bộ phụ trách</TableCell>
                        <TableCell align="center">Deadline</TableCell>
                        <TableCell align="center">Hoàn thành</TableCell>
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
                                <TableCell style={{ maxWidth: "250px" }}>
                                  <MDTypography
                                    variant="button"
                                    fontWeight="medium"
                                    display="block"
                                  >
                                    {row.tieuDe}
                                  </MDTypography>
                                  <MDBox display="flex" alignItems="center" mt={0.5} gap={1}>
                                    <MDTypography
                                      variant="caption"
                                      color="text"
                                      fontWeight="regular"
                                    >
                                      📂 {getLinhVucLabel(row.linhVuc)}
                                    </MDTypography>
                                    <MDBadge
                                      badgeContent={getMucDoLabel(row.mucDoKhanCap)}
                                      color={getMucDoColor(row.mucDoKhanCap)}
                                      variant="gradient"
                                      size="xs"
                                    />
                                  </MDBox>
                                </TableCell>
                                <TableCell>
                                  {row.canBoPhuTrach && row.canBoPhuTrach.nhanKhau ? (
                                    <MDBox display="flex" flexDirection="column">
                                      <MDTypography
                                        variant="caption"
                                        fontWeight="bold"
                                        color="dark"
                                      >
                                        {row.canBoPhuTrach.nhanKhau.hoTen}
                                      </MDTypography>
                                      <MDTypography variant="caption" color="text">
                                        {row.canBoPhuTrach.cccd}
                                      </MDTypography>
                                    </MDBox>
                                  ) : (
                                    <MDTypography variant="caption" color="text" fontStyle="italic">
                                      Chưa giao
                                    </MDTypography>
                                  )}
                                </TableCell>
                                <TableCell align="center">
                                  {row.thoiHanXuLy ? (
                                    isOverdue ? (
                                      <MDBox
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        color="error"
                                      >
                                        <Icon fontSize="small" sx={{ mr: 0.5 }}>
                                          error
                                        </Icon>
                                        <MDTypography
                                          variant="caption"
                                          fontWeight="bold"
                                          color="error"
                                        >
                                          {formatDate(row.thoiHanXuLy)}
                                        </MDTypography>
                                      </MDBox>
                                    ) : (
                                      <MDTypography
                                        variant="caption"
                                        fontWeight="medium"
                                        color="text"
                                      >
                                        {formatDate(row.thoiHanXuLy)}
                                      </MDTypography>
                                    )
                                  ) : (
                                    <MDTypography variant="caption" color="text">
                                      _
                                    </MDTypography>
                                  )}
                                </TableCell>
                                <TableCell align="center">
                                  {row.trangThaiHienTai === "DA_XU_LY" && row.thoiGianHoanThanh ? (
                                    <MDTypography
                                      variant="caption"
                                      fontWeight="bold"
                                      color="success"
                                    >
                                      {formatDate(row.thoiGianHoanThanh)}
                                    </MDTypography>
                                  ) : (
                                    <MDTypography variant="caption" color="text">
                                      -
                                    </MDTypography>
                                  )}
                                </TableCell>
                                <TableCell align="center">{renderTrangThai(row)}</TableCell>

                                <TableCell align="center">
                                  <MDBox display="flex" justifyContent="center" gap={1}>
                                    {/* --- 1. NÚT XEM CHI TIẾT --- */}
                                    <MDButton
                                      variant="gradient"
                                      color="info"
                                      size="small"
                                      iconOnly={true}
                                      circular
                                      onClick={() =>
                                        navigate(`/chi-tiet-phan-anh/${row.maPhanAnh}`)
                                      }
                                      title="Xem chi tiết & Đánh giá"
                                    >
                                      <Icon>visibility</Icon>
                                    </MDButton>

                                    {/* --- 2. NÚT XỬ LÝ --- */}
                                    <MDButton
                                      variant="gradient"
                                      color="warning"
                                      size="small"
                                      iconOnly={true}
                                      circular
                                      onClick={() => navigate(`/xu-ly-phan-anh/${row.maPhanAnh}`)}
                                      title="Cập nhật / Xử lý"
                                    >
                                      <Icon>edit</Icon>
                                    </MDButton>
                                  </MDBox>
                                </TableCell>
                              </TableRow>
                            );
                          })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
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
