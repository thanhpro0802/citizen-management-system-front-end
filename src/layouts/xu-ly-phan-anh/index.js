import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination"; // 1. Import Pagination

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
  getChiTietPhanAnh,
  getLichSuPhanAnh,
  phanCongXuLy,
  capNhatXuLyNoiBo,
  phanHoiCongDan,
  updateMucDoKhanCap,
} from "services/phanAnhService";

function XuLyPhanAnh() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [lichSu, setLichSu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ type: "", content: "" });

  // State Form
  const [mucDo, setMucDo] = useState("THAP");
  const [maCanBo, setMaCanBo] = useState("");
  const [thoiHan, setThoiHan] = useState("");
  const [noiDungXuLy, setNoiDungXuLy] = useState("");

  // 2. State Phân trang
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const getStatusLabel = (s) =>
    s === "DA_XU_LY" ? "Đã xong" : s === "DANG_XU_LY" ? "Đang xử lý" : "Chờ xử lý";

  const getMucDoLabel = (code) => {
    switch (code) {
      case "THAP":
        return "Thấp";
      case "TRUNG_BINH":
        return "Trung Bình";
      case "CAO":
        return "Cao";
      default:
        return code;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const fetchData = async () => {
    try {
      const [resDetail, resHistory] = await Promise.all([
        getChiTietPhanAnh(id),
        getLichSuPhanAnh(id),
      ]);

      if (resDetail && resDetail.data) {
        setData(resDetail.data);
        if (resDetail.data.mucDoKhanCap) setMucDo(resDetail.data.mucDoKhanCap);
      }

      if (resHistory && resHistory.data) {
        setLichSu(resHistory.data.sort((a, b) => new Date(b.thoiGian) - new Date(a.thoiGian)));
      }
    } catch (err) {
      setError("Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Handle actions... (Giữ nguyên các hàm xử lý logic cũ của bạn)
  const handleChangeMucDo = async (event) => {
    const newMucDo = event.target.value;
    setMucDo(newMucDo);
    try {
      await updateMucDoKhanCap(id, newMucDo);
      setMessage({ type: "success", content: `Đã đổi mức độ thành: ${getMucDoLabel(newMucDo)}` });
      fetchData();
    } catch (e) {
      if (e.response && e.response.status === 403) {
        setMessage({ type: "error", content: "⛔ LỖI QUYỀN (403): Bạn chưa được phân công!" });
      } else {
        setMessage({ type: "error", content: "Lỗi kết nối Server" });
      }
    }
  };

  const handlePhanCong = async () => {
    try {
      await phanCongXuLy(id, maCanBo, thoiHan);
      setMessage({ type: "success", content: `Đã phân công: ${maCanBo}` });
      fetchData();
    } catch (e) {
      setMessage({ type: "error", content: "Lỗi phân công!" });
    }
  };

  const handleNoiBo = async () => {
    try {
      await capNhatXuLyNoiBo(id, noiDungXuLy);
      setMessage({ type: "success", content: "Đã lưu nhật ký." });
      setNoiDungXuLy("");
      fetchData();
      // Reset về trang 1 khi có log mới để user thấy ngay
      setPage(1);
    } catch (e) {
      if (e.response && e.response.status === 403) {
        setMessage({ type: "error", content: "⛔ Không có quyền ghi nhật ký." });
      } else {
        setMessage({ type: "error", content: "Lỗi lưu dữ liệu." });
      }
    }
  };

  const handlePhanHoi = async () => {
    if (!window.confirm("Hoàn tất hồ sơ?")) return;
    try {
      await phanHoiCongDan(id, noiDungXuLy);
      setMessage({ type: "success", content: "Đã hoàn tất!" });
      setTimeout(() => navigate("/quan-ly-phan-anh"), 1500);
    } catch (e) {
      setMessage({ type: "error", content: "Lỗi phản hồi!" });
    }
  };

  // 3. Xử lý cắt mảng dữ liệu
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = lichSu.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(lichSu.length / rowsPerPage);

  if (loading)
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox p={5}>Đang tải...</MDBox>
      </DashboardLayout>
    );
  if (error || !data)
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox p={5}>Lỗi dữ liệu</MDBox>
      </DashboardLayout>
    );

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
              >
                <MDTypography variant="h6" color="white">
                  Xử Lý: {data.tieuDe}
                </MDTypography>
                <MDBox bgColor="white" px={2} borderRadius="md">
                  <MDTypography variant="button" fontWeight="bold" color="dark">
                    {getStatusLabel(data.trangThaiHienTai)}
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

                {/* --- KHU VỰC THÔNG TIN CHUNG --- */}
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
                  <MDTypography variant="h6" color="text">
                    Mức độ ưu tiên:
                  </MDTypography>
                  <MDBox width="200px">
                    <FormControl fullWidth size="small">
                      <InputLabel id="lvl">Mức độ</InputLabel>
                      <Select
                        labelId="lvl"
                        value={mucDo || "THAP"}
                        label="Mức độ"
                        onChange={handleChangeMucDo}
                        sx={{ height: 40, bgcolor: "white" }}
                      >
                        <MenuItem value="THAP">🟢 Thấp</MenuItem>
                        <MenuItem value="TRUNG_BINH">🟡 Trung Bình</MenuItem>
                        <MenuItem value="CAO">🔴 Cao</MenuItem>
                      </Select>
                    </FormControl>
                  </MDBox>
                </MDBox>

                <MDBox mb={3} p={2} bgColor="grey-100" borderRadius="lg">
                  <MDTypography variant="caption" fontWeight="bold">
                    Nội dung người dân gửi:
                  </MDTypography>
                  <MDTypography variant="body2">{data.noiDung}</MDTypography>
                </MDBox>
                <Divider />

                {/* --- KHU VỰC FORM --- */}
                {data.trangThaiHienTai === "CHO" && (
                  <MDBox mt={2}>
                    <MDTypography variant="h6" color="info" gutterBottom>
                      1. Phân Công Xử Lý
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
                          label="Hạn chót xử lý (Deadline)"
                          InputLabelProps={{ shrink: true }}
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
                    <MDTypography variant="h6" color="warning" gutterBottom>
                      2. Ghi Nhật Ký & Xử Lý
                    </MDTypography>
                    <MDInput
                      label="Nội dung công việc / kết quả..."
                      multiline
                      rows={4}
                      fullWidth
                      value={noiDungXuLy}
                      onChange={(e) => setNoiDungXuLy(e.target.value)}
                    />
                    <MDBox mt={2} display="flex" gap={2}>
                      <MDButton variant="outlined" color="info" onClick={handleNoiBo}>
                        Ghi Nhật Ký (Nội bộ)
                      </MDButton>
                      <MDButton variant="gradient" color="success" onClick={handlePhanHoi}>
                        Trả Lời Dân (Xong)
                      </MDButton>
                    </MDBox>
                  </MDBox>
                )}

                {data.trangThaiHienTai === "DA_XU_LY" && (
                  <MDBox mt={2} textAlign="center">
                    <MDTypography variant="h5" color="success">
                      ✅ Hồ sơ đã hoàn tất
                    </MDTypography>
                  </MDBox>
                )}

                <Divider sx={{ my: 4 }} />

                {/* --- KHU VỰC LỊCH SỬ (Đã phân trang) --- */}
                <MDBox>
                  <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <MDTypography variant="h5" color="dark">
                      📜 Lịch sử xử lý & Nhật ký
                    </MDTypography>
                    <MDTypography variant="caption">Tổng số: {lichSu.length} bản ghi</MDTypography>
                  </MDBox>

                  {lichSu.length === 0 ? (
                    <MDTypography variant="caption" color="text">
                      Chưa có hoạt động nào.
                    </MDTypography>
                  ) : (
                    <MDBox display="flex" flexDirection="column" gap={2}>
                      {/* 4. Render mảng currentRows thay vì lichSu */}
                      {currentRows.map((item, index) => {
                        let actionLabel = item.hanhDong;
                        let actionColor = "dark";
                        switch (item.hanhDong) {
                          case "TAO_MOI":
                            actionLabel = "🆕 Tạo mới phản ánh";
                            actionColor = "info";
                            break;
                          case "PHAN_CONG":
                            actionLabel = "👉 Phân công xử lý";
                            actionColor = "warning";
                            break;
                          case "XU_LY":
                            actionLabel = "📝 Ghi nhật ký xử lý";
                            actionColor = "dark";
                            break;
                          case "PHAN_HOI":
                            actionLabel = "✅ Đã phản hồi & Hoàn tất";
                            actionColor = "success";
                            break;
                          case "DANH_GIA":
                            actionLabel = "⭐ Công dân đánh giá";
                            actionColor = "primary";
                            break;
                          default:
                            break;
                        }

                        return (
                          <MDBox
                            key={index}
                            p={2}
                            borderRadius="lg"
                            bgColor="grey-100"
                            border="1px solid #e0e0e0"
                            sx={{ borderLeft: `4px solid`, borderLeftColor: actionColor }}
                          >
                            <MDBox
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              mb={1}
                            >
                              <MDTypography
                                variant="caption"
                                fontWeight="bold"
                                color={actionColor}
                                textTransform="uppercase"
                              >
                                {actionLabel}
                              </MDTypography>
                              <MDTypography variant="caption" color="text">
                                🕒 {formatDate(item.thoiGian)}
                              </MDTypography>
                            </MDBox>
                            <MDTypography
                              variant="button"
                              fontWeight="bold"
                              color="dark"
                              display="block"
                            >
                              Người thực hiện: {item.nguoiThucHien || "Hệ thống"}
                            </MDTypography>
                            <MDBox
                              mt={1}
                              p={1}
                              bgColor="white"
                              borderRadius="md"
                              border="1px dashed #ccc"
                            >
                              <MDTypography
                                variant="body2"
                                color="text"
                                sx={{ whiteSpace: "pre-line" }}
                              >
                                {item.noiDung || "(Không có nội dung chi tiết)"}
                              </MDTypography>
                            </MDBox>
                          </MDBox>
                        );
                      })}
                    </MDBox>
                  )}

                  {/* 5. Thanh Phân Trang */}
                  {lichSu.length > rowsPerPage && (
                    <MDBox display="flex" justifyContent="center" mt={3}>
                      <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                      />
                    </MDBox>
                  )}
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

export default XuLyPhanAnh;
