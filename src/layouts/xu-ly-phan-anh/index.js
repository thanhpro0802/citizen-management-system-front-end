import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon"; // Đã thêm Import Icon
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

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

// API Service (Đảm bảo file service đã có đủ các hàm này)
import {
  getChiTietPhanAnh,
  phanCongXuLy,
  capNhatXuLyNoiBo,
  phanHoiCongDan,
  updateMucDoKhanCap,
} from "services/phanAnhService";

function XuLyPhanAnh() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State quản lý dữ liệu và giao diện
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State lỗi nếu API chết

  // State form
  const [mucDo, setMucDo] = useState("THAP");
  const [maCanBo, setMaCanBo] = useState("");
  const [thoiHan, setThoiHan] = useState("");
  const [noiDungXuLy, setNoiDungXuLy] = useState("");
  const [message, setMessage] = useState({ type: "", content: "" });

  // Load dữ liệu
  const fetchData = async () => {
    try {
      if (!id) throw new Error("Không tìm thấy ID phản ánh trên URL");

      const res = await getChiTietPhanAnh(id);
      if (res && res.data) {
        setData(res.data);
        if (res.data.mucDoKhanCap) {
          setMucDo(res.data.mucDoKhanCap);
        }
      } else {
        throw new Error("Dữ liệu trả về rỗng");
      }
    } catch (err) {
      console.error("Lỗi tải trang xử lý:", err);
      setError(
        "Không thể tải thông tin phản ánh. Vui lòng kiểm tra lại đường dẫn hoặc kết nối mạng."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // 1. Thay đổi mức độ
  const handleChangeMucDo = async (event) => {
    const newMucDo = event.target.value;
    setMucDo(newMucDo);
    try {
      await updateMucDoKhanCap(id, newMucDo);
      setMessage({ type: "success", content: `Cập nhật mức độ: ${newMucDo}` });
    } catch (e) {
      setMessage({ type: "error", content: "Lỗi cập nhật mức độ!" });
    }
  };

  // 2. Phân công
  const handlePhanCong = async () => {
    try {
      await phanCongXuLy(id, maCanBo, thoiHan);
      setMessage({ type: "success", content: "Phân công thành công!" });
      fetchData();
    } catch (e) {
      setMessage({ type: "error", content: "Lỗi phân công!" });
    }
  };

  // 3. Cập nhật nội bộ
  const handleNoiBo = async () => {
    try {
      await capNhatXuLyNoiBo(id, noiDungXuLy);
      setMessage({ type: "success", content: "Đã ghi nhật ký nội bộ." });
      setNoiDungXuLy("");
    } catch (e) {
      setMessage({ type: "error", content: "Lỗi cập nhật!" });
    }
  };

  // 4. Phản hồi dân
  const handlePhanHoi = async () => {
    try {
      await phanHoiCongDan(id, noiDungXuLy);
      setMessage({ type: "success", content: "Đã phản hồi và đóng hồ sơ." });
      setTimeout(() => navigate("/quan-ly-phan-anh"), 2000);
    } catch (e) {
      setMessage({ type: "error", content: "Lỗi gửi phản hồi!" });
    }
  };

  // --- SAFE GUARD: Xử lý hiển thị khi đang tải hoặc lỗi ---
  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox p={5} textAlign="center">
          <MDTypography>Đang tải dữ liệu...</MDTypography>
        </MDBox>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox p={5} textAlign="center">
          <MDTypography color="error" variant="h5">
            Đã xảy ra lỗi!
          </MDTypography>
          <MDTypography>{error || "Không tìm thấy dữ liệu."}</MDTypography>
          <MDButton variant="text" color="info" onClick={() => navigate("/quan-ly-phan-anh")}>
            Quay lại danh sách
          </MDButton>
        </MDBox>
      </DashboardLayout>
    );
  }

  // --- GIAO DIỆN CHÍNH ---
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="primary"
                borderRadius="lg"
                coloredShadow="primary"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Xử Lý Hồ Sơ: {data.tieuDe}
                </MDTypography>
                <MDBox bgColor="white" px={2} borderRadius="md">
                  <MDTypography variant="button" fontWeight="bold" color="dark">
                    {data.trangThaiHienTai}
                  </MDTypography>
                </MDBox>
              </MDBox>

              <MDBox p={4}>
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

                {/* --- KHU VỰC 1: ĐÁNH GIÁ MỨC ĐỘ --- */}
                <MDBox
                  mb={3}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  bgColor="#f8f9fa"
                  p={2}
                  borderRadius="lg"
                  border="1px solid #e0e0e0"
                >
                  <MDBox>
                    <MDTypography variant="h6" color="text">
                      Đánh giá mức độ ưu tiên:
                    </MDTypography>
                  </MDBox>
                  <MDBox width="200px">
                    <FormControl fullWidth size="small">
                      <InputLabel id="muc-do-label">Mức độ</InputLabel>
                      <Select
                        labelId="muc-do-label"
                        value={mucDo || "THAP"} // Safe value
                        label="Mức độ"
                        onChange={handleChangeMucDo}
                        disabled={data.trangThaiHienTai === "DA_XU_LY"}
                        sx={{ height: 40, bgcolor: "white" }}
                      >
                        <MenuItem value="THAP">🟢 Thấp</MenuItem>
                        <MenuItem value="TRUNG_BINH">🟡 Trung Bình</MenuItem>
                        <MenuItem value="CAO">🔴 Cao</MenuItem>
                        <MenuItem value="KHAN_CAP">⚫ Khẩn Cấp</MenuItem>
                      </Select>
                    </FormControl>
                  </MDBox>
                </MDBox>

                {/* --- CHI TIẾT --- */}
                <MDBox mb={3} p={2} bgColor="grey-100" borderRadius="lg">
                  <MDTypography variant="body2">{data.noiDung}</MDTypography>
                </MDBox>

                <Divider />

                {/* --- KHU VỰC 2: FORM XỬ LÝ --- */}

                {data.trangThaiHienTai === "CHO" && (
                  <MDBox mt={2}>
                    <MDTypography variant="h6" gutterBottom color="info">
                      1. Phân Công
                    </MDTypography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <MDInput
                          label="Mã Cán Bộ"
                          fullWidth
                          value={maCanBo}
                          onChange={(e) => setMaCanBo(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MDInput
                          type="date"
                          fullWidth
                          value={thoiHan}
                          onChange={(e) => setThoiHan(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <MDButton variant="gradient" color="info" onClick={handlePhanCong}>
                          Phân Công
                        </MDButton>
                      </Grid>
                    </Grid>
                  </MDBox>
                )}

                {data.trangThaiHienTai === "DANG_XU_LY" && (
                  <MDBox mt={2}>
                    <MDTypography variant="h6" gutterBottom color="warning">
                      2. Xử Lý & Phản Hồi
                    </MDTypography>
                    <MDInput
                      label="Nội dung xử lý..."
                      multiline
                      rows={4}
                      fullWidth
                      value={noiDungXuLy}
                      onChange={(e) => setNoiDungXuLy(e.target.value)}
                    />
                    <MDBox mt={2} display="flex" gap={2}>
                      <MDButton variant="outlined" color="secondary" onClick={handleNoiBo}>
                        Ghi Nhật Ký
                      </MDButton>
                      <MDButton variant="gradient" color="success" onClick={handlePhanHoi}>
                        Phản Hồi Dân
                      </MDButton>
                    </MDBox>
                  </MDBox>
                )}

                {data.trangThaiHienTai === "DA_XU_LY" && (
                  <MDBox mt={2} textAlign="center">
                    <MDTypography variant="h5" color="success">
                      <Icon>check</Icon> Hoàn tất
                    </MDTypography>
                  </MDBox>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default XuLyPhanAnh;
