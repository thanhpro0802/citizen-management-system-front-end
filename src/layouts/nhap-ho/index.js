import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDAlert from "components/MDAlert";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import hoKhauService from "services/hoKhauService";

function NhapHo() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State nhập liệu CCCD
  const [cccdInput, setCccdInput] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  const handleSubmit = async () => {
    if (!cccdInput.trim()) {
      setMessage({ type: "error", content: "Vui lòng nhập số CCCD!" });
      return;
    }

    setSubmitting(true);
    try {
      // Tách chuỗi nhập vào thành mảng (ngăn cách bằng dấu phẩy)
      const listCccd = cccdInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");

      const payload = {
        // Gửi danh sách CCCD thay vì mã nhân khẩu
        cccdNhapVao: listCccd,
      };

      await hoKhauService.nhapHo(id, payload);

      setMessage({ type: "success", content: "Nhập hộ thành công!" });
      // Chuyển trang sau 1.5s
      setTimeout(() => navigate(`/chi-tiet-ho-khau/${id}`), 1500);
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.data?.message || "Lỗi khi nhập hộ. Vui lòng kiểm tra lại số CCCD.";
      setMessage({ type: "error", content: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12} lg={6} mx="auto">
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="secondary"
                borderRadius="lg"
                coloredShadow="secondary"
              >
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" color="white">
                    Nhập Hộ Khẩu
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

              <MDBox pt={4} px={3} pb={3}>
                {message.content && (
                  <MDAlert
                    color={message.type}
                    dismissible
                    onClose={() => setMessage({ type: "", content: "" })}
                  >
                    {message.content}
                  </MDAlert>
                )}

                <MDTypography variant="body2" mb={2}>
                  Nhập <strong>Số CCCD</strong> của người dân cần thêm vào hộ khẩu này.
                  <br />
                  (Nếu nhập nhiều người cùng lúc, hãy ngăn cách các số CCCD bằng dấu phẩy)
                </MDTypography>

                <MDInput
                  label="Số CCCD"
                  fullWidth
                  multiline
                  rows={3}
                  value={cccdInput}
                  onChange={(e) => setCccdInput(e.target.value)}
                  placeholder="Ví dụ: 001234567890, 001987654321..."
                />

                <MDBox mt={3} display="flex" justifyContent="center">
                  <MDButton
                    variant="gradient"
                    color="secondary"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? "Đang xử lý..." : "Xác Nhận Nhập Hộ"}
                  </MDButton>
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

export default NhapHo;
