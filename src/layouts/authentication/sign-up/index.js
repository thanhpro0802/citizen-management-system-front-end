/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

// Services
import { dangKy, luuToken, luuThongTinNguoiDung } from "services/authService";

// Context
import { useAuth, setLogin } from "context/authContext";

function Cover() {
  const navigate = useNavigate();
  const [, dispatch] = useAuth();

  const [formData, setFormData] = useState({
    hoTen: "",
    email: "",
    matKhau: "",
    xacNhanMatKhau: "",
    soDienThoai: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.hoTen) {
      newErrors.hoTen = "Họ tên không được để trống";
    } else if (formData.hoTen.length < 2) {
      newErrors.hoTen = "Họ tên phải có ít nhất 2 ký tự";
    }

    if (!formData.email) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.matKhau) {
      newErrors.matKhau = "Mật khẩu không được để trống";
    } else if (formData.matKhau.length < 6) {
      newErrors.matKhau = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.xacNhanMatKhau) {
      newErrors.xacNhanMatKhau = "Vui lòng xác nhận mật khẩu";
    } else if (formData.matKhau !== formData.xacNhanMatKhau) {
      newErrors.xacNhanMatKhau = "Mật khẩu không khớp";
    }

    if (formData.soDienThoai && !/^[0-9]{10,11}$/.test(formData.soDienThoai)) {
      newErrors.soDienThoai = "Số điện thoại không hợp lệ (10-11 số)";
    }

    if (!agreeTerms) {
      newErrors.terms = "Bạn phải đồng ý với điều khoản sử dụng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await dangKy(
        formData.hoTen,
        formData.email,
        formData.matKhau,
        formData.soDienThoai
      );

      // Kiểm tra response
      if (response.data) {
        const { token, user } = response.data;

        // Nếu backend trả về token và user ngay lập tức (tự động đăng nhập)
        if (token && user) {
          luuToken(token);
          luuThongTinNguoiDung(user);
          setLogin(dispatch, user, token);
          setSuccess("Đăng ký thành công! Đang chuyển hướng...");
          setTimeout(() => {
            navigate("/gui-phan-anh");
          }, 1500);
        } else {
          // Nếu cần xác thực email hoặc chỉ trả về thông báo thành công
          setSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
          setTimeout(() => {
            navigate("/authentication/sign-in");
          }, 2000);
        }
      }
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      if (err.response) {
        // Lỗi từ server
        setError(err.response.data.message || "Đăng ký không thành công. Email có thể đã được sử dụng.");
      } else if (err.request) {
        // Không nhận được phản hồi từ server
        setError("Không thể kết nối đến server. Vui lòng thử lại sau.");
      } else {
        // Lỗi khác
        setError("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Đăng Ký Tài Khoản
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Điền thông tin để tạo tài khoản mới
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
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
                type="text"
                label="Họ và tên"
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
                type="text"
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
              <Checkbox checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                onClick={() => setAgreeTerms(!agreeTerms)}
              >
                &nbsp;&nbsp;Tôi đồng ý với&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Điều khoản sử dụng
              </MDTypography>
            </MDBox>
            {errors.terms && (
              <MDBox ml={3} mt={1}>
                <MDTypography variant="caption" color="error">
                  {errors.terms}
                </MDTypography>
              </MDBox>
            )}
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Đăng ký"}
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
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
    </CoverLayout>
  );
}

export default Cover;
