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
import Rating from "@mui/material/Rating";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API (Thay đổi đường dẫn import nếu cần cho đúng cấu trúc folder của bạn)
import { getAllPhanAnh } from "services/phanAnhService";

function QuanLyPhanAnh() {
  const [danhSach, setDanhSach] = useState([]);
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    if (status === "DA_XU_LY") return "success";
    if (status === "DANG_XU_LY") return "warning";
    return "secondary";
  };

  const getStatusLabel = (status) => {
    if (status === "DA_XU_LY") return "Đã Xử Lý";
    if (status === "DANG_XU_LY") return "Đang Xử Lý";
    return "Chờ Tiếp Nhận";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPhanAnh();
        if (Array.isArray(response.data)) {
          // Sắp xếp: Mới nhất lên đầu
          const sortedData = response.data.sort((a, b) =>
            (b.thoiGianTao || "").localeCompare(a.thoiGianTao || "")
          );
          setDanhSach(sortedData);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

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
                        <TableCell>Người Gửi</TableCell>
                        <TableCell>Tiêu đề</TableCell>
                        <TableCell align="center">Trạng thái</TableCell>
                        <TableCell align="center">Đánh giá</TableCell>
                        <TableCell align="center">Tác vụ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {danhSach.length > 0 ? (
                        danhSach.map((row) => (
                          <TableRow key={row.maPhanAnh}>
                            <TableCell>
                              <MDTypography variant="caption" fontWeight="bold" display="block">
                                {row.nguoiGui ? row.nguoiGui.cccd : "Ẩn danh"}
                              </MDTypography>
                              <MDTypography variant="caption" color="text" fontSize="10px">
                                ID: {row.maPhanAnh.substring(0, 6)}...
                              </MDTypography>
                            </TableCell>

                            <TableCell style={{ maxWidth: "200px" }}>
                              <MDTypography variant="button" fontWeight="medium">
                                {row.tieuDe}
                              </MDTypography>
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
                                "-"
                              )}
                            </TableCell>

                            {/* --- CẬP NHẬT CỘT TÁC VỤ TẠI ĐÂY --- */}
                            <TableCell align="center">
                              <MDBox display="flex" justifyContent="center" gap={1}>
                                {/* Nút Xem Chi Tiết (Giữ nguyên) */}
                                <MDButton
                                  variant="outlined"
                                  color="info"
                                  size="small"
                                  onClick={() => navigate(`/chi-tiet-phan-anh/${row.maPhanAnh}`)}
                                >
                                  Chi tiết
                                </MDButton>

                                {/* --- THÊM NÚT XỬ LÝ (QUAN TRỌNG) --- */}
                                <MDButton
                                  variant="gradient"
                                  color="warning" // Màu cam để nổi bật
                                  size="small"
                                  onClick={() => navigate(`/xu-ly-phan-anh/${row.maPhanAnh}`)}
                                >
                                  <Icon>settings</Icon>&nbsp;Xử lý
                                </MDButton>
                                {/* ----------------------------------- */}
                              </MDBox>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            Chưa có dữ liệu
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
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
