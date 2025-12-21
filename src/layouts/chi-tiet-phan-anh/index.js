import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Rating from "@mui/material/Rating"; // <-- Import Ngôi sao
import TextField from "@mui/material/TextField";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert"; // Import thông báo

// Example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API
import { getChiTietPhanAnh, getLichSuPhanAnh, danhGiaPhanHoi } from "services/phanAnhService";

function ChiTietPhanAnh() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [ketQua, setKetQua] = useState(null);

  // State cho phần Đánh giá
  const [soSao, setSoSao] = useState(5); // Mặc định 5 sao
  const [gopY, setGopY] = useState("");
  const [daDanhGia, setDaDanhGia] = useState(false);
  const [thongBao, setThongBao] = useState("");

  const fetchFullData = async () => {
    try {
      // 1. Lấy thông tin
      const resInfo = await getChiTietPhanAnh(id);
      setData(resInfo.data);

      // Kiểm tra xem đã đánh giá chưa (dựa vào data từ DB)
      if (resInfo.data.danhGiaHaiLong) {
        setDaDanhGia(true);
        setSoSao(resInfo.data.danhGiaHaiLong);
        setGopY(resInfo.data.gopY || "");
      }

      // 2. Lấy lịch sử (để xem kết quả phản hồi)
      const resHistory = await getLichSuPhanAnh(id);
      if (Array.isArray(resHistory.data)) {
        const phanHoiCuoiCung = resHistory.data.find((h) => h.hanhDong === "PHAN_HOI");
        if (phanHoiCuoiCung) {
          setKetQua(phanHoiCuoiCung.noiDung);
        }
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    fetchFullData();
  }, [id]);

  // Hàm xử lý gửi đánh giá
  const handleGuiDanhGia = async () => {
    try {
      await danhGiaPhanHoi(id, soSao, gopY);
      setThongBao("Cảm ơn bạn đã đánh giá!");
      setDaDanhGia(true); // Chuyển sang chế độ xem
    } catch (error) {
      console.error(error);
      setThongBao("Lỗi khi gửi đánh giá.");
    }
  };

  if (!data)
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </MDBox>
    );

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
                  Chi Tiết Phản Ánh
                </MDTypography>
              </MDBox>

              <MDBox p={4}>
                <MDTypography variant="h5" gutterBottom>
                  {data.tieuDe}
                </MDTypography>

                <MDTypography variant="button" color="text" fontWeight="bold">
                  Lĩnh vực:
                </MDTypography>
                <MDTypography variant="body2" color="text" mb={2}>
                  {data.linhVuc}
                </MDTypography>

                <Divider />

                <MDTypography variant="h6" gutterBottom>
                  Nội dung phản ánh:
                </MDTypography>
                <MDTypography variant="body2" mb={3} style={{ whiteSpace: "pre-line" }}>
                  {data.noiDung}
                </MDTypography>

                {/* --- KẾT QUẢ XỬ LÝ --- */}
                <Divider />
                <MDTypography variant="h6" color="success" gutterBottom>
                  Kết quả xử lý / Phản hồi:
                </MDTypography>

                {ketQua ? (
                  <MDBox
                    bgColor="grey-100"
                    p={2}
                    borderRadius="lg"
                    border="1px solid #4caf50"
                    mb={3}
                  >
                    <MDTypography variant="body2" fontWeight="bold">
                      {ketQua}
                    </MDTypography>
                  </MDBox>
                ) : (
                  <MDTypography variant="caption" color="text" mb={3}>
                    (Chưa có kết quả phản hồi chính thức từ cán bộ)
                  </MDTypography>
                )}

                {/* --- PHẦN ĐÁNH GIÁ (CHỈ HIỆN KHI ĐÃ XỬ LÝ XONG) --- */}
                {data.trangThaiHienTai === "DA_XU_LY" && (
                  <>
                    <Divider />
                    <MDTypography variant="h6" gutterBottom mt={2}>
                      Đánh giá mức độ hài lòng:
                    </MDTypography>

                    <MDBox display="flex" alignItems="center" mb={2}>
                      <Rating
                        name="simple-controlled"
                        value={soSao}
                        onChange={(event, newValue) => {
                          if (!daDanhGia) setSoSao(newValue);
                        }}
                        readOnly={daDanhGia} // Nếu đã đánh giá thì không cho sửa
                        size="large"
                      />
                      <MDTypography variant="button" ml={2} color="text">
                        ({soSao} sao)
                      </MDTypography>
                    </MDBox>

                    {/* Form nhập góp ý */}
                    {!daDanhGia ? (
                      <MDBox>
                        <TextField
                          label="Góp ý thêm (Tùy chọn)"
                          multiline
                          rows={3}
                          fullWidth
                          value={gopY}
                          onChange={(e) => setGopY(e.target.value)}
                        />
                        <MDBox mt={2}>
                          <MDButton variant="gradient" color="warning" onClick={handleGuiDanhGia}>
                            Gửi Đánh Giá
                          </MDButton>
                        </MDBox>
                      </MDBox>
                    ) : (
                      <MDBox bgColor="grey-100" p={2} borderRadius="lg" mt={1}>
                        <MDTypography variant="caption" fontWeight="bold">
                          Góp ý của bạn:
                        </MDTypography>
                        <MDTypography variant="body2">{gopY || "Không có góp ý thêm"}</MDTypography>
                      </MDBox>
                    )}

                    {thongBao && (
                      <MDBox mt={2}>
                        <MDAlert color="success">{thongBao}</MDAlert>
                      </MDBox>
                    )}
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
