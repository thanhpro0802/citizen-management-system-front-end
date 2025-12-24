import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
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
import MDAlert from "components/MDAlert";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API Service
import hoKhauService from "services/hoKhauService";

function HoKhauCuaToi() {
  const navigate = useNavigate();
  const [hoKhau, setHoKhau] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check authentication
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/authentication/sign-in");
      return;
    }

    fetchMyHoKhau();
  }, [navigate]);

  const fetchMyHoKhau = async () => {
    try {
      setLoading(true);
      const response = await hoKhauService.getMyHoKhau();
      setHoKhau(response.data);
    } catch (err) {
      console.error("Lỗi khi tải thông tin hộ khẩu:", err);
      setError(
        err.response?.status === 404
          ? "Bạn chưa có hộ khẩu trong hệ thống"
          : "Không thể tải thông tin hộ khẩu"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getQuanHeLabel = (quanHe) => {
    const mapping = {
      CHU_HO: "Chủ hộ",
      VO_CHONG: "Vợ/Chồng",
      CON: "Con",
      CHA_ME: "Cha/Mẹ",
      ANH_CHI_EM: "Anh/Chị/Em",
      ONG_BA: "Ông/Bà",
      CHAU: "Cháu",
      KHAC: "Khác",
    };
    return mapping[quanHe] || quanHe;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3} display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress color="info" />
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

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
                  Hộ Khẩu Của Tôi
                </MDTypography>
              </MDBox>

              <MDBox pt={3} pb={3} px={3}>
                {error ? (
                  <MDAlert color="error">{error}</MDAlert>
                ) : hoKhau ? (
                  <>
                    {/* Household Information */}
                    <MDBox mb={3}>
                      <MDTypography variant="h6" mb={2}>
                        Thông Tin Hộ Khẩu
                      </MDTypography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <MDBox display="flex" alignItems="center" mb={1}>
                            <Icon sx={{ mr: 1 }}>badge</Icon>
                            <MDTypography variant="button" fontWeight="bold" mr={1}>
                              Mã hộ khẩu:
                            </MDTypography>
                            <MDTypography variant="button">{hoKhau.maHoKhau}</MDTypography>
                          </MDBox>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <MDBox display="flex" alignItems="center" mb={1}>
                            <Icon sx={{ mr: 1 }}>calendar_today</Icon>
                            <MDTypography variant="button" fontWeight="bold" mr={1}>
                              Ngày tạo:
                            </MDTypography>
                            <MDTypography variant="button">
                              {formatDate(hoKhau.ngayTao)}
                            </MDTypography>
                          </MDBox>
                        </Grid>
                        <Grid item xs={12}>
                          <MDBox display="flex" alignItems="center" mb={1}>
                            <Icon sx={{ mr: 1 }}>location_on</Icon>
                            <MDTypography variant="button" fontWeight="bold" mr={1}>
                              Địa chỉ:
                            </MDTypography>
                            <MDTypography variant="button">{hoKhau.diaChi}</MDTypography>
                          </MDBox>
                        </Grid>
                        {hoKhau.chuHo && (
                          <Grid item xs={12}>
                            <MDBox display="flex" alignItems="center" mb={1}>
                              <Icon sx={{ mr: 1 }}>person</Icon>
                              <MDTypography variant="button" fontWeight="bold" mr={1}>
                                Chủ hộ:
                              </MDTypography>
                              <MDTypography variant="button">
                                {hoKhau.chuHo.hoTen} ({hoKhau.chuHo.cccd})
                              </MDTypography>
                            </MDBox>
                          </Grid>
                        )}
                      </Grid>
                    </MDBox>

                    {/* Members List */}
                    <MDBox>
                      <MDTypography variant="h6" mb={2}>
                        Danh Sách Thành Viên ({hoKhau.thanhVien?.length || 0} người)
                      </MDTypography>
                      <TableContainer>
                        <Table>
                          <TableHead style={{ display: "table-header-group" }}>
                            <TableRow>
                              <TableCell>Họ Tên</TableCell>
                              <TableCell>CCCD</TableCell>
                              <TableCell>Ngày Sinh</TableCell>
                              <TableCell>Giới Tính</TableCell>
                              <TableCell>Quan Hệ</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {hoKhau.thanhVien && hoKhau.thanhVien.length > 0 ? (
                              hoKhau.thanhVien.map((tv, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <MDTypography variant="button" fontWeight="medium">
                                      {tv.nhanKhau?.hoTen || ""}
                                    </MDTypography>
                                  </TableCell>
                                  <TableCell>
                                    <MDTypography variant="caption">
                                      {tv.nhanKhau?.cccd || ""}
                                    </MDTypography>
                                  </TableCell>
                                  <TableCell>
                                    <MDTypography variant="caption">
                                      {formatDate(tv.nhanKhau?.ngaySinh)}
                                    </MDTypography>
                                  </TableCell>
                                  <TableCell>
                                    <MDTypography variant="caption">
                                      {tv.nhanKhau?.gioiTinh === "NAM" ? "Nam" : "Nữ"}
                                    </MDTypography>
                                  </TableCell>
                                  <TableCell>
                                    <MDTypography variant="caption">
                                      {getQuanHeLabel(tv.quanHeVoiChuHo)}
                                    </MDTypography>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={5} align="center">
                                  <MDTypography variant="caption" color="text">
                                    Chưa có thành viên nào
                                  </MDTypography>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </MDBox>
                  </>
                ) : (
                  <MDBox textAlign="center" py={5}>
                    <Icon fontSize="large" color="disabled">
                      home_work
                    </Icon>
                    <MDTypography variant="h6" color="text" mt={2}>
                      Không tìm thấy thông tin hộ khẩu
                    </MDTypography>
                  </MDBox>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default HoKhauCuaToi;
