/**
 * src/layouts/authentication/sign-in/index.js
 */

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

// Services & Context
import {
  dangNhap,
  luuToken,
  luuThongTinNguoiDung,
  taoUserTuJWTResponse,
} from "services/authService";
import nhanKhauService from "services/nhanKhauService"; // Đảm bảo bạn đã tạo file này
import { useAuth, setLogin } from "context/authContext";

function Basic() {
  const navigate = useNavigate();
  const [, dispatch] = useAuth();

  const [formData, setFormData] = useState({
    cccd: "",
    matKhau: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Validate: Chỉ cho phép nhập số vào ô CCCD
    if (name === "cccd" && !/^\d*$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
    // Clear lỗi khi người dùng gõ lại
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
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
      // BƯỚC 1: Gọi API Đăng nhập
      const response = await dangNhap(formData.cccd, formData.matKhau);
      const data = response.data;

      // BƯỚC 2: Lưu Token ngay lập tức để các request sau (như lấy profile) có thể dùng
      luuToken(data.token);

      // BƯỚC 3: Tạo object user cơ bản từ response login
      let user = taoUserTuJWTResponse(data);

      // BƯỚC 4: Gọi API lấy thông tin chi tiết nhân khẩu (Để lấy SĐT, Họ tên chính xác)
      try {
        // Lưu ý: Backend cần có endpoint /api/nhan-khau/me hoặc tương tự để lấy info người đang login
        const profileResponse = await nhanKhauService.layThongTinNhanKhauCuaToi();

        // Kiểm tra cấu trúc dữ liệu trả về từ API get profile
        // Giả sử API trả về object NhanKhau trực tiếp hoặc bọc trong data
        const profileData = profileResponse.data || profileResponse;

        if (profileData) {
          // Cập nhật SĐT nếu trong profile có
          if (profileData.soDienThoai) {
            user.soDienThoai = profileData.soDienThoai;
          }
          // Cập nhật họ tên chính xác từ hồ sơ nhân khẩu (ưu tiên hơn login)
          if (profileData.hoTen) {
            user.hoTen = profileData.hoTen;
          }
          console.log("Đã đồng bộ thông tin từ hồ sơ nhân khẩu:", user);
        }
      } catch (profileErr) {
        // Nếu lỗi lấy profile (ví dụ chưa liên kết nhân khẩu), vẫn cho đăng nhập nhưng log warning
        console.warn("Không thể lấy thông tin chi tiết nhân khẩu:", profileErr);
      }

      // BƯỚC 5: Lưu user đầy đủ vào LocalStorage và Context
      luuThongTinNguoiDung(user);
      setLogin(dispatch, user, data.token);

      // BƯỚC 6: Chuyển hướng
      navigate("/thong-tin-ca-nhan");
    } catch (err) {
      console.error("Login Error:", err);
      if (err.response) {
        // Xử lý thông điệp lỗi từ Backend trả về
        setError(err.response.data.message || "Thông tin đăng nhập không đúng");
      } else if (err.request) {
        setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      } else {
        setError("Đã xảy ra lỗi không mong muốn.");
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
            Hệ thống Quản lý Công dân
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            {error && (
              <MDBox mb={2}>
                <Alert severity="error">{error}</Alert>
              </MDBox>
            )}

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
                  Đăng ký ngay
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
