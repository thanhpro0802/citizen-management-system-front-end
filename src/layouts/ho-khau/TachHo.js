import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tachHo } from "services/hokhauService";

// UI Components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import { Alert } from "@mui/material";

// Custom Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function TachHo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cccdChuHoMoi, setCccdChuHoMoi] = useState("");
  const [diaChiMoi, setDiaChiMoi] = useState("");
  const [ngayDangKyMoi, setNgayDangKyMoi] = useState(new Date().toISOString().slice(0, 10));
  const [cccdTachRaText, setCccdTachRaText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cccdNhanKhauTachRa = useMemo(() => {
    return cccdTachRaText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [cccdTachRaText]);

  const handleTachHo = async (e) => {
    e.preventDefault();
    setError("");
    if (!cccdChuHoMoi.trim()) {
      setError("Vui lòng nhập CCCD chủ hộ mới.");
      return;
    }
    if (cccdNhanKhauTachRa.length === 0) {
      setError("Vui lòng nhập ít nhất 1 CCCD cần tách.");
      return;
    }

    setLoading(true);
    try {
      await tachHo(id, {
        cccdChuHoMoi: cccdChuHoMoi.trim(),
        cccdNhanKhauTachRa,
        diaChiMoi,
        ngayDangKyMoi,
      });
      alert("Tách hộ thành công!");
      navigate(`/ho-khau/${id}`);
    } catch (err) {
      setError("Tách hộ thất bại. Kiểm tra kỹ số CCCD hoặc dữ liệu đầu vào.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} md={8}>
            <Card>
              {/* Header Gradient WARNING */}
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="warning"
                borderRadius="lg"
                coloredShadow="warning"
                textAlign="center"
              >
                <MDTypography variant="h5" color="white" fontWeight="medium">
                  TÁCH HỘ KHẨU
                </MDTypography>
                <MDTypography variant="caption" color="white" opacity={0.8}>
                  Nhập thông tin cho hộ mới được tách ra
                </MDTypography>
              </MDBox>

              <MDBox pt={4} pb={3} px={3}>
                {error && (
                  <MDBox mb={2}>
                    <Alert severity="error">{error}</Alert>
                  </MDBox>
                )}
                <form onSubmit={handleTachHo}>
                  <Grid container spacing={3}>
                    {/* Cột trái: Thông tin hộ mới */}
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="button" fontWeight="bold" textTransform="uppercase">
                          1. Thông tin hộ mới
                        </MDTypography>
                      </MDBox>
                      <MDBox mb={2}>
                        <MDInput
                          label="Địa chỉ hộ mới"
                          value={diaChiMoi}
                          onChange={(e) => setDiaChiMoi(e.target.value)}
                          fullWidth
                          required
                        />
                      </MDBox>
                      <MDBox mb={2}>
                        <MDInput
                          label="CCCD Chủ hộ mới"
                          value={cccdChuHoMoi}
                          onChange={(e) => setCccdChuHoMoi(e.target.value)}
                          fullWidth
                          required
                          placeholder="Người này sẽ làm chủ hộ mới"
                        />
                      </MDBox>
                      <MDBox>
                        <MDInput
                          label="Ngày đăng ký"
                          type="date"
                          value={ngayDangKyMoi}
                          onChange={(e) => setNgayDangKyMoi(e.target.value)}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </MDBox>
                    </Grid>

                    {/* Cột phải: Danh sách người tách */}
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="button" fontWeight="bold" textTransform="uppercase">
                          2. Thành viên tách sang
                        </MDTypography>
                      </MDBox>
                      <MDInput
                        label="Nhập danh sách CCCD"
                        placeholder="Mỗi dòng một số CCCD..."
                        value={cccdTachRaText}
                        onChange={(e) => setCccdTachRaText(e.target.value)}
                        multiline
                        rows={8}
                        fullWidth
                        required
                        helperText={`Đã nhận diện: ${cccdNhanKhauTachRa.length} người`}
                      />
                    </Grid>
                  </Grid>

                  <MDBox mt={4} display="flex" justifyContent="center" gap={2}>
                    <MDButton variant="outlined" color="dark" onClick={() => navigate(-1)}>
                      Hủy bỏ
                    </MDButton>
                    <MDButton
                      type="submit"
                      variant="gradient"
                      color="warning"
                      disabled={loading}
                      startIcon={<Icon>call_split</Icon>}
                    >
                      {loading ? "Đang xử lý..." : "Xác nhận Tách"}
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

export default TachHo;
