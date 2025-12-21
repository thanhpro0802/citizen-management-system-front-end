import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import Icon from "@mui/material/Icon";

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
import { getChiTietPhanAnh, getLichSuPhanAnh, danhGiaPhanHoi } from "services/phanAnhService";

function ChiTietPhanAnh() {
  const { id } = useParams();

  // State dữ liệu
  const [data, setData] = useState(null);
  const [ketQua, setKetQua] = useState(null);
  const [loading, setLoading] = useState(true);

  // State đánh giá
  const [soSao, setSoSao] = useState(5);
  const [gopY, setGopY] = useState("");
  const [daDanhGia, setDaDanhGia] = useState(false);
  const [thongBao, setThongBao] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- LOGIC PHÂN QUYỀN ---
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userRoles = Array.isArray(currentUser.roles)
    ? currentUser.roles
    : currentUser.role
    ? [currentUser.role]
    : [];

  const isCanBo = userRoles.includes("CAN_BO");
  // -------------------------

  const getLinhVucLabel = (code) => {
    switch (code) {
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
        return code ? code.replace(/_/g, " ") : "Khác";
    }
  };

  const fetchFullData = async () => {
    try {
      setLoading(true);
      const resInfo = await getChiTietPhanAnh(id);
      setData(resInfo.data);

      if (resInfo.data.danhGiaHaiLong && resInfo.data.danhGiaHaiLong > 0) {
        setDaDanhGia(true);
        setSoSao(resInfo.data.danhGiaHaiLong);
        setGopY(resInfo.data.gopY || "");
      }

      const resHistory = await getLichSuPhanAnh(id);
      if (Array.isArray(resHistory.data)) {
        const phanHoiCuoi = resHistory.data.find((h) => h.hanhDong === "PHAN_HOI");
        if (phanHoiCuoi) {
          setKetQua(phanHoiCuoi.noiDung);
        }
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFullData();
  }, [id]);

  const handleGuiDanhGia = async () => {
    try {
      setIsSubmitting(true);
      await danhGiaPhanHoi(id, soSao, gopY);
      setThongBao("Cảm ơn! Đánh giá của bạn đã được ghi nhận.");
      setDaDanhGia(true);
    } catch (error) {
      console.error(error);
      setThongBao("Lỗi khi gửi đánh giá. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === "CHO") return "warning";
    if (status === "DANG_XU_LY") return "info";
    if (status === "DA_XU_LY") return "success";
    return "dark";
  };

  const getStatusText = (status) => {
    if (status === "CHO") return "Đang chờ tiếp nhận";
    if (status === "DANG_XU_LY") return "Đang xử lý";
    if (status === "DA_XU_LY") return "Đã xử lý xong";
    return status;
  };

  if (loading || !data)
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </MDBox>
    );

  return (
    <DashboardLayout>
      <DashboardNavbar customTitle={`Hồ sơ: ${data.maPhanAnh || ""}`} />

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
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Chi Tiết Phản Ánh
                </MDTypography>
                <MDBox
                  bgColor="white"
                  borderRadius="md"
                  px={2}
                  py={0.5}
                  color={getStatusColor(data.trangThaiHienTai)}
                  fontWeight="bold"
                  fontSize="0.875rem"
                >
                  {getStatusText(data.trangThaiHienTai)}
                </MDBox>
              </MDBox>

              <MDBox p={4}>
                {isCanBo && (
                  <MDTypography variant="caption" color="text" display="block" mb={1}>
                    ID: {data.maPhanAnh}
                  </MDTypography>
                )}

                <MDTypography variant="h4" fontWeight="medium" gutterBottom>
                  {data.tieuDe}
                </MDTypography>

                <Grid container spacing={2} mb={3}>
                  <Grid item xs={12} md={6}>
                    <MDTypography variant="button" fontWeight="bold" color="text">
                      Lĩnh vực:{" "}
                    </MDTypography>
                    <MDTypography variant="body2" ml={1} component="span">
                      {getLinhVucLabel(data.linhVuc)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography variant="button" fontWeight="bold" color="text">
                      Ngày gửi:{" "}
                    </MDTypography>
                    <MDTypography variant="body2" ml={1} component="span">
                      {data.thoiGianTao
                        ? new Date(data.thoiGianTao).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </MDTypography>
                  </Grid>
                  {data.trangThaiHienTai === "DA_XU_LY" && data.thoiGianHoanThanh && (
                    <Grid item xs={12} md={6}>
                      <MDTypography variant="button" fontWeight="bold" color="text">
                        Ngày hoàn thành:{" "}
                      </MDTypography>
                      <MDTypography
                        variant="body2"
                        ml={1}
                        component="span"
                        fontWeight="bold"
                        color="success"
                      >
                        {new Date(data.thoiGianHoanThanh).toLocaleDateString("vi-VN")}
                      </MDTypography>
                    </Grid>
                  )}
                  <Grid item xs={12} md={12}>
                    <MDBox
                      display="flex"
                      alignItems="center"
                      p={1.5}
                      bgColor="grey-100"
                      borderRadius="md"
                      mt={1}
                    >
                      <Icon color="info" fontSize="small" sx={{ mr: 1 }}>
                        person
                      </Icon>
                      <MDTypography variant="button" fontWeight="bold" color="text">
                        Cán bộ thụ lý:
                      </MDTypography>
                      <MDTypography variant="body2" fontWeight="bold" ml={1} color="dark">
                        {data.canBoPhuTrach && data.canBoPhuTrach.nhanKhau ? (
                          `${data.canBoPhuTrach.nhanKhau.hoTen} (${data.canBoPhuTrach.cccd})`
                        ) : (
                          <span style={{ color: "#999", fontStyle: "italic" }}>Chưa phân công</span>
                        )}
                      </MDTypography>
                    </MDBox>
                  </Grid>
                </Grid>

                <MDBox bgColor="grey-100" p={2} borderRadius="lg" mb={3}>
                  <MDTypography variant="h6" gutterBottom>
                    Nội dung phản ánh:
                  </MDTypography>
                  <MDTypography variant="body2" style={{ whiteSpace: "pre-line" }} color="text">
                    {data.noiDung || "Không có nội dung chi tiết."}
                  </MDTypography>
                  {data.tepDinhKems && data.tepDinhKems.length > 0 && (
                    <MDBox mt={3} display="flex" gap={2} flexWrap="wrap">
                      {data.tepDinhKems.map((tep, index) => (
                        <MDBox
                          key={index}
                          component="img"
                          src={tep.url}
                          width="150px"
                          height="150px"
                          borderRadius="lg"
                          style={{
                            objectFit: "cover",
                            border: "1px solid #ddd",
                            cursor: "pointer",
                          }}
                          onClick={() => window.open(tep.url, "_blank")}
                        />
                      ))}
                    </MDBox>
                  )}
                </MDBox>

                <Divider />

                <MDTypography variant="h6" color="success" gutterBottom mt={3}>
                  <MDBox display="flex" alignItems="center">
                    <Icon sx={{ mr: 1 }}>check_circle</Icon> Kết quả xử lý:
                  </MDBox>
                </MDTypography>

                {ketQua ? (
                  <MDBox
                    bgColor="#e8f5e9"
                    p={2}
                    borderRadius="lg"
                    border="1px solid #4caf50"
                    mb={3}
                  >
                    <MDTypography variant="body2" fontWeight="bold" color="success">
                      {ketQua}
                    </MDTypography>
                  </MDBox>
                ) : (
                  <MDTypography variant="body2" color="text" mb={3} fontStyle="italic">
                    (Chưa có kết quả phản hồi chính thức)
                  </MDTypography>
                )}

                {data.trangThaiHienTai === "DA_XU_LY" && (
                  <MDBox mt={4}>
                    <Card sx={{ overflow: "visible" }}>
                      <MDBox
                        mx={2}
                        mt={-3}
                        py={2}
                        px={2}
                        variant="gradient"
                        borderRadius="lg"
                        sx={{
                          background: "linear-gradient(195deg, #0f766e, #115e59)",
                          boxShadow: "0 4px 20px 0 rgba(0,0,0,0.14)",
                        }}
                      >
                        <MDTypography variant="h6" color="white">
                          Đánh Giá Chất Lượng
                        </MDTypography>
                      </MDBox>

                      <MDBox p={3}>
                        {isCanBo ? (
                          daDanhGia ? (
                            <Grid container spacing={3} alignItems="center">
                              <Grid
                                item
                                xs={12}
                                md={4}
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                              >
                                <MDTypography variant="h1" color="warning" fontWeight="bold">
                                  {soSao}
                                </MDTypography>
                                <Rating
                                  value={soSao}
                                  readOnly
                                  size="large"
                                  sx={{ fontSize: "3rem" }}
                                />
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <MDBox bgColor="grey-100" borderRadius="lg" p={3}>
                                  <MDTypography variant="subtitle2" fontWeight="bold">
                                    💬 Ý kiến dân:
                                  </MDTypography>
                                  {/* SỬA LỖI Ở DÒNG NÀY: Dùng &quot; thay cho " */}
                                  <MDTypography variant="body2" fontStyle="italic">
                                    &quot;{gopY || "Không có lời nhắn"}&quot;
                                  </MDTypography>
                                </MDBox>
                              </Grid>
                            </Grid>
                          ) : (
                            <MDBox display="flex" flexDirection="column" alignItems="center" py={3}>
                              <Icon
                                fontSize="large"
                                color="disabled"
                                sx={{ fontSize: "4rem !important" }}
                              >
                                hourglass_empty
                              </Icon>
                              <MDTypography variant="h6" color="text" mt={2}>
                                Đang chờ công dân đánh giá
                              </MDTypography>
                            </MDBox>
                          )
                        ) : daDanhGia ? (
                          <Grid container spacing={3} alignItems="center">
                            <Grid
                              item
                              xs={12}
                              md={4}
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                            >
                              <MDTypography variant="h1" color="warning" fontWeight="bold">
                                {soSao}
                              </MDTypography>
                              <Rating
                                value={soSao}
                                readOnly
                                size="large"
                                sx={{ fontSize: "3rem" }}
                              />
                              <MDTypography variant="caption" color="text">
                                Đánh giá của bạn
                              </MDTypography>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <MDBox bgColor="grey-100" borderRadius="lg" p={3}>
                                <MDTypography variant="subtitle2" fontWeight="bold">
                                  Góp ý của bạn:
                                </MDTypography>
                                {/* SỬA LỖI Ở DÒNG NÀY: Dùng &quot; thay cho " */}
                                <MDTypography variant="body2">
                                  &quot;{gopY || "Không có lời nhắn"}&quot;
                                </MDTypography>
                              </MDBox>
                            </Grid>
                          </Grid>
                        ) : (
                          <MDBox display="flex" flexDirection="column" alignItems="center">
                            <MDTypography variant="h6" color="dark" gutterBottom>
                              Bạn hài lòng với kết quả xử lý chứ?
                            </MDTypography>
                            <Rating
                              name="user-rating"
                              value={soSao}
                              onChange={(e, val) => setSoSao(val)}
                              size="large"
                              sx={{ fontSize: "3rem", mb: 2 }}
                            />
                            <TextField
                              label="Nhập góp ý..."
                              multiline
                              rows={3}
                              fullWidth
                              value={gopY}
                              onChange={(e) => setGopY(e.target.value)}
                              sx={{ mb: 2 }}
                            />
                            <MDButton
                              variant="gradient"
                              color="warning"
                              onClick={handleGuiDanhGia}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Đang gửi..." : "Gửi Đánh Giá"}
                            </MDButton>
                            {thongBao && (
                              <MDBox mt={2}>
                                <MDAlert color="success">{thongBao}</MDAlert>
                              </MDBox>
                            )}
                          </MDBox>
                        )}
                      </MDBox>
                    </Card>
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

export default ChiTietPhanAnh;
