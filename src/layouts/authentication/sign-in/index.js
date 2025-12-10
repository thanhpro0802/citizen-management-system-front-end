import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { dangNhap, luuToken, luuThongTinNguoiDung } from "services/authService";
import { useAuth, setLogin } from "context/authContext";

function Basic() {
  const navigate = useNavigate();
  const [, dispatch] = useAuth();

  const [formData, setFormData] = useState({
    cccd: "", // SỬA: email -> cccd
    matKhau: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // SỬA: Chặn nhập chữ cái vào ô CCCD
    if (name === "cccd" && !/^\d*$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    // SỬA: Validate CCCD
    if (!formData.cccd) {
      newErrors.cccd = "Vui lòng nhập số CCCD";
    } else if (formData.cccd.length !== 12) {
      newErrors.cccd = "Số CCCD phải có đúng 12 chữ số";
    }

    if (!formData.matKhau) {
      newErrors.matKhau = "Mật khẩu không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      // SỬA: Gọi hàm đăng nhập với CCCD
      const response = await dangNhap(formData.cccd, formData.matKhau);

      // Backend trả về JwtResponse (token, type, id, cccd, roles)
      const data = response.data;

      // Tạo object user từ response (xử lý cả roles từ response hoặc token)
      const { taoUserTuJWTResponse } = await import("services/authService");
      const user = taoUserTuJWTResponse(data);

      luuToken(data.token);
      luuThongTinNguoiDung(user);

      setLogin(dispatch, user, data.token);
      navigate("/gui-phan-anh");
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      if (err.response) {
        // Back-end trả về lỗi 401 với message "Sai số CCCD hoặc mật khẩu"
        setError(err.response.data.message || "Thông tin đăng nhập không đúng");
      } else {
        setError("Không thể kết nối đến server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Đăng Nhập
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Sử dụng số CCCD và mật khẩu
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            {error && (
              <MDBox mb={2}>
                <Alert severity="error">{error}</Alert>
              </MDBox>
            )}

            {/* SỬA: Input CCCD */}
            <MDBox mb={2}>
              <MDInput
                label="Số CCCD"
                name="cccd" // SỬA: name="cccd"
                value={formData.cccd}
                onChange={handleChange}
                fullWidth
                error={!!errors.cccd}
                helperText={errors.cccd}
                inputProps={{ maxLength: 12 }}
              />
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Mật khẩu"
                name="matKhau"
                value={formData.matKhau}
                onChange={handleChange}
                fullWidth
                error={!!errors.matKhau}
                helperText={errors.matKhau}
              />
            </MDBox>

            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Ghi nhớ đăng nhập
              </MDTypography>
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit" disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : "Đăng nhập"}
              </MDButton>
            </MDBox>

            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Chưa có tài khoản?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Đăng ký
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
