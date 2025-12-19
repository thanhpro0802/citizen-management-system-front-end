import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tachHo } from "services/hokhauService";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Alert } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function TachHo() {
  const { id } = useParams(); // id = maHoKhau (hộ CŨ)
  const navigate = useNavigate();

  const [maNhanKhauChuHoMoi, setMaNhanKhauChuHoMoi] = useState("");
  const [diaChiMoi, setDiaChiMoi] = useState("");
  const [ngayDangKyMoi, setNgayDangKyMoi] = useState(new Date().toISOString().slice(0, 10));
  const [maNhanKhauTachRaText, setMaNhanKhauTachRaText] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const maNhanKhauTachRa = useMemo(() => {
    return maNhanKhauTachRaText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [maNhanKhauTachRaText]);

  const handleTachHo = async (e) => {
    e.preventDefault();
    setError("");

    if (!maNhanKhauChuHoMoi.trim()) {
      setError("Vui lòng nhập mã nhân khẩu chủ hộ mới.");
      return;
    }
    if (maNhanKhauTachRa.length === 0) {
      setError("Vui lòng nhập ít nhất 1 mã nhân khẩu cần tách.");
      return;
    }

    setLoading(true);
    try {
      const res = await tachHo(id, {
        maNhanKhauChuHoMoi: maNhanKhauChuHoMoi.trim(),
        maNhanKhauTachRa,
        diaChiMoi,
        ngayDangKyMoi,
      });

      alert("Tách hộ thành công!");
      const hoMoi = res.data;
      navigate(`/ho-khau/${hoMoi?.maHoKhau || id}`);
    } catch (err) {
      setError("Tách hộ thất bại. Kiểm tra kỹ các mã nhân khẩu (phải thuộc hộ cũ).");
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
                bgColor="warning" // Dùng màu cam (warning) cho khác biệt vì đây là Tách hộ
                borderRadius="lg"
                coloredShadow="warning"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Tách Hộ Khẩu
                </MDTypography>
              </MDBox>

              <MDBox pt={4} pb={3} px={3}>
                <MDBox mb={2}>
                  <MDTypography variant="caption" color="text">
                    Tách từ hộ khẩu nguồn: <b>{id}</b>
                  </MDTypography>
                </MDBox>

                {error && (
                  <MDBox mb={2}>
                    <Alert severity="error">{error}</Alert>
                  </MDBox>
                )}

                <form onSubmit={handleTachHo}>
                  <Grid container spacing={3}>
                    {/* Hàng 1: Chủ hộ mới & Ngày đăng ký */}
                    <Grid item xs={12} md={8}>
                      <MDInput
                        label="Mã Chủ hộ mới (UUID)"
                        value={maNhanKhauChuHoMoi}
                        onChange={(e) => setMaNhanKhauChuHoMoi(e.target.value)}
                        fullWidth
                        required
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

                    {/* Hàng 2: Địa chỉ mới */}
                    <Grid item xs={12}>
                      <MDInput
                        label="Địa chỉ hộ mới"
                        value={diaChiMoi}
                        onChange={(e) => setDiaChiMoi(e.target.value)}
                        fullWidth
                        required
                      />
                    </Grid>

                    {/* Hàng 3: Danh sách tách */}
                    <Grid item xs={12}>
                      <MDInput
                        label="Danh sách mã nhân khẩu cần tách (UUID)"
                        placeholder="Dán các mã UUID vào đây, mỗi mã một dòng..."
                        value={maNhanKhauTachRaText}
                        onChange={(e) => setMaNhanKhauTachRaText(e.target.value)}
                        multiline
                        rows={6}
                        fullWidth
                        required
                        helperText={`Đã nhận diện: ${maNhanKhauTachRa.length} nhân khẩu`}
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
