import { useState } from "react";
import { useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";

// --- THÊM CÁC IMPORT NÀY ĐỂ SỬA LỖI GIAO DIỆN ---
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
// ------------------------------------------------

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API Services
import { guiPhanAnhMoi } from "services/phanAnhService";
import { uploadToCloudinary } from "services/uploadService";

// Danh sách lĩnh vực
const linhVucs = [
  { value: "AN_NINH_TRAT_TU", label: "An ninh trật tự" },
  { value: "VE_SINH_MOI_TRUONG", label: "Vệ sinh môi trường" },
  { value: "HA_TANG_DO_THI", label: "Hạ tầng đô thị" },
  { value: "KHAC", label: "Khác" },
];

function GuiPhanAnh() {
  const navigate = useNavigate();

  // State Form
  const [tieuDe, setTieuDe] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [linhVuc, setLinhVuc] = useState("AN_NINH_TRAT_TU"); // Mặc định chọn cái đầu tiên cho đẹp

  // State File & Loading
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  // 1. XỬ LÝ CHỌN FILE
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  // 2. XỬ LÝ XÓA FILE
  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // 3. XỬ LÝ GỬI FORM
  const handleSubmit = async () => {
    if (!tieuDe || !noiDung) {
      setMessage({ type: "error", content: "Vui lòng nhập tiêu đề và nội dung!" });
      return;
    }

    setIsUploading(true);

    try {
      // BƯỚC A: Upload file
      const listUrlAnh = [];
      if (selectedFiles.length > 0) {
        console.log("Bắt đầu upload...", selectedFiles.length, "file"); // <--- LOG 1

        const uploadPromises = selectedFiles.map((file) => uploadToCloudinary(file));
        const urls = await Promise.all(uploadPromises);

        console.log("Kết quả từ Cloudinary:", urls); // <--- LOG 2: QUAN TRỌNG NHẤT

        listUrlAnh.push(...urls);
      } else {
        console.log("Không có file nào được chọn!"); // <--- LOG 3
      }

      // BƯỚC B: Gọi API Backend
      await guiPhanAnhMoi({
        tieuDe,
        noiDung,
        linhVuc,
        danhSachFileUrl: listUrlAnh,
      });

      setMessage({ type: "success", content: "Gửi phản ánh thành công!" });

      setTimeout(() => navigate("/lich-su-phan-anh"), 2000);
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        content: "Lỗi khi gửi phản ánh (Kiểm tra mạng hoặc Cloudinary).",
      });
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
                  Gửi Phản Ánh Mới
                </MDTypography>
              </MDBox>

              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  {message.content && (
                    <MDBox mb={2}>
                      <MDAlert
                        color={message.type}
                        dismissible
                        onClose={() => setMessage({ type: "", content: "" })}
                      >
                        {message.content}
                      </MDAlert>
                    </MDBox>
                  )}

                  {/* --- ĐÃ SỬA LẠI PHẦN NÀY --- */}
                  <MDBox mb={2}>
                    <FormControl fullWidth>
                      <InputLabel id="linh-vuc-label">Lĩnh Vực</InputLabel>
                      <Select
                        labelId="linh-vuc-label"
                        id="linh-vuc-select"
                        value={linhVuc}
                        label="Lĩnh Vực"
                        onChange={(e) => setLinhVuc(e.target.value)}
                        sx={{ height: 45 }} // Chỉnh chiều cao cho thoáng
                      >
                        {linhVucs.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </MDBox>
                  {/* --------------------------- */}

                  <MDBox mb={2}>
                    <TextField
                      label="Tiêu Đề"
                      fullWidth
                      value={tieuDe}
                      onChange={(e) => setTieuDe(e.target.value)}
                    />
                  </MDBox>

                  <MDBox mb={2}>
                    <TextField
                      label="Nội Dung Chi Tiết"
                      multiline
                      rows={5}
                      fullWidth
                      value={noiDung}
                      onChange={(e) => setNoiDung(e.target.value)}
                    />
                  </MDBox>

                  {/* --- KHU VỰC CHỌN ẢNH & PREVIEW --- */}
                  <MDBox mb={2}>
                    <MDTypography variant="caption" fontWeight="bold" display="block" mb={1}>
                      Hình ảnh đính kèm (Nếu có):
                    </MDTypography>

                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="raised-button-file"
                      multiple
                      type="file"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="raised-button-file">
                      <MDButton variant="outlined" component="span" color="info" size="small">
                        <Icon>upload_file</Icon>&nbsp; Chọn Ảnh
                      </MDButton>
                    </label>

                    {selectedFiles.length > 0 && (
                      <MDBox mt={2} display="flex" flexWrap="wrap" gap={2}>
                        {selectedFiles.map((file, index) => (
                          <MDBox
                            key={index}
                            position="relative"
                            width="100px"
                            height="100px"
                            borderRadius="lg"
                            overflow="hidden"
                            border="1px solid #ddd"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt="preview"
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />

                            <MDBox
                              position="absolute"
                              top={0}
                              right={0}
                              bgColor="white"
                              style={{ cursor: "pointer", borderRadius: "0 0 0 8px" }}
                              onClick={() => handleRemoveFile(index)}
                            >
                              <Icon color="error" fontSize="small">
                                close
                              </Icon>
                            </MDBox>
                          </MDBox>
                        ))}
                      </MDBox>
                    )}
                  </MDBox>

                  <MDBox mt={4} mb={1}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      fullWidth
                      onClick={handleSubmit}
                      disabled={isUploading}
                    >
                      {isUploading ? "Đang xử lý & Tải ảnh..." : "Gửi Phản Ánh"}
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
