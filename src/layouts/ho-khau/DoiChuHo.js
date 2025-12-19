import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { thayDoiChuHo } from "services/hokhauService";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import { Alert } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function DoiChuHo() {
  const { id } = useParams(); // id = maHoKhau
  const navigate = useNavigate();

  const [maNhanKhauMoi, setMaNhanKhauMoi] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDoiChuHo = async (e) => {
    e.preventDefault();
    setError("");

    if (!maNhanKhauMoi.trim()) {
      setError("Vui lòng nhập mã nhân khẩu mới (UUID).");
      return;
    }

    setLoading(true);
    try {
      await thayDoiChuHo(id, { maNhanKhauMoi: maNhanKhauMoi.trim() });
      alert("Đổi chủ hộ thành công!");
      navigate(`/ho-khau/${id}`);
    } catch (err) {
      setError("Đổi chủ hộ thất bại. Vui lòng kiểm tra mã nhân khẩu có tồn tại không.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} md={8} lg={6}>
            <Card>
              {/* Header Gradient */}
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
                  Thay Đổi Chủ Hộ
                </MDTypography>
              </MDBox>

              <MDBox pt={4} pb={3} px={3}>
                <MDBox mb={2}>
                  <MDTypography variant="caption" fontWeight="regular" color="text">
                    Đang thực hiện cho hộ khẩu mã: <b>{id}</b>
                  </MDTypography>
                </MDBox>

                {error && (
                  <MDBox mb={2}>
                    <Alert severity="error">{error}</Alert>
                  </MDBox>
                )}

                <form onSubmit={handleDoiChuHo}>
                  <MDBox mb={2}>
                    <MDInput
                      label="Mã nhân khẩu chủ hộ mới (UUID)"
                      value={maNhanKhauMoi}
                      onChange={(e) => setMaNhanKhauMoi(e.target.value)}
                      fullWidth
                      required
                      placeholder="Nhập UUID của người sẽ làm chủ hộ mới..."
                    />
                  </MDBox>

                  <MDBox mt={4} display="flex" justifyContent="flex-end" gap={2}>
                    <MDButton variant="outlined" color="secondary" onClick={() => navigate(-1)}>
                      Hủy bỏ
                    </MDButton>
                    <MDButton type="submit" variant="gradient" color="info" disabled={loading}>
                      {loading ? "Đang xử lý..." : "Xác nhận đổi"}
                    </MDButton>
                  </MDBox>
                </form>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default DoiChuHo;
