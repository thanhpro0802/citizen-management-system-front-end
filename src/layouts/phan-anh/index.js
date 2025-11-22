import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API Service
import { guiPhanAnhMoi } from "services/phanAnhService";
import { uploadFileToCloud } from "services/uploadService";

function GuiPhanAnh() {
  // State quản lý form
  const [tieuDe, setTieuDe] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [linhVuc, setLinhVuc] = useState("");
  const [thongBao, setThongBao] = useState(""); // Để hiện thông báo lỗi/thành công
  const [file, setFile] = useState(null); // Luu file nguoi dung chon
  const [isUploading, setIsUploading] = useState(false); // Trang thai dang upload

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsUploading(true);
      let danhSachFileGuiDi = [];

      // 1. Neu co chon file upload len Cloudinary truoc
      if (file) {
        const urlThat = await uploadFileToCloud(file);
        danhSachFileGuiDi.push(urlThat); // Them url vao mang
      }

      // 2. Gui du lieu kem URL anh ve Backend
      await guiPhanAnhMoi(tieuDe, noiDung, linhVuc, danhSachFileGuiDi);

      setThongBao("Gửi thành công! Cảm ơn bạn.");
      // Reset form
      setTieuDe("");
      setNoiDung("");
      setLinhVuc("");
      setFile(null);
    } catch (error) {
      console.error(error);
      setThongBao("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
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
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Gửi Phản Ánh Kiến Nghị
                </MDTypography>
              </MDBox>

              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <MDBox mb={2}>
                    <TextField
                      label="Tiêu đề"
                      fullWidth
                      value={tieuDe}
                      onChange={(e) => setTieuDe(e.target.value)}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <TextField
                      label="Lĩnh vực (VD: An ninh, Môi trường)"
                      fullWidth
                      value={linhVuc}
                      onChange={(e) => setLinhVuc(e.target.value)}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <TextField
                      label="Nội dung chi tiết"
                      multiline
                      rows={5}
                      fullWidth
                      value={noiDung}
                      onChange={(e) => setNoiDung(e.target.value)}
                    />
                  </MDBox>

                  <MDBox mb={2}>
                    <MDTypography variant="caption" fontWeight="bold" display="block">
                      Đính kèm hình ảnh (Tùy chọn):
                    </MDTypography>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: "block", marginTop: "8px" }}
                    />
                    {file && (
                      <MDTypography variant="caption" color="info" mt={1} display="block">
                        Đã chọn: {file.name}
                      </MDTypography>
                    )}
                  </MDBox>

                  {/* Thông báo trạng thái */}
                  {thongBao && (
                    <MDTypography
                      variant="caption"
                      color={thongBao.includes("lỗi") ? "error" : "success"}
                      fontWeight="bold"
                    >
                      {thongBao}
                    </MDTypography>
                  )}

                  <MDBox mt={4} mb={1}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      fullWidth
                      onClick={handleSubmit}
                      disabled={isUploading} // Khóa nút khi đang quay
                    >
                      {isUploading ? <CircularProgress size={20} color="white" /> : "Gửi Phản Ánh"}
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

export default GuiPhanAnh;
