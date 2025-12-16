import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Rating from "@mui/material/Rating"; // Component Ngôi sao
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
  const [ketQua, setKetQua] = useState(null); // Kết quả xử lý từ cán bộ
  const [loading, setLoading] = useState(true);

  // State cho phần Đánh giá
  const [soSao, setSoSao] = useState(5); // Mặc định 5 sao
  const [gopY, setGopY] = useState("");
  const [daDanhGia, setDaDanhGia] = useState(false); // Check xem đã đánh giá chưa
  const [thongBao, setThongBao] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State User Role
  const [userRole, setUserRole] = useState(null);

  const fetchFullData = async () => {
    try {
      setLoading(true);
      // 1. Lấy thông tin chi tiết
      const resInfo = await getChiTietPhanAnh(id);
      setData(resInfo.data);

      // Kiểm tra xem phản ánh này đã có đánh giá chưa (Dựa vào data trả về)
      if (resInfo.data.danhGiaHaiLong) {
        setDaDanhGia(true);
        setSoSao(resInfo.data.danhGiaHaiLong);
        setGopY(resInfo.data.gopY || "");
      }

      // 2. Lấy lịch sử để tìm "Kết quả xử lý" (Cái tin nhắn cuối cùng của Cán bộ)
      const resHistory = await getLichSuPhanAnh(id);
      if (Array.isArray(resHistory.data)) {
        // Tìm lịch sử có hành động là "PHAN_HOI" (Khi cán bộ trả lời dân)
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
    // Lấy Role từ localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserRole(parsedUser.vaiTro || (parsedUser.roles && parsedUser.roles[0]));
    }
    fetchFullData();
  }, [id]);

  // Hàm xử lý khi ấn nút "Gửi Đánh Giá"
  const handleGuiDanhGia = async () => {
    try {
      setIsSubmitting(true);
      // Gọi API (Backend cần Endpoint PUT /api/v1/phan-anh/{id}/danh-gia)
      await danhGiaPhanHoi(id, soSao, gopY);

      setThongBao("Cảm ơn! Đánh giá của bạn đã được ghi nhận.");
      setDaDanhGia(true); // Chuyển giao diện sang chế độ Read-only
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

  // Xác định màu sắc trạng thái
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
      {/* Truyền title sang Navbar để hiện thay vì ID */}
      <DashboardNavbar customTitle={data.tieuDe} />

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

                {/* Badge trạng thái nằm góc phải header */}
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
                {/* Chỉ hiện Mã ID nếu là Cán Bộ */}
                {userRole === "CAN_BO" && (
                  <MDTypography variant="caption" color="text" display="block" mb={1}>
                    ID Hồ sơ: {data.maPhanAnh}
                  </MDTypography>
                )}

                <MDTypography variant="h4" fontWeight="medium" gutterBottom>
                  {data.tieuDe}
                </MDTypography>

                <Grid container spacing={2} mb={3}>
                  <Grid item xs={12} md={6}>
                    <MDTypography variant="button" fontWeight="bold" color="text">
                      Lĩnh vực:
                    </MDTypography>
                    <MDTypography variant="body2" ml={1} component="span">
                      {data.linhVuc}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography variant="button" fontWeight="bold" color="text">
                      Ngày gửi:
                    </MDTypography>
                    <MDTypography variant="body2" ml={1} component="span">
                      {new Date(data.thoiGianTao).toLocaleDateString("vi-VN")}
                    </MDTypography>
                  </Grid>
                </Grid>

                {/* Phần nội dung chính */}
                <MDBox bgColor="grey-100" p={2} borderRadius="lg" mb={3}>
                  <MDTypography variant="h6" gutterBottom>
                    Nội dung phản ánh:
                  </MDTypography>
                  <MDTypography variant="body2" style={{ whiteSpace: "pre-line" }}>
                    {data.noiDung}
                  </MDTypography>

                  {/* Hiển thị ảnh nếu có */}
                  {data.hinhAnh && (
                    <MDBox mt={2}>
                      <img
                        src={data.hinhAnh}
                        alt="Ảnh đính kèm"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "300px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                      />
                    </MDBox>
                  )}
                </MDBox>

                <Divider />

                {/* --- PHẦN KẾT QUẢ XỬ LÝ (Chỉ hiện khi đã có phản hồi) --- */}
                <MDTypography variant="h6" color="success" gutterBottom mt={3}>
                  <Icon sx={{ verticalAlign: "middle", mr: 1 }}>check_circle</Icon>
                  Kết quả xử lý / Phản hồi từ cơ quan:
                </MDTypography>

                {ketQua ? (
                  <MDBox
                    bgColor="#e8f5e9" // Màu xanh nhạt
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

                {/* --- PHẦN ĐÁNH GIÁ (LOGIC QUAN TRỌNG) --- */}
                {/* Chỉ hiện khi Trạng thái là DA_XU_LY */}
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
                        {daDanhGia
                          ? "Đánh giá của bạn:"
                          : "Đánh giá mức độ hài lòng về kết quả xử lý:"}
                      </MDTypography>

                      <MDBox display="flex" alignItems="center" mb={2}>
                        <Rating
                          name="rating-feedback"
                          value={soSao}
                          onChange={(event, newValue) => {
                            // Chỉ cho sửa nếu chưa đánh giá
                            if (!daDanhGia && newValue !== null) setSoSao(newValue);
                          }}
                          readOnly={daDanhGia} // Nếu đã đánh giá -> ReadOnly
                          size="large"
                        />
                        <MDTypography variant="button" ml={2} fontWeight="bold" color="text">
                          ({soSao} sao)
                        </MDTypography>
                      </MDBox>

                      {/* Nếu chưa đánh giá -> Hiện Form nhập */}
                      {!daDanhGia ? (
                        <MDBox>
                          <TextField
                            label="Góp ý thêm (Tùy chọn)"
                            placeholder="Bạn có hài lòng với cách xử lý không?"
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
                        // Nếu đã đánh giá -> Hiện kết quả text
                        <MDBox bgColor="grey-100" p={2} borderRadius="lg">
                          <MDTypography variant="caption" fontWeight="bold" color="text">
                            Góp ý:
                          </MDTypography>
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
