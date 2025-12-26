import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Icon from "@mui/material/Icon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API Service
import hoKhauService from "services/hoKhauService";

function ChiTietHoKhau() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hoKhau, setHoKhau] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get current user role
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userRoles = Array.isArray(currentUser.roles)
    ? currentUser.roles
    : currentUser.role
    ? [currentUser.role]
    : [];
  const isCanBo = userRoles.includes("CAN_BO");

  useEffect(() => {
    fetchHoKhauDetail();
  }, [id]);

  const fetchHoKhauDetail = async () => {
    try {
      setLoading(true);
      const response = await hoKhauService.getById(id);
      setHoKhau(response.data);
    } catch (err) {
      console.error("Lỗi khi tải chi tiết hộ khẩu:", err);
      if (err.response && (err.response.status === 403 || err.response.status === 401)) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/authentication/sign-in");
        return;
      }
      setError("Không thể tải thông tin hộ khẩu");
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
      VO: "Vợ",
      CHONG: "Chồng",
      VO_CHONG: "Vợ/Chồng", // Giữ lại để tương thích dữ liệu cũ nếu có
      CON: "Con",
      CHA: "Cha",
      ME: "Mẹ",
      CHA_ME: "Cha/Mẹ", // Giữ lại tương thích
      ANH_TRAI: "Anh trai",
      CHI_GAI: "Chị gái",
      EM_TRAI: "Em trai",
      EM_GAI: "Em gái",
      ANH_CHI_EM: "Anh/Chị/Em", // Giữ lại tương thích
      ONG: "Ông",
      BA: "Bà",
      ONG_BA: "Ông/Bà", // Giữ lại tương thích
      CHAU: "Cháu",
      KHAC: "Khác",
    };
    return mapping[quanHe] || quanHe;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox
          pt={6}
          pb={3}
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
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
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" color="white">
                    Chi Tiết Hộ Khẩu
                  </MDTypography>
                  <MDButton
                    variant="outlined"
                    color="white"
                    size="small"
                    onClick={() => navigate(-1)}
                  >
                    <Icon>arrow_back</Icon>&nbsp; Quay Lại
                  </MDButton>
                </MDBox>
              </MDBox>

              <MDBox pt={3} pb={3} px={3}>
                {error ? (
                  <MDAlert color="error">{error}</MDAlert>
                ) : hoKhau ? (
                  <>
                    {/* Household Information */}
                    <MDBox mb={3}>
                      <MDBox
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                      >
                        <MDTypography variant="h6">Thông Tin Hộ Khẩu</MDTypography>
                        {isCanBo && (
                          <MDBox display="flex" gap={1}>
                            <MDButton
                              variant="gradient"
                              color="warning"
                              size="small"
                              onClick={() => navigate(`/sua-ho-khau/${id}`)}
                            >
                              <Icon>edit</Icon>&nbsp; Sửa
                            </MDButton>
                          </MDBox>
                        )}
                      </MDBox>
                      <Card variant="outlined">
                        <MDBox p={2}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <MDBox mb={2}>
                                <MDBox display="flex" alignItems="center" mb={0.5}>
                                  <Icon sx={{ mr: 1, fontSize: "1.2rem" }}>badge</Icon>
                                  <MDTypography variant="button" fontWeight="bold">
                                    Mã hộ khẩu
                                  </MDTypography>
                                </MDBox>
                                <MDTypography variant="body2" pl={3.5}>
                                  {hoKhau.maHoKhau}
                                </MDTypography>
                              </MDBox>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <MDBox mb={2}>
                                <MDBox display="flex" alignItems="center" mb={0.5}>
                                  <Icon sx={{ mr: 1, fontSize: "1.2rem" }}>calendar_today</Icon>
                                  <MDTypography variant="button" fontWeight="bold">
                                    Ngày đăng ký
                                  </MDTypography>
                                </MDBox>
                                <MDTypography variant="body2" pl={3.5}>
                                  {formatDate(hoKhau.ngayDangKy)}
                                </MDTypography>
                              </MDBox>
                            </Grid>
                            <Grid item xs={12}>
                              <MDBox mb={2}>
                                <MDBox display="flex" alignItems="center" mb={0.5}>
                                  <Icon sx={{ mr: 1, fontSize: "1.2rem" }}>location_on</Icon>
                                  <MDTypography variant="button" fontWeight="bold">
                                    Địa chỉ
                                  </MDTypography>
                                </MDBox>
                                <MDTypography variant="body2" pl={3.5}>
                                  {hoKhau.diaChi}
                                </MDTypography>
                              </MDBox>
                            </Grid>
                            {hoKhau.chuHo && (
                              <Grid item xs={12}>
                                <MDBox>
                                  <MDBox display="flex" alignItems="center" mb={0.5}>
                                    <Icon sx={{ mr: 1, fontSize: "1.2rem" }}>person</Icon>
                                    <MDTypography variant="button" fontWeight="bold">
                                      Chủ hộ
                                    </MDTypography>
                                  </MDBox>
                                  <MDTypography variant="body2" pl={3.5}>
                                    {hoKhau.chuHo.hoTen}
                                  </MDTypography>
                                  <MDTypography variant="caption" color="text" pl={3.5}>
                                    CCCD: {hoKhau.chuHo.soCCCD}
                                  </MDTypography>
                                </MDBox>
                              </Grid>
                            )}
                          </Grid>
                        </MDBox>
                      </Card>
                    </MDBox>

                    <Divider />

                    {/* SỬA: Đã xóa nút Đổi Chủ Hộ ở đây */}
                    {isCanBo && (
                      <>
                        <MDBox my={3}>
                          <MDTypography variant="h6" mb={2}>
                            Chức Năng Quản Lý
                          </MDTypography>
                          <MDBox display="flex" gap={2} flexWrap="wrap">
                            <MDButton
                              variant="gradient"
                              color="primary"
                              size="small"
                              disabled={hoKhau.danhSachThanhVien?.length <= 1}
                              onClick={() => {
                                if (hoKhau.danhSachThanhVien?.length <= 1) {
                                  alert(
                                    "Hộ khẩu chỉ có 1 thành viên nên không thể tách hộ. Vui lòng dùng chức năng 'Sửa' nếu muốn thay đổi địa chỉ."
                                  );
                                  return;
                                }
                                navigate(`/tach-ho/${id}`);
                              }}
                            >
                              <Icon>splitscreen</Icon>&nbsp; Tách Hộ
                            </MDButton>

                            <MDButton
                              variant="gradient"
                              color="secondary"
                              size="small"
                              onClick={() => navigate(`/nhap-ho/${id}`)}
                            >
                              <Icon>merge</Icon>&nbsp; Nhập Hộ
                            </MDButton>

                            {/* ĐÃ XÓA NÚT ĐỔI CHỦ HỘ */}
                          </MDBox>

                          {hoKhau.danhSachThanhVien?.length <= 1 && (
                            <MDTypography variant="caption" color="text" mt={1} display="block">
                              * Chức năng Tách Hộ bị khóa vì hộ khẩu chỉ có 1 thành viên.
                            </MDTypography>
                          )}
                        </MDBox>
                        <Divider />
                      </>
                    )}

                    {/* Members List */}
                    <MDBox mt={3}>
                      <MDTypography variant="h6" mb={2}>
                        Danh Sách Thành Viên ({hoKhau.danhSachThanhVien?.length || 0} người)
                      </MDTypography>
                      <TableContainer>
                        <Table>
                          <TableHead style={{ display: "table-header-group" }}>
                            <TableRow>
                              <TableCell align="left">Họ Tên</TableCell>
                              <TableCell align="left">CCCD</TableCell>
                              <TableCell align="left">Ngày Sinh</TableCell>
                              <TableCell align="left">Giới Tính</TableCell>
                              {/* SỬA: Thêm minWidth để cột Quan hệ đồng đều hơn */}
                              <TableCell align="left" style={{ minWidth: "150px" }}>
                                Quan Hệ với Chủ Hộ
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {hoKhau.danhSachThanhVien && hoKhau.danhSachThanhVien.length > 0 ? (
                              hoKhau.danhSachThanhVien.map((tv, index) => (
                                <TableRow key={index}>
                                  <TableCell align="left">
                                    <MDTypography variant="button" fontWeight="medium">
                                      {tv.hoTen || ""}
                                    </MDTypography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <MDTypography variant="caption">{tv.soCCCD || ""}</MDTypography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <MDTypography variant="caption">
                                      {formatDate(tv.ngaySinh)}
                                    </MDTypography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <MDTypography variant="caption">{tv.gioiTinh}</MDTypography>
                                  </TableCell>
                                  <TableCell align="left">
                                    {/* SỬA: Đảm bảo hiển thị đồng bộ */}
                                    <MDTypography
                                      variant="caption"
                                      fontWeight={
                                        tv.quanHeVoiChuHo === "CHU_HO" ? "bold" : "regular"
                                      }
                                    >
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

export default ChiTietHoKhau;
