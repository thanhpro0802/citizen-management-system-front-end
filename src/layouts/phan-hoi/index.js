import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API Service
import { phanHoiCongDan } from "services/phanAnhService";

function PhanHoi() {
  const [maPhanAnh, setMaPhanAnh] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [thongBao, setThongBao] = useState("");

  const handleSubmit = async () => {
    try {
      // Gọi API Phản Hồi (Đây là API sẽ chuyển trạng thái sang DA_XU_LY)
      await phanHoiCongDan(maPhanAnh, noiDung);

      setThongBao("Đã gửi phản hồi & Đóng hồ sơ thành công!");
      setNoiDung("");
    } catch (error) {
      console.error(error);
      setThongBao("Lỗi: Không tìm thấy ID hoặc hồ sơ đã đóng.");
    }
  };

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
                bgColor="success" // Màu xanh lá (Tượng trưng cho Hoàn thành)
                borderRadius="lg"
                coloredShadow="success"
              >
                <MDTypography variant="h6" color="white">
                  Trả Lời & Đóng Hồ Sơ
                </MDTypography>
              </MDBox>

              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <MDBox mb={2}>
                    <MDTypography variant="caption" color="text">
                      Nhập ID phản ánh đã xử lý xong để trả lời cho dân.
                    </MDTypography>
                    <TextField
                      label="Mã Phản Ánh (ID)"
                      fullWidth
                      value={maPhanAnh}
                      onChange={(e) => setMaPhanAnh(e.target.value)}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <TextField
                      label="Nội dung phản hồi chính thức (VD: Đã khắc phục xong...)"
                      multiline
                      rows={5}
                      fullWidth
                      value={noiDung}
                      onChange={(e) => setNoiDung(e.target.value)}
                    />
                  </MDBox>

                  {thongBao && (
                    <MDTypography variant="caption" color="success" fontWeight="bold">
                      {thongBao}
                    </MDTypography>
                  )}

                  <MDBox mt={4} mb={1}>
                    <MDButton variant="gradient" color="success" fullWidth onClick={handleSubmit}>
                      Gửi Phản Hồi & Đóng
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default PhanHoi;
