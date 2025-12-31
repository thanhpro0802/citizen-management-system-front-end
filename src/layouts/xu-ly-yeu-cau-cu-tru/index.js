import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";

// Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDAlert from "components/MDAlert";

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Services
import {
  getChiTietYeuCau,
  nhanXuLyYeuCau,
  pheDuyetYeuCau,
  tuChoiYeuCau,
} from "services/yeuCauCuTruService";

function XuLyYeuCauCuTru() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ type: "", content: "" });

  // State form xử lý
  const [hanhDong, setHanhDong] = useState("nhan_xu_ly");
  const [ghiChu, setGhiChu] = useState("");
  const [lyDoTuChoi, setLyDoTuChoi] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ CẬP NHẬT PHÂN QUYỀN: Hỗ trợ tất cả các vai trò quản lý
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole =
    currentUser.vaiTro ||
    currentUser.role ||
    (Array.isArray(currentUser.roles) ? currentUser.roles[0] : "");

  // Danh sách các vai trò được phép xử lý yêu cầu cư trú
  const ROLES_QUAN_LY = ["ADMIN", "CAN_BO_HO_KHAU", "CAN_BO_NHAN_KHAU", "TO_TRUONG", "TO_PHO"];
  const isAuthorized = ROLES_QUAN_LY.includes(userRole);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getChiTietYeuCau(id);
      setData(response);

      // Tự động chuyển mode radio dựa trên trạng thái hiện tại
      if (response.trangThai === "DANG_XU_LY") {
        setHanhDong("phe_duyet");
      }
    } catch (err) {
      setError("Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      if (hanhDong === "nhan_xu_ly") {
        await nhanXuLyYeuCau(id);
        setMessage({ type: "success", content: "Đã nhận xử lý yêu cầu!" });
      } else if (hanhDong === "phe_duyet") {
        await pheDuyetYeuCau(id, { ghiChu });
        setMessage({ type: "success", content: "Đã phê duyệt yêu cầu thành công!" });
      } else if (hanhDong === "tu_choi") {
        if (!lyDoTuChoi.trim()) {
          setMessage({ type: "error", content: "Vui lòng nhập lý do từ chối!" });
          return;
        }
        await tuChoiYeuCau(id, { lyDoTuChoi, ghiChu });
        setMessage({ type: "success", content: "Đã từ chối yêu cầu!" });
      }
      setTimeout(() => navigate("/quan-ly-yeu-cau-cu-tru"), 2000);
    } catch (err) {
      setMessage({ type: "error", content: err.response?.data?.message || "Có lỗi xảy ra!" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper Labels (Giữ nguyên logic cũ của bạn)
  const getLoaiYeuCauLabel = (loai) => {
    const labels = {
      DANG_KY_TAM_TRU: "Đăng ký tạm trú",
      DANG_KY_THUONG_TRU: "Đăng ký thường trú",
      KHAI_BAO_TAM_VANG: "Khai báo tạm vắng",
      DIEU_CHINH_THONG_TIN: "Điều chỉnh thông tin cư trú",
      XOA_DANG_KY: "Xóa đăng ký thường trú",
    };
    return labels[loai] || loai;
  };

  const getTrangThaiLabel = (trangThai) => {
    const labels = {
      CHO_XU_LY: "Chờ xử lý",
      DANG_XU_LY: "Đang xử lý",
      DA_PHE_DUYET: "Đã phê duyệt",
      TU_CHOI: "Từ chối",
    };
    return labels[trangThai] || trangThai;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading)
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} textAlign="center">
          <MDTypography variant="h6">Đang tải...</MDTypography>
        </MDBox>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          {message.content && (
            <Grid item xs={12}>
              <MDAlert color={message.type}>{message.content}</MDAlert>
            </Grid>
          )}

          <Grid item xs={12} md={7}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h5" fontWeight="bold" mb={2}>
                  Thông tin yêu cầu
                </MDTypography>
                <Divider />
                <MDBox mt={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <MDTypography variant="button" fontWeight="bold">
                        Mã yêu cầu:
                      </MDTypography>
                      <MDTypography variant="body2">{data?.maYeuCau}</MDTypography>
                    </Grid>
                    <Grid item xs={6}>
                      <MDTypography variant="button" fontWeight="bold">
                        Trạng thái:
                      </MDTypography>
                      <MDTypography variant="body2">
                        {getTrangThaiLabel(data?.trangThai)}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12}>
                      <MDTypography variant="button" fontWeight="bold">
                        Loại yêu cầu:
                      </MDTypography>
                      <MDTypography variant="body2">
                        {getLoaiYeuCauLabel(data?.loaiYeuCau)}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={6}>
                      <MDTypography variant="button" fontWeight="bold">
                        Người gửi:
                      </MDTypography>
                      <MDTypography variant="body2">{data?.nguoiTaoHoTen}</MDTypography>
                    </Grid>
                    <Grid item xs={6}>
                      <MDTypography variant="button" fontWeight="bold">
                        CCCD:
                      </MDTypography>
                      <MDTypography variant="body2">{data?.nguoiTaoCccd}</MDTypography>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>

          {/* Form xử lý - Hiện cho tất cả các role Quản lý */}
          {isAuthorized && (
            <Grid item xs={12} md={5}>
              <Card>
                <MDBox p={3}>
                  <MDTypography variant="h5" fontWeight="bold" mb={2}>
                    Xử lý yêu cầu
                  </MDTypography>
                  <Divider />

                  {data.trangThai === "DA_PHE_DUYET" || data.trangThai === "TU_CHOI" ? (
                    <MDBox mt={2}>
                      <MDAlert color="warning">Yêu cầu này đã được đóng (Đã xử lý xong).</MDAlert>
                    </MDBox>
                  ) : (
                    <MDBox mt={2}>
                      <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend">Hành động</FormLabel>
                        <RadioGroup value={hanhDong} onChange={(e) => setHanhDong(e.target.value)}>
                          {data.trangThai === "CHO_XU_LY" && (
                            <FormControlLabel
                              value="nhan_xu_ly"
                              control={<Radio />}
                              label="Nhận hồ sơ & Xử lý"
                            />
                          )}
                          {data.trangThai === "DANG_XU_LY" && (
                            <>
                              <FormControlLabel
                                value="phe_duyet"
                                control={<Radio />}
                                label="✅ Phê duyệt cấp phép"
                              />
                              <FormControlLabel
                                value="tu_choi"
                                control={<Radio />}
                                label="❌ Từ chối hồ sơ"
                              />
                            </>
                          )}
                        </RadioGroup>
                      </FormControl>

                      <MDBox mt={2}>
                        {hanhDong === "tu_choi" && (
                          <TextField
                            label="Lý do từ chối"
                            multiline
                            rows={3}
                            fullWidth
                            value={lyDoTuChoi}
                            onChange={(e) => setLyDoTuChoi(e.target.value)}
                            required
                            sx={{ mb: 2 }}
                          />
                        )}
                        <TextField
                          label="Ghi chú nội bộ"
                          multiline
                          rows={2}
                          fullWidth
                          value={ghiChu}
                          onChange={(e) => setGhiChu(e.target.value)}
                        />
                      </MDBox>

                      <MDBox mt={3} display="flex" gap={2}>
                        <MDButton
                          variant="gradient"
                          color="info"
                          fullWidth
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Đang lưu..." : "Xác nhận"}
                        </MDButton>
                        <MDButton
                          variant="outlined"
                          color="secondary"
                          fullWidth
                          onClick={() => navigate(-1)}
                        >
                          Hủy
                        </MDButton>
                      </MDBox>
                    </MDBox>
                  )}
                </MDBox>
              </Card>
            </Grid>
          )}
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default XuLyYeuCauCuTru;
