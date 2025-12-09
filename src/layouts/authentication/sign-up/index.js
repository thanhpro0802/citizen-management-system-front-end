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
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import { dangKy, luuToken, luuThongTinNguoiDung } from "services/authService";
import { useAuth, setLogin } from "context/authContext";
// import { isValidEmail } from "utils/validation"; // Không dùng email nữa

function SignUp() {
  const navigate = useNavigate();
  const [, dispatch] = useAuth();

  const [formData, setFormData] = useState({
    hoTen: "",
    cccd: "", // SỬA: email -> cccd
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

    // SỬA: Nếu là nhập CCCD thì chỉ cho nhập số
    if (name === "cccd" && !/^\d*$/.test(value)) return;

    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.hoTen.trim()) newErrors.hoTen = "Họ tên không được để trống";

    // SỬA: Validate CCCD 12 số
    if (!formData.cccd) {
      newErrors.cccd = "Vui lòng nhập số CCCD";
    } else if (formData.cccd.length !== 12) {
      newErrors.cccd = "Số CCCD phải có đúng 12 chữ số";
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
      // SỬA: Gọi hàm đăng ký với CCCD
      const res = await dangKy(
        formData.hoTen,
        formData.cccd,
        formData.matKhau,
        formData.soDienThoai
      );

      if (res.data) {
        // ... (Logic xử lý response giữ nguyên)
        const { token, user } = res.data; // Đảm bảo JwtResponse trả về đúng
        // Backend bạn trả về JwtResponse gồm: token, type, id, cccd, roles
        // Cần lưu ý object "user" để lưu vào localStorage cho đúng

        if (token) {
          // Giả lập object user từ response để lưu frontend
          const userToSave = { cccd: res.data.cccd, roles: res.data.roles, id: res.data.id };

          luuToken(token);
          luuThongTinNguoiDung(userToSave);
          setLogin(dispatch, userToSave, token);
          setSuccess("Đăng ký thành công! Đang chuyển hướng...");
          setTimeout(() => navigate("/gui-phan-anh"), 1500);
        } else {
          setSuccess("Đăng ký thành công! Hãy đăng nhập.");
          setTimeout(() => navigate("/authentication/sign-in"), 1500);
        }
      }
    } catch (err) {
      if (err.response) {
        // Back-end trả về Map<String, String> error -> error.message
        setError(err.response.data.message || "Đăng ký thất bại.");
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
            Tạo tài khoản công dân
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

            {/* SỬA: Input CCCD */}
            <MDBox mb={2}>
              <MDInput
                label="Số CCCD"
                name="cccd"
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
                label="Số điện thoại (tùy chọn)"
                name="soDienThoai"
                value={formData.soDienThoai}
                onChange={handleChange}
                fullWidth
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
