import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API Service
import hoKhauService from "services/hoKhauService";

function FormHoKhau() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Form state
  const [diaChi, setDiaChi] = useState("");
  const [cccdChuHo, setCccdChuHo] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  // Check role permission
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/authentication/sign-in");
      return;
    }
    const user = JSON.parse(userStr);
    const role = user.vaiTro || (user.roles ? user.roles[0] : "");
    const isCanBo = Array.isArray(user.roles)
      ? user.roles.includes("CAN_BO")
      : role === "CAN_BO";
    if (!isCanBo) {
      setMessage({ type: "error", content: "⛔ CẢNH BÁO: Bạn không có quyền truy cập!" });
      setTimeout(() => navigate("/ho-khau-cua-toi"), 2000);
      return;
    }

    if (isEditMode) {
      fetchHoKhauData();
    }
  }, [navigate, isEditMode, id]);

  const fetchHoKhauData = async () => {
    try {
      setLoadingData(true);
      const response = await hoKhauService.getById(id);
      const data = response.data;
      setDiaChi(data.diaChi || "");
      setCccdChuHo(data.chuHo?.cccd || "");
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu hộ khẩu:", error);
      setMessage({ type: "error", content: "Không thể tải thông tin hộ khẩu" });
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!diaChi.trim()) {
      setMessage({ type: "error", content: "Vui lòng nhập địa chỉ!" });
      return;
    }

    if (!cccdChuHo.trim()) {
      setMessage({ type: "error", content: "Vui lòng nhập CCCD chủ hộ!" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", content: "" });

    try {
      const payload = {
        diaChi: diaChi.trim(),
        cccdChuHo: cccdChuHo.trim(),
      };

      if (isEditMode) {
        await hoKhauService.update(id, payload);
        setMessage({ type: "success", content: "Cập nhật hộ khẩu thành công!" });
      } else {
        await hoKhauService.create(payload);
        setMessage({ type: "success", content: "Thêm hộ khẩu thành công!" });
      }

      setTimeout(() => {
        navigate("/quan-ly-ho-khau");
      }, 1500);
    } catch (error) {
      console.error("Lỗi khi lưu hộ khẩu:", error);
      const errorMsg =
        error.response?.data?.message ||
        (isEditMode ? "Không thể cập nhật hộ khẩu" : "Không thể thêm hộ khẩu");
      setMessage({ type: "error", content: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3} display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress color="info" />
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12} lg={8} mx="auto">
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor={isEditMode ? "warning" : "success"}
                borderRadius="lg"
                coloredShadow={isEditMode ? "warning" : "success"}
              >
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" color="white">
                    {isEditMode ? "Sửa Hộ Khẩu" : "Thêm Hộ Khẩu Mới"}
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

              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form" onSubmit={handleSubmit}>
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

                  <MDBox mb={3}>
                    <TextField
                      label="Địa Chỉ Hộ Khẩu"
                      fullWidth
                      required
                      value={diaChi}
                      onChange={(e) => setDiaChi(e.target.value)}
                      placeholder="Ví dụ: Số 123, Đường ABC, Phường XYZ, Quận 1, TP.HCM"
                      helperText="Nhập địa chỉ đầy đủ của hộ khẩu"
                    />
                  </MDBox>

                  <MDBox mb={3}>
                    <TextField
                      label="CCCD Chủ Hộ"
                      fullWidth
                      required
                      value={cccdChuHo}
                      onChange={(e) => setCccdChuHo(e.target.value)}
                      placeholder="Nhập số CCCD của chủ hộ"
                      helperText="Số CCCD của người sẽ làm chủ hộ (12 số)"
                      inputProps={{ maxLength: 12 }}
                    />
                  </MDBox>

                  <MDBox mb={2}>
                    <MDAlert color="info">
                      <MDTypography variant="caption" color="white">
                        <strong>Lưu ý:</strong>
                        <br />
                        • Địa chỉ không được để trống
                        <br />
                        • CCCD chủ hộ phải tồn tại trong hệ thống
                        <br />• Người được chọn làm chủ hộ sẽ tự động được thêm vào danh sách thành
                        viên
                      </MDTypography>
                    </MDAlert>
                  </MDBox>

                  <MDBox mt={4} mb={1} display="flex" gap={2}>
                    <MDButton
                      type="submit"
                      variant="gradient"
                      color={isEditMode ? "warning" : "success"}
                      fullWidth
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <Icon>{isEditMode ? "save" : "add"}</Icon>&nbsp;
                          {isEditMode ? "Cập Nhật" : "Thêm Mới"}
                        </>
                      )}
                    </MDButton>
                    <MDButton
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      onClick={() => navigate(-1)}
                      disabled={loading}
                    >
                      Hủy
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

export default FormHoKhau;
