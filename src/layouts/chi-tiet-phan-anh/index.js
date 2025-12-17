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

  // State User Role
  const [userRole, setUserRole] = useState(null);

  // --- HÀM CHUYỂN ĐỔI MÃ LĨNH VỰC SANG TIẾNG VIỆT ---
  const getLinhVucLabel = (code) => {
    switch (code) {
      case "AN_NINH_TRAT_TU":
        return "An ninh trật tự";
      case "VE_SINH_MOI_TRUONG":
        return "Vệ sinh môi trường";
      case "HA_TANG_DO_THI":
        return "Hạ tầng đô thị";
      case "KHAC":
        return "Khác";
      default:
        return code; // Nếu không khớp thì giữ nguyên
    }
  };
  // --------------------------------------------------

  const fetchFullData = async () => {
    try {
      setLoading(true);

      // 1. Lấy thông tin chi tiết
      const resInfo = await getChiTietPhanAnh(id);
      setData(resInfo.data);

      if (resInfo.data.danhGiaHaiLong) {
        setDaDanhGia(true);
        setSoSao(resInfo.data.danhGiaHaiLong);
        setGopY(resInfo.data.gopY || "");
      }

      // 2. Lấy lịch sử
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
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserRole(parsedUser.vaiTro || (parsedUser.roles && parsedUser.roles[0]));
    }
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

  if (loading || !data)
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </MDBox>
    );

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
                {userRole === "CAN_BO" && (
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

                    {/* --- ĐÃ SỬA: GỌI HÀM CHUYỂN ĐỔI TẠI ĐÂY --- */}
                    <MDTypography variant="body2" ml={1} component="span">
                      {getLinhVucLabel(data.linhVuc)}
                    </MDTypography>
                    {/* ------------------------------------------- */}
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
                </Grid>

                {/* --- PHẦN NỘI DUNG & ẢNH --- */}
                <MDBox bgColor="grey-100" p={2} borderRadius="lg" mb={3}>
                  <MDTypography variant="h6" gutterBottom>
                    Nội dung phản ánh:
                  </MDTypography>

                  <MDTypography variant="body2" style={{ whiteSpace: "pre-line" }} color="text">
                    {data.noiDung || "Không có nội dung chi tiết."}
                  </MDTypography>

                  {data.tepDinhKems && data.tepDinhKems.length > 0 && (
                    <MDBox mt={3}>
                      <MDTypography variant="caption" fontWeight="bold" color="text">
                        Minh chứng đính kèm:
                      </MDTypography>
                      <MDBox mt={1} display="flex" gap={2} flexWrap="wrap">
                        {data.tepDinhKems.map((tep, index) => (
                          <MDBox
                            key={index}
                            component="img"
                            src={tep.url}
                            alt="minh-chung"
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
                    </MDBox>
                  )}
                </MDBox>

                <Divider />

                {/* --- KẾT QUẢ XỬ LÝ --- */}
                <MDTypography variant="h6" color="success" gutterBottom mt={3}>
                  <Icon sx={{ verticalAlign: "middle", mr: 1 }}>check_circle</Icon>
                  Kết quả xử lý / Phản hồi từ cơ quan:
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

                {/* --- KHU VỰC ĐÁNH GIÁ --- */}
                {data.trangThaiHienTai === "DA_XU_LY" && (
                  <>
                    <Divider />
                    <MDBox
                      mt={3}
                      p={3}
                      borderRadius="xl"
                      bgColor={daDanhGia ? "#fff" : "#fff8e1"}
                      border={daDanhGia ? "" : "1px dashed #ffb300"}
                    >
                      <MDTypography
                        variant="h5"
                        gutterBottom
                        color={daDanhGia ? "dark" : "warning"}
                      >
                        {daDanhGia ? "Đánh giá của bạn:" : "Đánh giá mức độ hài lòng:"}
                      </MDTypography>

                      <MDBox display="flex" alignItems="center" mb={2}>
                        <Rating
                          value={soSao}
                          onChange={(e, val) => !daDanhGia && val !== null && setSoSao(val)}
                          readOnly={daDanhGia}
                          size="large"
                        />
                        <MDTypography variant="button" ml={2} fontWeight="bold">
                          ({soSao} sao)
                        </MDTypography>
                      </MDBox>

                      {!daDanhGia ? (
                        <MDBox>
                          <TextField
                            label="Góp ý thêm"
                            multiline
                            rows={3}
                            fullWidth
                            value={gopY}
                            onChange={(e) => setGopY(e.target.value)}
                            sx={{ mb: 2, bgcolor: "white" }}
                          />
                          <MDButton
                            variant="gradient"
                            color="warning"
                            onClick={handleGuiDanhGia}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Đang gửi..." : "Gửi Đánh Giá"}
                          </MDButton>
                        </MDBox>
                      ) : (
                        <MDBox bgColor="grey-100" p={2} borderRadius="lg">
                          <MDTypography variant="body2">
                            {gopY || "Không có góp ý thêm."}
                          </MDTypography>
                        </MDBox>
                      )}

                      {thongBao && (
                        <MDBox mt={2}>
                          <MDAlert color="success">{thongBao}</MDAlert>
                        </MDBox>
                      )}
                    </MDBox>
                  </>
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
