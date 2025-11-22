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
import Rating from "@mui/material/Rating"; // Import Ngôi sao

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";

// Example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API
import { getAllPhanAnh } from "services/phanAnhService";

function QuanLyPhanAnh() {
  const [danhSach, setDanhSach] = useState([]);
  const navigate = useNavigate();

  // Helper: Màu trạng thái
  const getStatusColor = (status) => {
    if (status === "DA_XU_LY") return "success";
    if (status === "DANG_XU_LY") return "warning";
    return "secondary";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPhanAnh();
        if (Array.isArray(response.data)) {
          setDanhSach(response.data);
        }
      } catch (error) {
        console.error("Lỗi:", error);
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
                bgColor="primary"
                borderRadius="lg"
                coloredShadow="primary"
              >
                <MDTypography variant="h6" color="white">
                  Quản Lý Tất Cả Phản Ánh
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <TableContainer>
                  <Table>
                    <TableHead style={{ display: "table-header-group" }}>
                      <TableRow>
                        <TableCell>Mã Hồ Sơ</TableCell>
                        <TableCell>Tiêu đề</TableCell>
                        <TableCell align="center">Trạng thái</TableCell>
                        <TableCell align="center">Đánh giá của Dân</TableCell>
                        <TableCell align="center">Hành động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {danhSach.map((row) => (
                        <TableRow key={row.maPhanAnh}>
                          <TableCell>
                            <MDTypography variant="caption" color="text" fontWeight="medium">
                              {row.maPhanAnh.substring(0, 8)}...
                            </MDTypography>
                          </TableCell>
                          <TableCell>{row.tieuDe}</TableCell>
                          <TableCell align="center">
                            <MDBadge
                              badgeContent={row.trangThaiHienTai}
                              color={getStatusColor(row.trangThaiHienTai)}
                              variant="gradient"
                              size="sm"
                            />
                          </TableCell>

                          {/* --- CỘT HIỂN THỊ ĐÁNH GIÁ --- */}
                          <TableCell align="center">
                            {row.danhGiaHaiLong ? (
                              <MDBox display="flex" alignItems="center" justifyContent="center">
                                <Rating value={row.danhGiaHaiLong} readOnly size="small" />
                                <MDTypography variant="caption" ml={1}>
                                  ({row.danhGiaHaiLong})
                                </MDTypography>
                              </MDBox>
                            ) : (
                              <MDTypography variant="caption" color="text">
                                -
                              </MDTypography>
                            )}
                          </TableCell>

                          <TableCell align="center">
                            <MDButton
                              variant="text"
                              color="info"
                              size="small"
                              onClick={() => navigate(`/chi-tiet-phan-anh/${row.maPhanAnh}`)}
                            >
                              Xem chi tiết
                            </MDButton>
                          </TableCell>
                        </TableRow>
                      ))}
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
