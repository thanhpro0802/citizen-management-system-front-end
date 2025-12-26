import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import hoKhauService from "services/hoKhauService";

function DoiChuHo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hoKhau, setHoKhau] = useState(null);
  const [newOwnerId, setNewOwnerId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await hoKhauService.getById(id);
        setHoKhau(res.data);
        // Mặc định chọn chủ hộ hiện tại
        if (res.data.chuHo) setNewOwnerId(res.data.chuHo.maNhanKhau);
      } catch (e) {
        setMessage({ type: "error", content: "Lỗi tải dữ liệu" });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleSubmit = async () => {
    if (newOwnerId === hoKhau.chuHo?.maNhanKhau) {
      setMessage({ type: "warning", content: "Người này đang là chủ hộ rồi!" });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        maNhanKhauMoi: newOwnerId,
      };
      await hoKhauService.doiChuHo(id, payload);
      setMessage({ type: "success", content: "Đổi chủ hộ thành công!" });
      setTimeout(() => navigate(`/chi-tiet-ho-khau/${id}`), 1500);
    } catch (error) {
      setMessage({ type: "error", content: error.response?.data?.message || "Lỗi khi đổi chủ hộ" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <CircularProgress />;

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
                bgColor="dark"
                borderRadius="lg"
                coloredShadow="dark"
              >
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" color="white">
                    Đổi Chủ Hộ
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

              <MDBox pt={3} px={3} pb={3}>
                {message.content && <MDAlert color={message.type}>{message.content}</MDAlert>}

                <MDTypography variant="h6" mb={2}>
                  Chọn chủ hộ mới:
                </MDTypography>

                <RadioGroup value={newOwnerId} onChange={(e) => setNewOwnerId(e.target.value)}>
                  {hoKhau?.danhSachThanhVien?.map((tv) => (
                    <MDBox
                      key={tv.maNhanKhau}
                      mb={1}
                      p={1}
                      border="1px solid #eee"
                      borderRadius="lg"
                    >
                      <FormControlLabel
                        value={tv.maNhanKhau}
                        control={<Radio />}
                        label={
                          <MDBox ml={1}>
                            <MDTypography variant="button" fontWeight="bold">
                              {tv.hoTen}
                            </MDTypography>
                            <MDTypography variant="caption" display="block" color="text">
                              CCCD: {tv.soCCCD} - Hiện tại: {tv.quanHeVoiChuHo}
                            </MDTypography>
                          </MDBox>
                        }
                      />
                    </MDBox>
                  ))}
                </RadioGroup>

                <MDBox mt={3} display="flex" justifyContent="center">
                  <MDButton
                    variant="gradient"
                    color="dark"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? "Đang xử lý..." : "Lưu Thay Đổi"}
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

export default DoiChuHo;
