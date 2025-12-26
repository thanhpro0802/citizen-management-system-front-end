import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem"; // THÊM: Import MenuItem

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDAlert from "components/MDAlert";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API Service
import hoKhauService from "services/hoKhauService";

function TachHo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hoKhau, setHoKhau] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [newOwnerId, setNewOwnerId] = useState("");
  const [newAddress, setNewAddress] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const response = await hoKhauService.getById(id);
      setHoKhau(response.data);
    } catch (error) {
      setMessage({ type: "error", content: "Không thể tải thông tin hộ khẩu" });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMember = (memberId) => {
    const currentIndex = selectedMembers.indexOf(memberId);
    const newChecked = [...selectedMembers];

    if (currentIndex === -1) {
      newChecked.push(memberId);
    } else {
      newChecked.splice(currentIndex, 1);
      if (newOwnerId === memberId) setNewOwnerId("");
    }
    setSelectedMembers(newChecked);
  };

  const handleSubmit = async () => {
    if (selectedMembers.length === 0) {
      setMessage({ type: "error", content: "Vui lòng chọn ít nhất 1 thành viên để tách!" });
      return;
    }
    if (!newOwnerId) {
      setMessage({ type: "error", content: "Vui lòng chọn chủ hộ mới cho hộ tách ra!" });
      return;
    }
    if (!newAddress.trim()) {
      setMessage({ type: "error", content: "Vui lòng nhập địa chỉ mới!" });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        maNhanKhauTachRa: selectedMembers,
        maNhanKhauChuHoMoi: newOwnerId,
        diaChiMoi: newAddress,
      };

      // Gọi API tách hộ
      const response = await hoKhauService.tachHo(id, payload);

      setMessage({ type: "success", content: "Tách hộ thành công!" });

      // SỬA: Chuyển hướng đến hộ MỚI vừa được tạo (dùng ID từ response trả về)
      // Nếu API trả về object HoKhau mới, hãy dùng response.data.maHoKhau
      // Nếu API chỉ trả về status, dùng logic khác. Giả sử API trả về Hộ mới:
      const newHoKhauId = response.data?.maHoKhau || id;

      setTimeout(() => navigate(`/chi-tiet-ho-khau/${newHoKhauId}`), 1500);
    } catch (error) {
      setMessage({ type: "error", content: error.response?.data?.message || "Lỗi khi tách hộ" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <MDBox pt={6} pb={3} display="flex" justifyContent="center">
          <CircularProgress color="primary" />
        </MDBox>
      </DashboardLayout>
    );

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
                bgColor="primary" // SỬA: Đổi màu thành primary (đỏ/hồng) để giống nút Tách
                borderRadius="lg"
                coloredShadow="primary"
              >
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" color="white">
                    Tách Hộ Khẩu
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

              <MDBox pt={3} px={3}>
                {message.content && <MDAlert color={message.type}>{message.content}</MDAlert>}

                <MDTypography variant="h6">1. Chọn thành viên cần tách sang hộ mới:</MDTypography>
                <MDBox mb={3}>
                  {hoKhau?.danhSachThanhVien?.map((tv) => (
                    <MDBox key={tv.maNhanKhau} display="flex" alignItems="center" py={1}>
                      <Checkbox
                        checked={selectedMembers.includes(tv.maNhanKhau)}
                        onChange={() => handleToggleMember(tv.maNhanKhau)}
                      />
                      <MDBox ml={1}>
                        <MDTypography variant="button" fontWeight="medium">
                          {tv.hoTen}
                        </MDTypography>
                        <MDTypography variant="caption" color="text" ml={1}>
                          ({tv.soCCCD || "Chưa có CCCD"}) - {tv.quanHeVoiChuHo}
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                  ))}
                </MDBox>

                <MDTypography variant="h6">2. Thông tin hộ mới:</MDTypography>
                <Grid container spacing={2} mb={3}>
                  <Grid item xs={12}>
                    <MDInput
                      label="Địa chỉ mới"
                      fullWidth
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    {/* Đã xóa thẻ MDTypography thừa ở đây để giao diện đồng nhất */}
                    <MDInput
                      select
                      label="Chủ hộ mới (Chọn từ danh sách)"
                      fullWidth
                      value={newOwnerId}
                      onChange={(e) => setNewOwnerId(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          minHeight: "44px", // Đảm bảo chiều cao tối thiểu bằng ô text
                        },
                      }}
                    >
                      {/* Placeholder giả để ô không bị xẹp khi chưa có dữ liệu */}
                      <MenuItem value="" disabled>
                        <em>-- Chọn chủ hộ --</em>
                      </MenuItem>

                      {hoKhau?.danhSachThanhVien
                        ?.filter((tv) => selectedMembers.includes(tv.maNhanKhau))
                        .map((tv) => (
                          <MenuItem key={tv.maNhanKhau} value={tv.maNhanKhau}>
                            {tv.hoTen} ({tv.soCCCD || "Chưa có CCCD"})
                          </MenuItem>
                        ))}
                    </MDInput>
                  </Grid>
                </Grid>

                <MDBox mt={2} mb={3} display="flex" justifyContent="flex-end">
                  <MDButton
                    variant="gradient"
                    color="primary" // SỬA: Đổi màu nút xác nhận thành primary
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? "Đang xử lý..." : "Xác Nhận Tách Hộ"}
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

export default TachHo;
