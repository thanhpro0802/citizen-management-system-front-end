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
import { capNhatXuLyNoiBo } from "services/phanAnhService";

function XuLyPhanAnh() {
  const [maPhanAnh, setMaPhanAnh] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [thongBao, setThongBao] = useState("");

  const handleSubmit = async () => {
    try {
      // Giả lập gửi kèm 1 file ảnh (sau này sẽ làm upload thật)
      const fakeFiles = ["http://link-anh-gia-lap.com/anh1.jpg"];

      await capNhatXuLyNoiBo(maPhanAnh, noiDung, fakeFiles);

      setThongBao("Cập nhật xử lý thành công!");
      setNoiDung(""); // Xóa nội dung sau khi gửi
    } catch (error) {
      console.error(error);
      setThongBao("Lỗi: Không tìm thấy ID phản ánh hoặc Server lỗi.");
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
                bgColor="warning" // Màu cam để phân biệt với trang Công dân
                borderRadius="lg"
                coloredShadow="warning"
              >
                <MDTypography variant="h6" color="white">
                  Cán Bộ Xử Lý (Nội Bộ)
                </MDTypography>
              </MDBox>

              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <MDBox mb={2}>
                    <MDTypography variant="caption" color="text">
                      Nhập ID của phản ánh cần xử lý (Lấy từ trang Lịch sử hoặc Database)
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
                      label="Nội dung xử lý (VD: Đã cử người xuống kiểm tra...)"
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
                    <MDButton variant="gradient" color="warning" fullWidth onClick={handleSubmit}>
                      Cập Nhật Xử Lý
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

export default XuLyPhanAnh;
