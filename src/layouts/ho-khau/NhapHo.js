import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { nhapHo } from "services/hokhauService";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Alert } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function NhapHo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cccdNhapVaoText, setCccdNhapVaoText] = useState("");
  const [quanHe, setQuanHe] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const parsedList = useMemo(() => {
    return cccdNhapVaoText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [cccdNhapVaoText]);

  const handleNhapHo = async (e) => {
    e.preventDefault();
    setError("");
    if (parsedList.length === 0) {
      setError("Vui lòng nhập ít nhất 1 số CCCD.");
      return;
    }
    setLoading(true);
    try {
      await nhapHo(id, {
        maHoNhapVao: id,
        cccdNhanKhauNhapVao: parsedList, // Gửi list CCCD
        quanHeVoiChuHo: quanHe.trim() || "Thành viên",
      });
      alert("Nhập hộ thành công!");
      navigate(`/ho-khau/${id}`);
    } catch (err) {
      setError("Nhập hộ thất bại. Kiểm tra lại số CCCD.");
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
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="success"
                borderRadius="lg"
                coloredShadow="success"
              >
                <MDTypography variant="h6" color="white">
                  Nhập Hộ Khẩu (bằng CCCD)
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                {error && (
                  <MDBox mb={2}>
                    <Alert severity="error">{error}</Alert>
                  </MDBox>
                )}
                <form onSubmit={handleNhapHo}>
                  <MDBox mb={3}>
                    <MDInput
                      label="Danh sách CCCD cần nhập"
                      placeholder="Nhập số CCCD, mỗi số một dòng..."
                      value={cccdNhapVaoText}
                      onChange={(e) => setCccdNhapVaoText(e.target.value)}
                      multiline
                      rows={8}
                      fullWidth
                      required
                      helperText={`Đã nhận diện: ${parsedList.length} người`}
                    />
                  </MDBox>
                  <MDBox mb={3}>
                    <MDInput
                      label="Quan hệ với chủ hộ"
                      placeholder="VD: Con, Cháu..."
                      value={quanHe}
                      onChange={(e) => setQuanHe(e.target.value)}
                      fullWidth
                    />
                  </MDBox>
                  <MDBox display="flex" justifyContent="flex-end" gap={2}>
                    <MDButton variant="outlined" color="dark" onClick={() => navigate(-1)}>
                      Hủy bỏ
                    </MDButton>
                    <MDButton type="submit" variant="gradient" color="success" disabled={loading}>
                      {loading ? "Đang xử lý..." : "Xác nhận Nhập"}
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

export default NhapHo;
