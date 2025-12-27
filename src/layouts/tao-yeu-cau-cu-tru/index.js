/**
 * =========================================================
 * Tạo Yêu Cầu Cư Trú
 * Form cho công dân tạo yêu cầu:
 * - Đăng ký tạm trú
 * - Đăng ký thường trú
 * - Khai báo tạm vắng
 * - Điều chỉnh thông tin
 * - Xóa đăng ký thường trú
 * =========================================================
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// @mui components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Alert from "@mui/material/Alert";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDSnackbar from "components/MDSnackbar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Service
import yeuCauCuTruService from "services/yeuCauCuTruService";
import nhanKhauService from "services/nhanKhauService";

// Enums
const LOAI_YEU_CAU = {
  DANG_KY_TAM_TRU: "DANG_KY_TAM_TRU",
  DANG_KY_THUONG_TRU: "DANG_KY_THUONG_TRU",
  KHAI_BAO_TAM_VANG: "KHAI_BAO_TAM_VANG",
  DIEU_CHINH_THONG_TIN: "DIEU_CHINH_THONG_TIN",
  XOA_DANG_KY: "XOA_DANG_KY",
};

const DOI_TUONG = {
  BAN_THAN: "BAN_THAN",
  KHAI_HO: "KHAI_HO",
};

const LOAI_HINH_DANG_KY = {
  VAO_HO_DA_CO: "VAO_HO_DA_CO",
  LAP_HO_MOI: "LAP_HO_MOI",
};

const LOAI_TAM_VANG = {
  TRONG_NUOC: "TRONG_NUOC",
  NUOC_NGOAI: "NUOC_NGOAI",
};

function TaoYeuCauCuTru() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [userNhanKhau, setUserNhanKhau] = useState(null);

  // Lấy thông tin user hiện tại và thông tin nhân khẩu
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);

      // Load thông tin nhân khẩu từ API
      nhanKhauService
        .layThongTinNhanKhauCuaToi()
        .then((response) => {
          setUserNhanKhau(response.nhanKhau);
        })
        .catch((err) => {
          console.error("Ổi! Không lấy được thông tin nhân khẩu:", err);
        });
    }
  }, []);

  // Form data
  const [formData, setFormData] = useState({
    loaiYeuCau: LOAI_YEU_CAU.DANG_KY_TAM_TRU,
    doiTuongDeNghi: DOI_TUONG.BAN_THAN,

    // Thông tin khai hộ
    nguoiDeNghiHoTen: "",
    nguoiDeNghiNgaySinh: "",
    nguoiDeNghiGioiTinh: "Nam",
    nguoiDeNghiCccd: "",

    // Thông tin đăng ký
    loaiHinhDangKy: LOAI_HINH_DANG_KY.VAO_HO_DA_CO,
    chuHoHoTen: "",
    chuHoCccd: "",
    diaChiCuTru: "",

    // Thông tin tạm vắng
    loaiTamVang: LOAI_TAM_VANG.TRONG_NUOC,
    noiDen: "",
    thoiGianBatDau: "",
    thoiGianKetThuc: "",
    lyDo: "",

    // Thông tin điều chỉnh
    phanCanDieuChinh: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Steps configuration
  const getSteps = () => {
    return ["Chọn loại yêu cầu", "Thông tin cơ bản", "Thông tin chi tiết", "Xác nhận"];
  };

  const steps = getSteps();

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 0: // Loại yêu cầu
        if (!formData.loaiYeuCau) {
          newErrors.loaiYeuCau = "Vui lòng chọn loại yêu cầu";
        }
        break;

      case 1: // Thông tin cơ bản
        if (!formData.doiTuongDeNghi) {
          newErrors.doiTuongDeNghi = "Vui lòng chọn đối tượng đề nghị";
        }

        if (formData.doiTuongDeNghi === DOI_TUONG.KHAI_HO) {
          if (!formData.nguoiDeNghiHoTen.trim()) {
            newErrors.nguoiDeNghiHoTen = "Họ tên không được để trống";
          }
          if (!formData.nguoiDeNghiCccd.trim()) {
            newErrors.nguoiDeNghiCccd = "CCCD không được để trống";
          }
        }
        break;

      case 2: // Thông tin chi tiết
        if (
          formData.loaiYeuCau === LOAI_YEU_CAU.DANG_KY_TAM_TRU ||
          formData.loaiYeuCau === LOAI_YEU_CAU.DANG_KY_THUONG_TRU
        ) {
          if (!formData.diaChiCuTru.trim()) {
            newErrors.diaChiCuTru = "Địa chỉ cư trú không được để trống";
          }
          if (formData.loaiHinhDangKy === LOAI_HINH_DANG_KY.VAO_HO_DA_CO) {
            if (!formData.chuHoHoTen.trim()) {
              newErrors.chuHoHoTen = "Họ tên chủ hộ không được để trống";
            }
            if (!formData.chuHoCccd.trim()) {
              newErrors.chuHoCccd = "CCCD chủ hộ không được để trống";
            }
          }
        } else if (formData.loaiYeuCau === LOAI_YEU_CAU.KHAI_BAO_TAM_VANG) {
          if (!formData.noiDen.trim()) {
            newErrors.noiDen = "Nơi đến không được để trống";
          }
          if (!formData.thoiGianBatDau) {
            newErrors.thoiGianBatDau = "Thời gian bắt đầu không được để trống";
          }
          if (!formData.thoiGianKetThuc) {
            newErrors.thoiGianKetThuc = "Thời gian kết thúc không được để trống";
          }
        } else if (formData.loaiYeuCau === LOAI_YEU_CAU.DIEU_CHINH_THONG_TIN) {
          if (!formData.phanCanDieuChinh.trim()) {
            newErrors.phanCanDieuChinh = "Phần cần điều chỉnh không được để trống";
          }
          if (!formData.lyDo.trim()) {
            newErrors.lyDo = "Lý do không được để trống";
          }
        } else {
          if (!formData.lyDo.trim()) {
            newErrors.lyDo = "Lý do không được để trống";
          }
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    setLoading(true);
    try {
      const requestData = {
        loaiYeuCau: formData.loaiYeuCau,
        doiTuongDeNghi: formData.doiTuongDeNghi,
      };

      // Add khai hộ info if needed
      if (formData.doiTuongDeNghi === DOI_TUONG.KHAI_HO) {
        requestData.nguoiDeNghiHoTen = formData.nguoiDeNghiHoTen;
        requestData.nguoiDeNghiNgaySinh = formData.nguoiDeNghiNgaySinh || null;
        requestData.nguoiDeNghiGioiTinh = formData.nguoiDeNghiGioiTinh;
        requestData.nguoiDeNghiCccd = formData.nguoiDeNghiCccd;
      }

      // Add type-specific data
      if (
        formData.loaiYeuCau === LOAI_YEU_CAU.DANG_KY_TAM_TRU ||
        formData.loaiYeuCau === LOAI_YEU_CAU.DANG_KY_THUONG_TRU
      ) {
        requestData.loaiHinhDangKy = formData.loaiHinhDangKy;
        requestData.diaChiCuTru = formData.diaChiCuTru;
        if (formData.loaiHinhDangKy === LOAI_HINH_DANG_KY.VAO_HO_DA_CO) {
          requestData.chuHoHoTen = formData.chuHoHoTen;
          requestData.chuHoCccd = formData.chuHoCccd;
        }
      } else if (formData.loaiYeuCau === LOAI_YEU_CAU.KHAI_BAO_TAM_VANG) {
        requestData.loaiTamVang = formData.loaiTamVang;
        requestData.noiDen = formData.noiDen;
        requestData.thoiGianBatDau = formData.thoiGianBatDau;
        requestData.thoiGianKetThuc = formData.thoiGianKetThuc;
        requestData.lyDo = formData.lyDo;
      } else if (formData.loaiYeuCau === LOAI_YEU_CAU.DIEU_CHINH_THONG_TIN) {
        requestData.phanCanDieuChinh = formData.phanCanDieuChinh;
        requestData.lyDo = formData.lyDo;
      } else {
        requestData.lyDo = formData.lyDo;
      }

      await yeuCauCuTruService.taoYeuCau(requestData);
      setSuccessSB(true);
      setTimeout(() => {
        navigate("/yeu-cau-cu-tru");
      }, 2000);
    } catch (error) {
      console.error("Error creating request:", error);
      setErrorMessage(error.response?.data?.message || "Có lỗi xảy ra khi tạo yêu cầu");
      setErrorSB(true);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return renderLoaiYeuCauStep();
      case 1:
        return renderThongTinCoBanStep();
      case 2:
        return renderThongTinChiTietStep();
      case 3:
        return renderXacNhanStep();
      default:
        return "Unknown step";
    }
  };

  const renderLoaiYeuCauStep = () => {
    // Mô tả cho mỗi loại yêu cầu
    const getLoaiYeuCauMoTa = (loai) => {
      switch (loai) {
        case LOAI_YEU_CAU.DANG_KY_TAM_TRU:
          return "Đăng ký tạm trú cho những người ở tạm thời tại địa phương (dưới 12 tháng). Áp dụng cho người đến ở tạm thời tại địa phương từ nơi khác.";
        case LOAI_YEU_CAU.DANG_KY_THUONG_TRU:
          return "Đăng ký thường trú để được cấp hộ khẩu thường trú tại địa phương. Áp dụng khi bạn muốn đăng ký thường trú chính thức tại địa phương này.";
        case LOAI_YEU_CAU.KHAI_BAO_TAM_VANG:
          return "Khai báo khi rời khỏi nơi cư trú thường xuyên trong thời gian dài. Áp dụng khi bạn cần rời khỏi nơi thường trú trong thời gian dài hơn 30 ngày.";
        case LOAI_YEU_CAU.DIEU_CHINH_THONG_TIN:
          return "Điều chỉnh, cập nhật thông tin cư trú đã đăng ký trước đó. Áp dụng khi có sai sót hoặc thay đổi thông tin cư trú.";
        case LOAI_YEU_CAU.XOA_DANG_KY:
          return "Xóa đăng ký thường trú hoặc tạm trú khi chuyển đi nơi khác. Áp dụng khi bạn chuyển đi khỏi địa phương và muốn xóa đăng ký cư trú hiện tại.";
        default:
          return "";
      }
    };

    return (
      <MDBox>
        <FormControl fullWidth error={!!errors.loaiYeuCau}>
          <MDTypography variant="h6" mb={2}>
            Chọn loại yêu cầu
          </MDTypography>
          <TextField
            select
            value={formData.loaiYeuCau}
            onChange={handleChange("loaiYeuCau")}
            error={!!errors.loaiYeuCau}
            helperText={errors.loaiYeuCau}
            sx={{
              "& .MuiInputBase-root": {
                minHeight: "40px",
              },
            }}
          >
            <MenuItem value={LOAI_YEU_CAU.DANG_KY_TAM_TRU}>Đăng ký tạm trú</MenuItem>
            <MenuItem value={LOAI_YEU_CAU.DANG_KY_THUONG_TRU}>Đăng ký thường trú</MenuItem>
            <MenuItem value={LOAI_YEU_CAU.KHAI_BAO_TAM_VANG}>Khai báo tạm vắng</MenuItem>
            <MenuItem value={LOAI_YEU_CAU.DIEU_CHINH_THONG_TIN}>
              Điều chỉnh thông tin cư trú
            </MenuItem>
            <MenuItem value={LOAI_YEU_CAU.XOA_DANG_KY}>Xóa đăng ký thường trú</MenuItem>
          </TextField>

          {/* Hiển thị mô tả */}
          {formData.loaiYeuCau && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <MDTypography variant="caption" color="text">
                {getLoaiYeuCauMoTa(formData.loaiYeuCau)}
              </MDTypography>
            </Alert>
          )}
        </FormControl>
      </MDBox>
    );
  };

  const renderThongTinCoBanStep = () => (
    <MDBox>
      <MDTypography variant="h6" mb={2}>
        Đối tượng đề nghị
      </MDTypography>

      <FormControl component="fieldset" error={!!errors.doiTuongDeNghi}>
        <RadioGroup value={formData.doiTuongDeNghi} onChange={handleChange("doiTuongDeNghi")}>
          <FormControlLabel value={DOI_TUONG.BAN_THAN} control={<Radio />} label="Bản thân" />
          <FormControlLabel
            value={DOI_TUONG.KHAI_HO}
            control={<Radio />}
            label="Khai hộ (đăng ký cho người khác)"
          />
        </RadioGroup>
      </FormControl>

      {/* Hiển thị thông tin bản thân nếu chọn Bản thân */}
      {formData.doiTuongDeNghi === DOI_TUONG.BAN_THAN && userNhanKhau && (
        <MDBox mt={3}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <MDTypography variant="caption">
              Yêu cầu sẽ được tạo cho bản thân với thông tin sau:
            </MDTypography>
          </Alert>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <MDInput label="Họ và tên" fullWidth value={userNhanKhau.hoTen || ""} disabled />
            </Grid>
            <Grid item xs={12} md={6}>
              <MDInput
                label="CCCD"
                fullWidth
                value={userNhanKhau.soCCCD || currentUser?.cccd || ""}
                disabled
              />
            </Grid>
            {userNhanKhau.ngaySinh && (
              <Grid item xs={12} md={6}>
                <TextField
                  label="Ngày sinh"
                  fullWidth
                  value={new Date(userNhanKhau.ngaySinh).toLocaleDateString("vi-VN")}
                  disabled
                  sx={{
                    "& .MuiInputBase-root": {
                      minHeight: "45px",
                    },
                  }}
                />
              </Grid>
            )}
            {userNhanKhau.gioiTinh && (
              <Grid item xs={12} md={6}>
                <TextField
                  label="Giới tính"
                  fullWidth
                  value={userNhanKhau.gioiTinh || ""}
                  disabled
                  sx={{
                    "& .MuiInputBase-root": {
                      minHeight: "45px",
                    },
                  }}
                />
              </Grid>
            )}
          </Grid>
        </MDBox>
      )}

      {formData.doiTuongDeNghi === DOI_TUONG.KHAI_HO && (
        <MDBox mt={3}>
          <MDTypography variant="body2" color="text" mb={2}>
            Thông tin người đề nghị
          </MDTypography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <MDInput
                label="Họ và tên *"
                fullWidth
                value={formData.nguoiDeNghiHoTen}
                onChange={handleChange("nguoiDeNghiHoTen")}
                error={!!errors.nguoiDeNghiHoTen}
                helperText={errors.nguoiDeNghiHoTen}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <MDInput
                label="CCCD *"
                fullWidth
                value={formData.nguoiDeNghiCccd}
                onChange={handleChange("nguoiDeNghiCccd")}
                error={!!errors.nguoiDeNghiCccd}
                helperText={errors.nguoiDeNghiCccd}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Ngày sinh"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.nguoiDeNghiNgaySinh}
                onChange={handleChange("nguoiDeNghiNgaySinh")}
                sx={{
                  "& .MuiInputBase-root": {
                    minHeight: "45px",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Giới tính"
                fullWidth
                value={formData.nguoiDeNghiGioiTinh}
                onChange={handleChange("nguoiDeNghiGioiTinh")}
                sx={{
                  "& .MuiInputBase-root": {
                    minHeight: "45px",
                  },
                }}
              >
                <MenuItem value="Nam">Nam</MenuItem>
                <MenuItem value="Nữ">Nữ</MenuItem>
                <MenuItem value="Khác">Khác</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </MDBox>
      )}
    </MDBox>
  );

  const renderThongTinChiTietStep = () => {
    if (
      formData.loaiYeuCau === LOAI_YEU_CAU.DANG_KY_TAM_TRU ||
      formData.loaiYeuCau === LOAI_YEU_CAU.DANG_KY_THUONG_TRU
    ) {
      return (
        <MDBox>
          <MDTypography variant="h6" mb={2}>
            Thông tin đăng ký
          </MDTypography>

          <FormControl component="fieldset" fullWidth>
            <FormLabel>Loại hình đăng ký</FormLabel>
            <RadioGroup value={formData.loaiHinhDangKy} onChange={handleChange("loaiHinhDangKy")}>
              <FormControlLabel
                value={LOAI_HINH_DANG_KY.VAO_HO_DA_CO}
                control={<Radio />}
                label="Đăng ký vào hộ đã có"
              />
              <FormControlLabel
                value={LOAI_HINH_DANG_KY.LAP_HO_MOI}
                control={<Radio />}
                label="Đăng ký lập hộ mới"
              />
            </RadioGroup>
          </FormControl>

          <MDBox mt={3}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <MDInput
                  label="Địa chỉ cư trú *"
                  multiline
                  rows={2}
                  fullWidth
                  value={formData.diaChiCuTru}
                  onChange={handleChange("diaChiCuTru")}
                  error={!!errors.diaChiCuTru}
                  helperText={errors.diaChiCuTru}
                />
              </Grid>

              {formData.loaiHinhDangKy === LOAI_HINH_DANG_KY.VAO_HO_DA_CO && (
                <>
                  <Grid item xs={12} md={6}>
                    <MDInput
                      label="Họ tên chủ hộ *"
                      fullWidth
                      value={formData.chuHoHoTen}
                      onChange={handleChange("chuHoHoTen")}
                      error={!!errors.chuHoHoTen}
                      helperText={errors.chuHoHoTen}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDInput
                      label="CCCD chủ hộ *"
                      fullWidth
                      value={formData.chuHoCccd}
                      onChange={handleChange("chuHoCccd")}
                      error={!!errors.chuHoCccd}
                      helperText={errors.chuHoCccd}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </MDBox>
        </MDBox>
      );
    } else if (formData.loaiYeuCau === LOAI_YEU_CAU.KHAI_BAO_TAM_VANG) {
      return (
        <MDBox>
          <MDTypography variant="h6" mb={2}>
            Thông tin tạm vắng
          </MDTypography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                label="Loại tạm vắng"
                fullWidth
                value={formData.loaiTamVang}
                onChange={handleChange("loaiTamVang")}
                sx={{
                  "& .MuiInputBase-root": {
                    minHeight: "45px",
                  },
                }}
              >
                <MenuItem value={LOAI_TAM_VANG.TRONG_NUOC}>Trong nước</MenuItem>
                <MenuItem value={LOAI_TAM_VANG.NUOC_NGOAI}>Nước ngoài</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <MDInput
                label="Nơi đến *"
                fullWidth
                value={formData.noiDen}
                onChange={handleChange("noiDen")}
                error={!!errors.noiDen}
                helperText={errors.noiDen}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Từ ngày *"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.thoiGianBatDau}
                onChange={handleChange("thoiGianBatDau")}
                error={!!errors.thoiGianBatDau}
                helperText={errors.thoiGianBatDau}
                sx={{
                  "& .MuiInputBase-root": {
                    minHeight: "45px",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Đến ngày *"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.thoiGianKetThuc}
                onChange={handleChange("thoiGianKetThuc")}
                error={!!errors.thoiGianKetThuc}
                helperText={errors.thoiGianKetThuc}
                sx={{
                  "& .MuiInputBase-root": {
                    minHeight: "45px",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <MDInput
                label="Lý do"
                multiline
                rows={3}
                fullWidth
                value={formData.lyDo}
                onChange={handleChange("lyDo")}
              />
            </Grid>
          </Grid>
        </MDBox>
      );
    } else {
      return (
        <MDBox>
          <MDTypography variant="h6" mb={2}>
            {formData.loaiYeuCau === LOAI_YEU_CAU.DIEU_CHINH_THONG_TIN
              ? "Điều chỉnh thông tin cư trú"
              : "Xóa đăng ký"}
          </MDTypography>

          {formData.loaiYeuCau === LOAI_YEU_CAU.DIEU_CHINH_THONG_TIN ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <MDInput
                  label="Phần cần điều chỉnh *"
                  placeholder="Ví dụ: Họ tên, Ngày sinh, Địa chỉ, Số điện thoại, v.v."
                  multiline
                  rows={2}
                  fullWidth
                  value={formData.phanCanDieuChinh}
                  onChange={handleChange("phanCanDieuChinh")}
                  error={!!errors.phanCanDieuChinh}
                  helperText={errors.phanCanDieuChinh}
                />
              </Grid>
              <Grid item xs={12}>
                <MDInput
                  label="Lý do điều chỉnh *"
                  placeholder="Giải thích vì sao cần điều chỉnh thông tin này"
                  multiline
                  rows={4}
                  fullWidth
                  value={formData.lyDo}
                  onChange={handleChange("lyDo")}
                  error={!!errors.lyDo}
                  helperText={errors.lyDo}
                />
              </Grid>
            </Grid>
          ) : (
            <MDInput
              label="Lý do *"
              multiline
              rows={4}
              fullWidth
              value={formData.lyDo}
              onChange={handleChange("lyDo")}
              error={!!errors.lyDo}
              helperText={errors.lyDo}
            />
          )}
        </MDBox>
      );
    }
  };

  const renderXacNhanStep = () => {
    const getLoaiYeuCauText = () => {
      switch (formData.loaiYeuCau) {
        case LOAI_YEU_CAU.DANG_KY_TAM_TRU:
          return "Đăng ký tạm trú";
        case LOAI_YEU_CAU.DANG_KY_THUONG_TRU:
          return "Đăng ký thường trú";
        case LOAI_YEU_CAU.KHAI_BAO_TAM_VANG:
          return "Khai báo tạm vắng";
        case LOAI_YEU_CAU.DIEU_CHINH_THONG_TIN:
          return "Điều chỉnh thông tin";
        case LOAI_YEU_CAU.XOA_DANG_KY:
          return "Xóa đăng ký thường trú";
        default:
          return "";
      }
    };

    return (
      <MDBox>
        <MDTypography variant="h6" mb={2}>
          Xác nhận thông tin
        </MDTypography>

        <Alert severity="info" sx={{ mb: 2 }}>
          Vui lòng kiểm tra lại thông tin trước khi gửi yêu cầu
        </Alert>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <MDTypography variant="body2" fontWeight="bold">
              Loại yêu cầu:
            </MDTypography>
            <MDTypography variant="body2" color="text">
              {getLoaiYeuCauText()}
            </MDTypography>
          </Grid>

          <Grid item xs={12}>
            <MDTypography variant="body2" fontWeight="bold">
              Đối tượng:
            </MDTypography>
            <MDTypography variant="body2" color="text">
              {formData.doiTuongDeNghi === DOI_TUONG.BAN_THAN ? "Bản thân" : "Khai hộ"}
            </MDTypography>
          </Grid>

          {formData.doiTuongDeNghi === DOI_TUONG.KHAI_HO && (
            <>
              <Grid item xs={12}>
                <MDTypography variant="body2" fontWeight="bold">
                  Người đề nghị:
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {formData.nguoiDeNghiHoTen} - {formData.nguoiDeNghiCccd}
                </MDTypography>
              </Grid>
            </>
          )}

          {(formData.loaiYeuCau === LOAI_YEU_CAU.DANG_KY_TAM_TRU ||
            formData.loaiYeuCau === LOAI_YEU_CAU.DANG_KY_THUONG_TRU) && (
            <>
              <Grid item xs={12}>
                <MDTypography variant="body2" fontWeight="bold">
                  Địa chỉ cư trú:
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {formData.diaChiCuTru}
                </MDTypography>
              </Grid>

              {formData.loaiHinhDangKy === LOAI_HINH_DANG_KY.VAO_HO_DA_CO && (
                <Grid item xs={12}>
                  <MDTypography variant="body2" fontWeight="bold">
                    Chủ hộ:
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    {formData.chuHoHoTen} - {formData.chuHoCccd}
                  </MDTypography>
                </Grid>
              )}
            </>
          )}

          {formData.loaiYeuCau === LOAI_YEU_CAU.KHAI_BAO_TAM_VANG && (
            <>
              <Grid item xs={12}>
                <MDTypography variant="body2" fontWeight="bold">
                  Nơi đến:
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {formData.noiDen} (
                  {formData.loaiTamVang === LOAI_TAM_VANG.TRONG_NUOC ? "Trong nước" : "Nước ngoài"})
                </MDTypography>
              </Grid>

              <Grid item xs={12}>
                <MDTypography variant="body2" fontWeight="bold">
                  Thời gian:
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {formData.thoiGianBatDau} đến {formData.thoiGianKetThuc}
                </MDTypography>
              </Grid>
            </>
          )}

          {formData.loaiYeuCau === LOAI_YEU_CAU.DIEU_CHINH_THONG_TIN && (
            <>
              <Grid item xs={12}>
                <MDTypography variant="body2" fontWeight="bold">
                  Phần cần điều chỉnh:
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {formData.phanCanDieuChinh}
                </MDTypography>
              </Grid>
              <Grid item xs={12}>
                <MDTypography variant="body2" fontWeight="bold">
                  Lý do điều chỉnh:
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {formData.lyDo}
                </MDTypography>
              </Grid>
            </>
          )}

          {formData.lyDo && formData.loaiYeuCau !== LOAI_YEU_CAU.DIEU_CHINH_THONG_TIN && (
            <Grid item xs={12}>
              <MDTypography variant="body2" fontWeight="bold">
                Lý do:
              </MDTypography>
              <MDTypography variant="body2" color="text">
                {formData.lyDo}
              </MDTypography>
            </Grid>
          )}
        </Grid>
      </MDBox>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h4" fontWeight="medium" mb={3}>
                  Tạo yêu cầu cư trú
                </MDTypography>

                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <MDBox mt={4} mb={2}>
                  {renderStepContent(activeStep)}
                </MDBox>

                <MDBox display="flex" justifyContent="space-between" mt={4}>
                  <MDButton
                    variant="outlined"
                    color="secondary"
                    onClick={handleBack}
                    disabled={activeStep === 0 || loading}
                  >
                    Quay lại
                  </MDButton>

                  {activeStep < steps.length - 1 ? (
                    <MDButton variant="gradient" color="info" onClick={handleNext}>
                      Tiếp theo
                    </MDButton>
                  ) : (
                    <MDButton
                      variant="gradient"
                      color="success"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                    </MDButton>
                  )}
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {/* Success Snackbar */}
      <MDSnackbar
        color="success"
        icon="check"
        title="Thành công"
        content="Yêu cầu đã được tạo thành công!"
        open={successSB}
        onClose={() => setSuccessSB(false)}
        close={() => setSuccessSB(false)}
        bgWhite
      />

      {/* Error Snackbar */}
      <MDSnackbar
        color="error"
        icon="warning"
        title="Lỗi"
        content={errorMessage}
        open={errorSB}
        onClose={() => setErrorSB(false)}
        close={() => setErrorSB(false)}
        bgWhite
      />
    </DashboardLayout>
  );
}

export default TaoYeuCauCuTru;
