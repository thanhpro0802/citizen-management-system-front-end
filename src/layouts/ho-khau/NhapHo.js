import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { nhapHo } from "services/hokhauService";

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

function NhapHo() {
  const { id } = useParams(); // id = maHoKhau (hộ ĐÍCH)
  const navigate = useNavigate();

  const [maNhanKhauNhapVaoText, setMaNhanKhauNhapVaoText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const parsedList = useMemo(() => {
    return maNhanKhauNhapVaoText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [maNhanKhauNhapVaoText]);

  const handleNhapHo = async (e) => {
    e.preventDefault();
    setError("");

    if (parsedList.length === 0) {
      setError("Vui lòng nhập ít nhất 1 mã nhân khẩu.");
      return;
    }

    setLoading(true);
    try {
      await nhapHo(id, {
        maHoNhapVao: id,
        maNhanKhauNhapVao: parsedList,
      });
      alert("Nhập hộ thành công!");
      navigate(`/ho-khau/${id}`);
    } catch (err) {
      setError("Nhập hộ thất bại. Vui lòng kiểm tra lại mã nhân khẩu.");
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
                bgColor="success" // Dùng màu xanh lá (success) cho Nhập hộ
                borderRadius="lg"
                coloredShadow="success"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Nhập Hộ Khẩu
                </MDTypography>
              </MDBox>

              <MDBox pt={4} pb={3} px={3}>
                <MDBox mb={2}>
                  <MDTypography variant="caption" color="text">
                    Nhập thêm thành viên vào hộ: <b>{id}</b>
                  </MDTypography>
                </MDBox>

                {error && (
                  <MDBox mb={2}>
                    <Alert severity="error">{error}</Alert>
                  </MDBox>
                )}

                <form onSubmit={handleNhapHo}>
                  <MDBox mb={3}>
                    <MDInput
                      label="Danh sách mã nhân khẩu cần nhập (UUID)"
                      placeholder="Nhập mã nhân khẩu, mỗi mã một dòng..."
                      value={maNhanKhauNhapVaoText}
                      onChange={(e) => setMaNhanKhauNhapVaoText(e.target.value)}
                      multiline
                      rows={8}
                      fullWidth
                      required
                      helperText={`Đã nhận diện: ${parsedList.length} nhân khẩu`}
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
