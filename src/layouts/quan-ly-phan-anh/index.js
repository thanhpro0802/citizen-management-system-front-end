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

// Example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API (Sửa lại import này)
import { getAllPhanAnh } from "services/phanAnhService";

function QuanLyPhanAnh() {
  const [danhSach, setDanhSach] = useState([]);
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    if (status === "DA_XU_LY") return "success";
    if (status === "DANG_XU_LY") return "warning";
    return "secondary";
  };

  // Helper hiển thị tên trạng thái tiếng Việt
  const getStatusLabel = (status) => {
    if (status === "DA_XU_LY") return "Đã Xử Lý";
    if (status === "DANG_XU_LY") return "Đang Xử Lý";
    return "Chờ Tiếp Nhận";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API lấy tất cả phản ánh (Dành cho Cán bộ)
        const response = await getAllPhanAnh();
        if (Array.isArray(response.data)) {
          // Sắp xếp: Mới nhất lên đầu
          const sortedData = response.data.sort((a, b) =>
            (b.thoiGianTao || "").localeCompare(a.thoiGianTao || "")
          );
          setDanhSach(sortedData);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu quản lý:", error);
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
                bgColor="warning" // Màu cam để phân biệt với trang cá nhân
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
                        <TableCell align="center">Đánh giá của Dân</TableCell>
                        <TableCell align="center">Tác vụ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {danhSach.length > 0 ? (
                        danhSach.map((row) => (
                          <TableRow key={row.maPhanAnh}>
                            {/* Cột Người gửi */}
                            <TableCell>
                              <MDBox display="flex" flexDirection="column">
                                <MDTypography variant="caption" fontWeight="bold">
                                  {row.nguoiGui ? row.nguoiGui.cccd : "N/A"}
                                </MDTypography>
                                <MDTypography variant="caption" color="text" fontSize="10px">
                                  ID: {row.maPhanAnh.substring(0, 6)}...
                                </MDTypography>
                              </MDBox>
                            </TableCell>

                            {/* Cột Tiêu đề */}
                            <TableCell style={{ maxWidth: "200px" }}>
                              <MDTypography variant="button" fontWeight="medium">
                                {row.tieuDe}
                              </MDTypography>
                            </TableCell>

                            {/* Cột Trạng thái */}
                            <TableCell align="center">
                              <MDBadge
                                badgeContent={getStatusLabel(row.trangThaiHienTai)}
                                color={getStatusColor(row.trangThaiHienTai)}
                                variant="gradient"
                                size="sm"
                              />
                            </TableCell>

                            {/* Cột Đánh giá */}
                            <TableCell align="center">
                              {row.danhGiaHaiLong ? (
                                <MDBox display="flex" alignItems="center" justifyContent="center">
                                  <Rating value={row.danhGiaHaiLong} readOnly size="small" />
                                  <MDTypography variant="caption" ml={0.5} fontWeight="bold">
                                    ({row.danhGiaHaiLong})
                                  </MDTypography>
                                </MDBox>
                              ) : (
                                <MDTypography variant="caption" color="text">
                                  -
                                </MDTypography>
                              )}
                            </TableCell>

                            {/* Cột Hành động */}
                            <TableCell align="center">
                              <MDButton
                                variant="outlined"
                                color="info"
                                size="small"
                                onClick={() => navigate(`/chi-tiet-phan-anh/${row.maPhanAnh}`)}
                              >
                                <Icon>edit</Icon>&nbsp;Chi tiết
                              </MDButton>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <MDTypography variant="button" color="text" py={2}>
                              Hiện chưa có phản ánh nào.
                            </MDTypography>
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
