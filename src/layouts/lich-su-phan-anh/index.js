import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Icon from "@mui/material/Icon"; // 2. Import Icon

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton"; // 3. Import MDButton

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API Service
import { getPhanAnhCuaToi } from "services/phanAnhService";

function LichSuPhanAnh() {
  const [danhSach, setDanhSach] = useState([]);
  const navigate = useNavigate(); // 4. Khởi tạo hook navigate

  // Hàm lấy màu sắc cho trạng thái
  const getStatusColor = (status) => {
    if (status === "DA_XU_LY") return "success";
    if (status === "DANG_XU_LY") return "warning";
    if (status === "TU_CHOI") return "error";
    return "secondary"; // CHO_XU_LY
  };

  // Hàm hiển thị tên trạng thái đẹp hơn
  const getStatusLabel = (status) => {
    if (status === "DA_XU_LY") return "Đã Xử Lý";
    if (status === "DANG_XU_LY") return "Đang Xử Lý";
    if (status === "TU_CHOI") return "Bị Từ Chối";
    return "Đang Chờ";
  };

  // Hàm xử lý khi bấm nút Chi tiết
  const handleXemChiTiet = (id) => {
    // Điều hướng sang trang chi tiết (kèm ID phản ánh)
    navigate(`/chi-tiet-phan-anh/${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPhanAnhCuaToi();
        setDanhSach(response.data);
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
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Lịch Sử Phản Ánh
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <TableContainer>
                  <Table>
                    <TableHead style={{ display: "table-header-group" }}>
                      <TableRow>
                        <TableCell>Tiêu đề</TableCell>
                        <TableCell>Lĩnh vực</TableCell>
                        <TableCell align="center">Trạng thái</TableCell>
                        <TableCell align="center">Đánh giá</TableCell>
                        {/* 5. Thêm cột Hành động vào Header */}
                        <TableCell align="center">Hành động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(danhSach) &&
                        danhSach.map((row) => (
                          <TableRow key={row.maPhanAnh}>
                            <TableCell style={{ maxWidth: "250px" }}>
                              <MDTypography variant="button" fontWeight="medium">
                                {row.tieuDe}
                              </MDTypography>
                            </TableCell>
                            <TableCell>
                              <MDTypography variant="caption" color="text">
                                {row.linhVuc}
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
                                <MDTypography variant="caption" fontWeight="bold" color="warning">
                                  {row.danhGiaHaiLong} ⭐
                                </MDTypography>
                              ) : (
                                <MDTypography variant="caption" color="text">
                                  -
                                </MDTypography>
                              )}
                            </TableCell>

                            {/* 6. Thêm nút Chi tiết vào Body */}
                            <TableCell align="center">
                              <MDButton
                                variant="text"
                                color="info"
                                size="small"
                                onClick={() => handleXemChiTiet(row.maPhanAnh)}
                              >
                                <Icon>visibility</Icon>&nbsp;Chi tiết
                              </MDButton>
                            </TableCell>
                          </TableRow>
                        ))}

                      {danhSach.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <MDTypography variant="button" color="text">
                              Chưa có phản ánh nào
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

export default LichSuPhanAnh;
