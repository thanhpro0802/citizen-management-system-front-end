import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tachHo } from "services/hokhauService";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Alert } from "@mui/material";
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
      // Gửi field theo CCCD
      await tachHo(id, {
        cccdChuHoMoi: cccdChuHoMoi.trim(),
        cccdNhanKhauTachRa, // List string CCCD
        diaChiMoi,
        ngayDangKyMoi,
      });
      alert("Tách hộ thành công!");
      navigate(`/ho-khau/${id}`);
    } catch (err) {
      setError("Tách hộ thất bại. Kiểm tra kỹ số CCCD có tồn tại trong hộ cũ không.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="warning"
                borderRadius="lg"
                coloredShadow="warning"
              >
                <MDTypography variant="h6" color="white">
                  Tách Hộ Khẩu (bằng CCCD)
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
                    <Grid item xs={12} md={8}>
                      <MDInput
                        label="Số CCCD Chủ hộ mới"
                        value={cccdChuHoMoi}
                        onChange={(e) => setCccdChuHoMoi(e.target.value)}
                        fullWidth
                        required
                        placeholder="Nhập số CCCD..."
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <MDInput
                        label="Ngày tạo hộ mới"
                        type="date"
                        value={ngayDangKyMoi}
                        onChange={(e) => setNgayDangKyMoi(e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <MDInput
                        label="Địa chỉ hộ mới"
                        value={diaChiMoi}
                        onChange={(e) => setDiaChiMoi(e.target.value)}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <MDInput
                        label="Danh sách CCCD thành viên cần tách"
                        placeholder="Nhập số CCCD, mỗi số một dòng..."
                        value={cccdTachRaText}
                        onChange={(e) => setCccdTachRaText(e.target.value)}
                        multiline
                        rows={6}
                        fullWidth
                        required
                        helperText={`Đã nhận diện: ${cccdNhanKhauTachRa.length} người`}
                      />
                    </Grid>
                  </Grid>
                  <MDBox mt={4} display="flex" justifyContent="flex-end" gap={2}>
                    <MDButton variant="outlined" color="dark" onClick={() => navigate(-1)}>
                      Hủy bỏ
                    </MDButton>
                    <MDButton type="submit" variant="gradient" color="warning" disabled={loading}>
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
