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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API Service
import { getPhanAnhCuaToi } from "services/phanAnhService"; // Chỉ import cái này

function LichSuPhanAnh() {
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
    return "Đang Chờ";
  };

  const handleXemChiTiet = (id) => {
    navigate(`/chi-tiet-phan-anh/${id}`);
  };

  // --- USE EFFECT: LUÔN GỌI API CỦA TÔI ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPhanAnhCuaToi();
        // Sắp xếp mới nhất lên đầu
        const sortedData = response.data.sort((a, b) =>
          (b.thoiGianTao || "").localeCompare(a.thoiGianTao || "")
        );
        setDanhSach(sortedData);
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
                  Lịch Sử Phản Ánh Của Tôi
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
                        <TableCell align="center">Hành động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {danhSach.length > 0 ? (
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
                                "-"
                              )}
                            </TableCell>
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
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <MDTypography variant="caption" color="text">
                              Bạn chưa gửi phản ánh nào.
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
