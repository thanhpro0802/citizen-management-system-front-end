import { useState } from "react";

// react-router-dom
import { Link, useNavigate } from "react-router-dom";

// @mui components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

// MD components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Layout
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Image
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

// Services
import { dangKy, luuToken, luuThongTinNguoiDung } from "services/authService";

// Context
import { useAuth, setLogin } from "context/authContext";

// Utils
import { isValidEmail, isValidVietnamesePhoneNumber } from "utils/validation";

function SignUp() {
  const navigate = useNavigate();
  const [, dispatch] = useAuth();

  const [formData, setFormData] = useState({
    hoTen: "",
    email: "",
    soDienThoai: "",
    matKhau: "",
    xacNhanMatKhau: "",
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.hoTen.trim()) newErrors.hoTen = "Họ tên không được để trống";
    if (!isValidEmail(formData.email)) newErrors.email = "Email không hợp lệ";

    if (formData.soDienThoai && !isValidVietnamesePhoneNumber(formData.soDienThoai)) {
      newErrors.soDienThoai = "Số điện thoại không hợp lệ";
    }

    if (formData.matKhau.length < 6) newErrors.matKhau = "Mật khẩu tối thiểu 6 ký tự";

    if (formData.matKhau !== formData.xacNhanMatKhau)
      newErrors.xacNhanMatKhau = "Mật khẩu không khớp";

    if (!agreeTerms) newErrors.terms = "Bạn phải đồng ý điều khoản";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await dangKy(
        formData.hoTen,
        formData.email,
        formData.matKhau,
        formData.soDienThoai
      );

      if (res.data) {
        const { token, user } = res.data;

        if (token && user) {
          luuToken(token);
          luuThongTinNguoiDung(user);
          setLogin(dispatch, user, token);
          setSuccess("Đăng ký thành công! Đang chuyển hướng...");
          setTimeout(() => navigate("/gui-phan-anh"), 1500);
        } else {
          setSuccess("Đăng ký thành công! Hãy đăng nhập.");
          setTimeout(() => navigate("/authentication/sign-in"), 1500);
        }
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Email đã tồn tại.");
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
          mx={2}
          mt={-3}
          p={2}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Đăng Ký
          </MDTypography>
          <MDTypography variant="button" color="white" mt={1}>
            Tạo tài khoản mới
          </MDTypography>
        </MDBox>

        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" onSubmit={handleSubmit}>
            {error && (
              <MDBox mb={2}>
                <Alert severity="error">{error}</Alert>
              </MDBox>
            )}
            {success && (
              <MDBox mb={2}>
                <Alert severity="success">{success}</Alert>
              </MDBox>
            )}

            <MDBox mb={2}>
              <MDInput
                label="Họ tên"
                name="hoTen"
                value={formData.hoTen}
                onChange={handleChange}
                fullWidth
                error={!!errors.hoTen}
                helperText={errors.hoTen}
              />
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
              />
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                label="Số điện thoại (không bắt buộc)"
                name="soDienThoai"
                value={formData.soDienThoai}
                onChange={handleChange}
                fullWidth
                error={!!errors.soDienThoai}
                helperText={errors.soDienThoai}
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

            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Xác nhận mật khẩu"
                name="xacNhanMatKhau"
                value={formData.xacNhanMatKhau}
                onChange={handleChange}
                fullWidth
                error={!!errors.xacNhanMatKhau}
                helperText={errors.xacNhanMatKhau}
              />
            </MDBox>

            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={agreeTerms} onChange={() => setAgreeTerms(!agreeTerms)} />
              <MDTypography
                variant="button"
                color="text"
                sx={{ cursor: "pointer" }}
                onClick={() => setAgreeTerms(!agreeTerms)}
              >
                &nbsp;Tôi đồng ý với điều khoản
              </MDTypography>
            </MDBox>

            {errors.terms && (
              <MDTypography variant="caption" color="error" ml={3}>
                {errors.terms}
              </MDTypography>
            )}

            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : "Đăng ký"}
              </MDButton>
            </MDBox>

            <MDBox mt={3} textAlign="center">
              <MDTypography variant="button" color="text">
                Đã có tài khoản?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Đăng nhập
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default SignUp;
