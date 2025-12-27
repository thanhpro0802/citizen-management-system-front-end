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
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";

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
  const [hanhDong, setHanhDong] = useState("nhan_xu_ly"); // nhan_xu_ly | phe_duyet | tu_choi
  const [ghiChu, setGhiChu] = useState("");
  const [lyDoTuChoi, setLyDoTuChoi] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Phân quyền
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userRoles = Array.isArray(currentUser.roles)
    ? currentUser.roles
    : currentUser.role
    ? [currentUser.role]
    : [];
  const isCanBo = userRoles.includes("CAN_BO");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getChiTietYeuCau(id);
      setData(response);
    } catch (err) {
      setError("Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setMessage({ type: "", content: "" });

      if (hanhDong === "nhan_xu_ly") {
        await nhanXuLyYeuCau(id);
        setMessage({ type: "success", content: "Đã nhận xử lý yêu cầu thành công!" });
        setTimeout(() => navigate("/quan-ly-yeu-cau-cu-tru"), 2000);
      } else if (hanhDong === "phe_duyet") {
        await pheDuyetYeuCau(id, { ghiChu });
        setMessage({ type: "success", content: "Đã phê duyệt yêu cầu thành công!" });
        setTimeout(() => navigate("/quan-ly-yeu-cau-cu-tru"), 2000);
      } else if (hanhDong === "tu_choi") {
        if (!lyDoTuChoi.trim()) {
          setMessage({ type: "error", content: "Vui lòng nhập lý do từ chối!" });
          return;
        }
        await tuChoiYeuCau(id, { lyDoTuChoi, ghiChu });
        setMessage({ type: "success", content: "Đã từ chối yêu cầu!" });
        setTimeout(() => navigate("/quan-ly-yeu-cau-cu-tru"), 2000);
      }
    } catch (err) {
      setMessage({ type: "error", content: err.response?.data?.message || "Có lỗi xảy ra!" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Các label
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

  const getLoaiHinhLabel = (loai) => {
    const labels = {
      LAP_MOI_HO: "Lập mới hộ",
      VAO_HO_DA_CO: "Vào hộ đã có",
    };
    return labels[loai] || loai;
  };

  const getDoiTuongLabel = (doiTuong) => {
    const labels = {
      BAN_THAN: "Bản thân",
      KHAI_HO: "Khai hộ",
    };
    return labels[doiTuong] || doiTuong;
  };

  const getLoaiTamVangLabel = (loai) => {
    const labels = {
      TRONG_NUOC: "Trong nước",
      NUOC_NGOAI: "Nước ngoài",
    };
    return labels[loai] || loai;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3} display="flex" justifyContent="center">
          <MDTypography variant="h6">Đang tải...</MDTypography>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3}>
          <MDAlert color="error">{error || "Không tìm thấy yêu cầu"}</MDAlert>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  // Kiểm tra trạng thái có thể xử lý không
  const canProcess = data.trangThai === "CHO_XU_LY" || data.trangThai === "DANG_XU_LY";

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          {/* Thông báo */}
          {message.content && (
            <Grid item xs={12}>
              <MDAlert color={message.type}>{message.content}</MDAlert>
            </Grid>
          )}

          {/* Thông tin yêu cầu */}
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
                      <MDTypography variant="body2">{data.maYeuCau}</MDTypography>
                    </Grid>
                    <Grid item xs={6}>
                      <MDTypography variant="button" fontWeight="bold">
                        Loại:
                      </MDTypography>
                      <MDTypography variant="body2">
                        {getLoaiYeuCauLabel(data.loaiYeuCau)}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={6}>
                      <MDTypography variant="button" fontWeight="bold">
                        Trạng thái:
                      </MDTypography>
                      <MDTypography variant="body2">
                        {getTrangThaiLabel(data.trangThai)}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={6}>
                      <MDTypography variant="button" fontWeight="bold">
                        Ngày tạo:
                      </MDTypography>
                      <MDTypography variant="body2">{formatDate(data.ngayTao)}</MDTypography>
                    </Grid>
                    <Grid item xs={6}>
                      <MDTypography variant="button" fontWeight="bold">
                        Người tạo:
                      </MDTypography>
                      <MDTypography variant="body2">{data.nguoiTaoHoTen || "N/A"}</MDTypography>
                    </Grid>
                    <Grid item xs={6}>
                      <MDTypography variant="button" fontWeight="bold">
                        CCCD:
                      </MDTypography>
                      <MDTypography variant="body2">{data.nguoiTaoCccd || "N/A"}</MDTypography>
                    </Grid>
                    <Grid item xs={12}>
                      <MDTypography variant="button" fontWeight="bold">
                        Đối tượng đề nghị:
                      </MDTypography>
                      <MDTypography variant="body2">
                        {getDoiTuongLabel(data.doiTuongDeNghi)}
                      </MDTypography>
                    </Grid>

                    {/* Thông tin người đề nghị (khi khai hộ) */}
                    {data.doiTuongDeNghi === "KHAI_HO" && data.nguoiDeNghiHoTen && (
                      <>
                        <Grid item xs={12}>
                          <Divider sx={{ my: 1 }} />
                          <MDTypography variant="h6" fontWeight="bold">
                            Thông tin người đề nghị
                          </MDTypography>
                        </Grid>
                        <Grid item xs={6}>
                          <MDTypography variant="button" fontWeight="bold">
                            Họ và tên:
                          </MDTypography>
                          <MDTypography variant="body2">{data.nguoiDeNghiHoTen}</MDTypography>
                        </Grid>
                        <Grid item xs={6}>
                          <MDTypography variant="button" fontWeight="bold">
                            Giới tính:
                          </MDTypography>
                          <MDTypography variant="body2">{data.nguoiDeNghiGioiTinh}</MDTypography>
                        </Grid>
                        <Grid item xs={6}>
                          <MDTypography variant="button" fontWeight="bold">
                            Ngày sinh:
                          </MDTypography>
                          <MDTypography variant="body2">
                            {formatDate(data.nguoiDeNghiNgaySinh)}
                          </MDTypography>
                        </Grid>
                        <Grid item xs={6}>
                          <MDTypography variant="button" fontWeight="bold">
                            CCCD:
                          </MDTypography>
                          <MDTypography variant="body2">{data.nguoiDeNghiCccd}</MDTypography>
                        </Grid>
                      </>
                    )}

                    {/* Thông tin theo loại yêu cầu */}
                    {(data.loaiYeuCau === "DANG_KY_TAM_TRU" ||
                      data.loaiYeuCau === "DANG_KY_THUONG_TRU") && (
                      <>
                        <Grid item xs={12}>
                          <Divider sx={{ my: 1 }} />
                          <MDTypography variant="h6" fontWeight="bold">
                            Thông tin đăng ký
                          </MDTypography>
                        </Grid>
                        <Grid item xs={6}>
                          <MDTypography variant="button" fontWeight="bold">
                            Loại hình:
                          </MDTypography>
                          <MDTypography variant="body2">
                            {getLoaiHinhLabel(data.loaiHinhDangKy)}
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12}>
                          <MDTypography variant="button" fontWeight="bold">
                            Địa chỉ:
                          </MDTypography>
                          <MDTypography variant="body2">{data.diaChiCuTru}</MDTypography>
                        </Grid>
                        {data.chuHoHoTen && (
                          <>
                            <Grid item xs={6}>
                              <MDTypography variant="button" fontWeight="bold">
                                Chủ hộ:
                              </MDTypography>
                              <MDTypography variant="body2">{data.chuHoHoTen}</MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                              <MDTypography variant="button" fontWeight="bold">
                                CCCD chủ hộ:
                              </MDTypography>
                              <MDTypography variant="body2">{data.chuHoCccd}</MDTypography>
                            </Grid>
                          </>
                        )}
                      </>
                    )}

                    {data.loaiYeuCau === "KHAI_BAO_TAM_VANG" && (
                      <>
                        <Grid item xs={12}>
                          <Divider sx={{ my: 1 }} />
                          <MDTypography variant="h6" fontWeight="bold">
                            Thông tin tạm vắng
                          </MDTypography>
                        </Grid>
                        <Grid item xs={6}>
                          <MDTypography variant="button" fontWeight="bold">
                            Loại:
                          </MDTypography>
                          <MDTypography variant="body2">
                            {getLoaiTamVangLabel(data.loaiTamVang)}
                          </MDTypography>
                        </Grid>
                        <Grid item xs={6}>
                          <MDTypography variant="button" fontWeight="bold">
                            Nơi đến:
                          </MDTypography>
                          <MDTypography variant="body2">{data.noiDen}</MDTypography>
                        </Grid>
                        <Grid item xs={6}>
                          <MDTypography variant="button" fontWeight="bold">
                            Từ ngày:
                          </MDTypography>
                          <MDTypography variant="body2">
                            {formatDate(data.thoiGianBatDau)}
                          </MDTypography>
                        </Grid>
                        <Grid item xs={6}>
                          <MDTypography variant="button" fontWeight="bold">
                            Đến ngày:
                          </MDTypography>
                          <MDTypography variant="body2">
                            {formatDate(data.thoiGianKetThuc)}
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12}>
                          <MDTypography variant="button" fontWeight="bold">
                            Lý do:
                          </MDTypography>
                          <MDTypography variant="body2">{data.lyDo}</MDTypography>
                        </Grid>
                      </>
                    )}

                    {data.loaiYeuCau === "DIEU_CHINH_THONG_TIN" && (
                      <>
                        <Grid item xs={12}>
                          <Divider sx={{ my: 1 }} />
                          <MDTypography variant="h6" fontWeight="bold">
                            Thông tin điều chỉnh
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12}>
                          <MDTypography variant="button" fontWeight="bold">
                            Phần cần điều chỉnh:
                          </MDTypography>
                          <MDTypography variant="body2">
                            {data.phanCanDieuChinh || "N/A"}
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12}>
                          <MDTypography variant="button" fontWeight="bold">
                            Lý do:
                          </MDTypography>
                          <MDTypography variant="body2">{data.lyDo || "N/A"}</MDTypography>
                        </Grid>
                      </>
                    )}

                    {data.loaiYeuCau === "XOA_DANG_KY" && data.lyDo && (
                      <>
                        <Grid item xs={12}>
                          <Divider sx={{ my: 1 }} />
                          <MDTypography variant="h6" fontWeight="bold">
                            Lý do xóa đăng ký
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12}>
                          <MDTypography variant="body2">{data.lyDo}</MDTypography>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>

          {/* Form xử lý - CHỈ HIỂN THỊ NẾU LÀ CÁN BỘ */}
          {isCanBo && (
            <Grid item xs={12} md={5}>
              <Card>
                <MDBox p={3}>
                  <MDTypography variant="h5" fontWeight="bold" mb={2}>
                    Xử lý yêu cầu
                  </MDTypography>
                  <Divider />

                  {!canProcess ? (
                    <MDBox mt={2}>
                      <MDAlert color="warning">
                        Yêu cầu đã được xử lý. Không thể thực hiện hành động mới.
                      </MDAlert>
                    </MDBox>
                  ) : (
                    <MDBox mt={2}>
                      <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend">
                          <MDTypography variant="button" fontWeight="bold">
                            Hành động
                          </MDTypography>
                        </FormLabel>
                        <RadioGroup value={hanhDong} onChange={(e) => setHanhDong(e.target.value)}>
                          {data.trangThai === "CHO_XU_LY" && (
                            <FormControlLabel
                              value="nhan_xu_ly"
                              control={<Radio />}
                              label="Nhận xử lý"
                            />
                          )}
                          {data.trangThai === "DANG_XU_LY" && (
                            <>
                              <FormControlLabel
                                value="phe_duyet"
                                control={<Radio />}
                                label="Phê duyệt"
                              />
                              <FormControlLabel
                                value="tu_choi"
                                control={<Radio />}
                                label="Từ chối"
                              />
                            </>
                          )}
                        </RadioGroup>
                      </FormControl>

                      <MDBox mt={3}>
                        {hanhDong === "tu_choi" && (
                          <TextField
                            label="Lý do từ chối"
                            multiline
                            rows={3}
                            fullWidth
                            value={lyDoTuChoi}
                            onChange={(e) => setLyDoTuChoi(e.target.value)}
                            required
                          />
                        )}

                        {(hanhDong === "phe_duyet" || hanhDong === "tu_choi") && (
                          <TextField
                            label="Ghi chú (tùy chọn)"
                            multiline
                            rows={3}
                            fullWidth
                            value={ghiChu}
                            onChange={(e) => setGhiChu(e.target.value)}
                            sx={{ mt: 2 }}
                          />
                        )}
                      </MDBox>

                      <MDBox mt={3} display="flex" gap={2}>
                        <MDButton
                          variant="gradient"
                          color="info"
                          fullWidth
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
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
