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

  // Helper
  const getMucDoLabel = (mucDo) => {
    switch (mucDo) {
      case "CAO":
        return "Cao";
      case "TRUNG_BINH":
        return "TB";
      default:
        return "Thấp";
    }
  };

  const getMucDoColor = (mucDo) => {
    switch (mucDo) {
      case "CAO":
        return "error";
      case "TRUNG_BINH":
        return "warning";
      default:
        return "success";
    }
  };

  const getStatusColor = (s) =>
    s === "DA_XU_LY" ? "success" : s === "DANG_XU_LY" ? "info" : "secondary";
  const getStatusLabel = (s) =>
    s === "DA_XU_LY" ? "Đã Xử Lý" : s === "DANG_XU_LY" ? "Đang Xử Lý" : "Chờ Tiếp Nhận";

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

  // --- LOGIC SẮP XẾP ---
  const sortPhanAnh = (data) => {
    return data.sort((a, b) => {
      // 1. Check hoàn thành (Chưa xong lên trước)
      const isDoneA = a.trangThaiHienTai === "DA_XU_LY";
      const isDoneB = b.trangThaiHienTai === "DA_XU_LY";
      if (isDoneA !== isDoneB) return isDoneA ? 1 : -1;

      // 2. Check mức độ (Cao lên trước)
      const priorityMap = { CAO: 3, TRUNG_BINH: 2, THAP: 1 };
      const pA = priorityMap[a.mucDoKhanCap] || 0;
      const pB = priorityMap[b.mucDoKhanCap] || 0;
      if (pA !== pB) return pB - pA;

      // 3. Check thời gian (Mới lên trước)
      return (b.thoiGianTao || "").localeCompare(a.thoiGianTao || "");
    });
  };
  // ---------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPhanAnh();
        if (Array.isArray(response.data)) {
          setDanhSach(sortPhanAnh(response.data));
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
              <MDBox pt={3}>
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
                      {danhSach.length > 0 ? (
                        danhSach
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
                            Chưa có dữ liệu phản ánh.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  rowsPerPageOptions={[]}
                  component="div"
                  count={danhSach.length}
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
