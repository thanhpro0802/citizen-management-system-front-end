import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

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

// Danh sách các loại quan hệ phổ biến
const RELATIONSHIPS = [
  { value: "VO", label: "Vợ" },
  { value: "CHONG", label: "Chồng" },
  { value: "CON", label: "Con" },
  { value: "CHA", label: "Cha" },
  { value: "ME", label: "Mẹ" },
  { value: "ANH_TRAI", label: "Anh trai" },
  { value: "CHI_GAI", label: "Chị gái" },
  { value: "EM_TRAI", label: "Em trai" },
  { value: "EM_GAI", label: "Em gái" },
  { value: "ONG", label: "Ông" },
  { value: "BA", label: "Bà" },
  { value: "CHAU", label: "Cháu" },
  { value: "KHAC", label: "Khác" },
];

function FormHoKhau() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Form state
  const [diaChi, setDiaChi] = useState("");
  const [cccdChuHo, setCccdChuHo] = useState("");

  // State quản lý danh sách thành viên để sửa quan hệ
  const [members, setMembers] = useState([]);

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

    // Lấy role từ user object (kiểm tra mọi trường có thể)
    const role = user.vaiTro || user.role || (Array.isArray(user.roles) ? user.roles[0] : "");

    // Danh sách các role được phép thực hiện thao tác Thêm/Sửa hộ khẩu
    const ROLES_CHO_PHEP = ["ADMIN", "CAN_BO_HO_KHAU", "TO_TRUONG", "TO_PHO"];

    const hasPermission = ROLES_CHO_PHEP.includes(role);

    if (!hasPermission) {
      alert("⛔ CẢNH BÁO: Bạn không có quyền thực hiện thao tác này!");
      navigate("/quan-ly-ho-khau"); // Trở về trang quản lý thay vì trang của công dân
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
      setCccdChuHo(data.chuHo?.soCCCD || "");

      if (Array.isArray(data.danhSachThanhVien)) {
        setMembers(data.danhSachThanhVien);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu hộ khẩu:", error);
      if (error.response && (error.response.status === 403 || error.response.status === 401)) {
        alert("Phiên đăng nhập đã hết hạn.");
        localStorage.removeItem("token");
        navigate("/authentication/sign-in");
        return;
      }
      setMessage({ type: "error", content: "Không thể tải thông tin hộ khẩu" });
    } finally {
      setLoadingData(false);
    }
  };

  // --- LOGIC MỚI: Xử lý thay đổi quan hệ và đổi chủ hộ ---
  const handleRelationshipChange = (index, newRelation) => {
    const updatedMembers = [...members];
    const selectedMember = updatedMembers[index];

    // Nếu người dùng chọn thành viên này làm "CHU_HO"
    if (newRelation === "CHU_HO") {
      // 1. Cập nhật ô input CCCD Chủ hộ ở trên cùng
      setCccdChuHo(selectedMember.soCCCD);

      // 2. Tìm chủ hộ cũ (nếu có) và reset quan hệ của họ về rỗng
      // (Để người dùng bắt buộc phải chọn quan hệ mới cho chủ hộ cũ, VD: Cha, Mẹ...)
      updatedMembers.forEach((mem, idx) => {
        if (idx !== index && mem.quanHeVoiChuHo === "CHU_HO") {
          mem.quanHeVoiChuHo = ""; // Reset về rỗng
        }
      });
    }

    updatedMembers[index].quanHeVoiChuHo = newRelation;
    setMembers(updatedMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!diaChi.trim()) {
      setMessage({ type: "error", content: "Vui lòng nhập địa chỉ!" });
      return;
    }

    if (!cccdChuHo.trim()) {
      setMessage({ type: "error", content: "Vui lòng nhập CCCD chủ hộ!" });
      return;
    }

    // Kiểm tra xem có thành viên nào chưa chọn quan hệ không (nếu là edit)
    if (isEditMode) {
      const missingRelation = members.find((m) => !m.quanHeVoiChuHo);
      if (missingRelation) {
        setMessage({
          type: "error",
          content: `Vui lòng chọn quan hệ cho thành viên: ${missingRelation.hoTen}`,
        });
        return;
      }
    }

    setLoading(true);
    setMessage({ type: "", content: "" });

    try {
      const payload = {
        diaChi: diaChi.trim(),
        chuHo: {
          soCCCD: cccdChuHo.trim(),
        },
        danhSachThanhVien: isEditMode
          ? members.map((mem) => ({
              maNhanKhau: mem.maNhanKhau,
              quanHeVoiChuHo: mem.quanHeVoiChuHo,
            }))
          : [],
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
      }, 1000);
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
        <MDBox pt={6} pb={3} display="flex" justifyContent="center">
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

                  <MDTypography variant="h6" mb={2}>
                    Thông tin chung
                  </MDTypography>
                  <Grid container spacing={2} mb={3}>
                    <Grid item xs={12}>
                      <TextField
                        label="Địa Chỉ Hộ Khẩu"
                        fullWidth
                        required
                        value={diaChi}
                        onChange={(e) => setDiaChi(e.target.value)}
                        placeholder="Số 123, Đường ABC..."
                        // Tăng kích thước ô nhập liệu
                        sx={{ "& .MuiInputBase-root": { height: "50px" } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="CCCD Chủ Hộ"
                        fullWidth
                        required
                        value={cccdChuHo}
                        onChange={(e) => setCccdChuHo(e.target.value)}
                        placeholder="Nhập số CCCD"
                        inputProps={{ maxLength: 12 }}
                        sx={{ "& .MuiInputBase-root": { height: "50px" } }}
                      />
                    </Grid>
                  </Grid>

                  {isEditMode && members.length > 0 && (
                    <>
                      <Divider />
                      <MDBox mt={2} mb={3}>
                        <MDTypography variant="h6" mb={1}>
                          Cập nhật quan hệ thành viên
                        </MDTypography>
                        <MDBox
                          p={2}
                          border="1px solid #eee"
                          borderRadius="lg"
                          maxHeight="500px" // Tăng chiều cao khung cuộn
                          overflow="auto"
                        >
                          {members.map((mem, index) => (
                            <Grid
                              container
                              spacing={2}
                              key={mem.maNhanKhau}
                              alignItems="center"
                              mb={2}
                              sx={{ borderBottom: "1px dashed #eee", pb: 2 }} // Thêm đường kẻ mờ phân cách
                            >
                              <Grid item xs={12} sm={6}>
                                <MDTypography variant="button" fontWeight="bold" fontSize="1rem">
                                  {mem.hoTen}
                                </MDTypography>
                                <br />
                                <MDTypography variant="caption" color="text" fontSize="0.85rem">
                                  CCCD: {mem.soCCCD}
                                </MDTypography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  select
                                  label="Quan hệ với chủ hộ"
                                  fullWidth
                                  // Bỏ size="small" để ô to hơn
                                  // Thêm sx để chỉnh chiều cao và font chữ
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      height: "56px", // Chiều cao chuẩn to hơn
                                      fontSize: "1rem",
                                    },
                                    "& .MuiInputLabel-root": {
                                      fontSize: "1rem",
                                    },
                                  }}
                                  value={mem.quanHeVoiChuHo}
                                  onChange={(e) => handleRelationshipChange(index, e.target.value)}
                                  // Đã bỏ disabled để có thể thay đổi chủ hộ
                                >
                                  {/* Option Chủ Hộ */}
                                  <MenuItem
                                    value="CHU_HO"
                                    sx={{ fontWeight: "bold", color: "primary.main" }}
                                  >
                                    ✪ Chủ hộ
                                  </MenuItem>
                                  {RELATIONSHIPS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                      {option.label}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </Grid>
                            </Grid>
                          ))}
                        </MDBox>
                      </MDBox>
                    </>
                  )}

                  <MDBox mt={4} mb={1} display="flex" gap={2}>
                    <MDButton
                      type="submit"
                      variant="gradient"
                      color={isEditMode ? "warning" : "success"}
                      fullWidth
                      disabled={loading}
                      size="large" // Nút to hơn
                    >
                      {loading ? (
                        <>
                          <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <Icon>{isEditMode ? "save" : "add"}</Icon>&nbsp;
                          {isEditMode ? "Cập Nhật Tất Cả" : "Thêm Mới"}
                        </>
                      )}
                    </MDButton>
                    <MDButton
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      onClick={() => navigate(-1)}
                      disabled={loading}
                      size="large"
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
