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
  const [searchTerm, setSearchTerm] = useState("");

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

  // --- 1. LOGIC KIỂM TRA QUÁ HẠN (MỚI) ---
  const checkQuaHan = (thoiHan, trangThai) => {
    if (!thoiHan) return false; // Chưa giao deadline thì ko tính
    if (trangThai === "DA_XU_LY") return false; // Đã xong thì ko tính quá hạn

    const deadlineDate = new Date(thoiHan);
    const today = new Date();
    // Reset giờ phút về 0 để so sánh ngày chuẩn hơn
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    return today > deadlineDate; // Nếu hôm nay lớn hơn deadline -> QUÁ HẠN
  };
  // ----------------------------------------

  // Helper hiển thị trạng thái (Cập nhật để hiện chữ Quá hạn)
  const renderTrangThai = (row) => {
    const isOverdue = checkQuaHan(row.thoiHanXuLy, row.trangThaiHienTai);

    if (isOverdue) {
      return (
        <MDBox display="flex" flexDirection="column" alignItems="center">
          <MDBadge badgeContent="Đang Xử Lý" color="info" variant="gradient" size="sm" />
          <MDTypography variant="caption" color="error" fontWeight="bold" mt={0.5}>
            ⚠️ QUÁ HẠN
          </MDTypography>
        </MDBox>
      );
    }

    // Bình thường
    let label = "Chờ Tiếp Nhận";
    let color = "secondary";
    if (row.trangThaiHienTai === "DA_XU_LY") {
      label = "Đã Xử Lý";
      color = "success";
    } else if (row.trangThaiHienTai === "DANG_XU_LY") {
      label = "Đang Xử Lý";
      color = "info";
    }

    return <MDBadge badgeContent={label} color={color} variant="gradient" size="sm" />;
  };

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

  // Logic Sắp xếp: Ưu tiên Quá hạn lên trên cùng -> Chưa xong -> Mức độ -> Mới nhất
  const sortPhanAnh = (data) => {
    return data.sort((a, b) => {
      // 0. Ưu tiên QUÁ HẠN lên đầu
      const overA = checkQuaHan(a.thoiHanXuLy, a.trangThaiHienTai);
      const overB = checkQuaHan(b.thoiHanXuLy, b.trangThaiHienTai);
      if (overA !== overB) return overA ? -1 : 1; // Quá hạn (true) lên trước

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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const filteredList = danhSach.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const tenNguoiGui = item.nguoiGui ? (item.nguoiGui.hoTen || "").toLowerCase() : "";
    const cccdNguoiGui = item.nguoiGui ? (item.nguoiGui.cccd || "").toLowerCase() : "";
    return (
      (item.tieuDe && item.tieuDe.toLowerCase().includes(term)) ||
      tenNguoiGui.includes(term) ||
      cccdNguoiGui.includes(term)
    );
  });

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
                <MDBox px={3} mb={2}>
                  <MDInput
                    label="Tìm kiếm..."
                    fullWidth
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </MDBox>

                <TableContainer>
                  <Table>
                    <TableHead style={{ display: "table-header-group" }}>
                      <TableRow>
                        <TableCell>Người Gửi / Ngày</TableCell>
                        <TableCell>Tiêu đề / Lĩnh vực</TableCell>
                        <TableCell align="center">Deadline</TableCell> {/* CỘT MỚI */}
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
                            // Kiểm tra quá hạn để đổi màu chữ deadline
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

                                {/* HIỂN THỊ DEADLINE */}
                                <TableCell align="center">
                                  {row.thoiHanXuLy ? (
                                    <MDTypography
                                      variant="caption"
                                      fontWeight="bold"
                                      color={isOverdue ? "error" : "dark"} // Quá hạn thì màu đỏ
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

                                {/* TRẠNG THÁI (Có cảnh báo quá hạn) */}
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
