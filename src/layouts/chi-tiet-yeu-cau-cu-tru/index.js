import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDBadge from "components/MDBadge";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API Service
import { getChiTietYeuCau } from "services/yeuCauCuTruService";

function ChiTietYeuCauCuTru() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị màu badge
  const getBadgeColor = (trangThai) => {
    switch (trangThai) {
      case "CHO_XU_LY":
        return "warning";
      case "DANG_XU_LY":
        return "info";
      case "DA_PHE_DUYET":
        return "success";
      case "TU_CHOI":
        return "error";
      default:
        return "secondary";
    }
  };

  // Các label hiển thị
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
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3} display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3}>
          <Card>
            <MDBox p={3}>
              <MDTypography variant="h6" color="error">
                Không tìm thấy yêu cầu
              </MDTypography>
            </MDBox>
          </Card>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Chi tiết yêu cầu cư trú
                </MDTypography>
              </MDBox>

              <MDBox p={3}>
                {/* Thông tin cơ bản */}
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MDTypography variant="button" fontWeight="bold" textTransform="uppercase">
                      Mã yêu cầu:
                    </MDTypography>
                    <MDTypography variant="body2">{data.maYeuCau}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography variant="button" fontWeight="bold" textTransform="uppercase">
                      Loại yêu cầu:
                    </MDTypography>
                    <MDTypography variant="body2">
                      {getLoaiYeuCauLabel(data.loaiYeuCau)}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography variant="button" fontWeight="bold" textTransform="uppercase">
                      Trạng thái:
                    </MDTypography>
                    <MDBox mt={0.5}>
                      <MDBadge
                        badgeContent={getTrangThaiLabel(data.trangThai)}
                        color={getBadgeColor(data.trangThai)}
                        variant="gradient"
                        size="sm"
                      />
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography variant="button" fontWeight="bold" textTransform="uppercase">
                      Ngày tạo:
                    </MDTypography>
                    <MDTypography variant="body2">{formatDate(data.ngayTao)}</MDTypography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Thông tin người đề nghị */}
                <MDTypography variant="h6" fontWeight="medium" mb={2}>
                  Thông tin người đề nghị
                </MDTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MDTypography variant="button" fontWeight="bold" textTransform="uppercase">
                      Đối tượng đề nghị:
                    </MDTypography>
                    <MDTypography variant="body2">
                      {getDoiTuongLabel(data.doiTuongDeNghi)}
                    </MDTypography>
                  </Grid>
                  {data.doiTuongDeNghi === "KHAI_HO" && (
                    <>
                      <Grid item xs={12} md={6}>
                        <MDTypography variant="button" fontWeight="bold" textTransform="uppercase">
                          Họ tên người đề nghị:
                        </MDTypography>
                        <MDTypography variant="body2">{data.nguoiDeNghiHoTen}</MDTypography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MDTypography variant="button" fontWeight="bold" textTransform="uppercase">
                          CCCD:
                        </MDTypography>
                        <MDTypography variant="body2">{data.nguoiDeNghiCccd}</MDTypography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MDTypography variant="button" fontWeight="bold" textTransform="uppercase">
                          Ngày sinh:
                        </MDTypography>
                        <MDTypography variant="body2">
                          {formatDate(data.nguoiDeNghiNgaySinh)}
                        </MDTypography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MDTypography variant="button" fontWeight="bold" textTransform="uppercase">
                          Giới tính:
                        </MDTypography>
                        <MDTypography variant="body2">{data.nguoiDeNghiGioiTinh}</MDTypography>
                      </Grid>
                    </>
                  )}
                </Grid>

                {/* Thông tin theo loại yêu cầu */}
                {(data.loaiYeuCau === "DANG_KY_TAM_TRU" ||
                  data.loaiYeuCau === "DANG_KY_THUONG_TRU") && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <MDTypography variant="h6" fontWeight="medium" mb={2}>
                      Thông tin đăng ký
                    </MDTypography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <MDTypography variant="button" fontWeight="bold" textTransform="uppercase">
                          Loại hình đăng ký:
                        </MDTypography>
                        <MDTypography variant="body2">
                          {getLoaiHinhLabel(data.loaiHinhDangKy)}
                        </MDTypography>
                      </Grid>
                      {data.loaiHinhDangKy === "VAO_HO_DA_CO" && (
                        <>
                          <Grid item xs={12} md={6}>
                            <MDTypography
                              variant="button"
                              fontWeight="bold"
                              textTransform="uppercase"
                            >
                              Chủ hộ:
                            </MDTypography>
                            <MDTypography variant="body2">{data.chuHoHoTen}</MDTypography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <MDTypography
                              variant="button"
                              fontWeight="bold"
                              textTransform="uppercase"
                            >
                              CCCD chủ hộ:
                            </MDTypography>
                            <MDTypography variant="body2">{data.chuHoCccd}</MDTypography>
                          </Grid>
                        </>
                      )}
                      <Grid item xs={12}>
                        <MDTypography variant="button" fontWeight="bold" textTransform="uppercase">
                          Địa chỉ cư trú:
                        </MDTypography>
                        <MDTypography variant="body2">{data.diaChiCuTru}</MDTypography>
                      </Grid>
                    </Grid>
                  </>
                )}

                {data.loaiYeuCau === "KHAI_BAO_TAM_VANG" && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <MDTypography variant="h6" fontWeight="medium" mb={2}>
                      Thông tin tạm vắng
                    </MDTypography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <MDTypography variant="button" fontWeight="bold" textTransform="uppercase">
                          Loại tạm vắng:
                        </MDTypography>
                        <MDTypography variant="body2">
                          {getLoaiTamVangLabel(data.loaiTamVang)}
                        </MDTypography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MDTypography variant="button" fontWeight="bold" textTransform="uppercase">
                          Nơi đến:
                        </MDTypography>
                        <MDTypography variant="body2">{data.noiDen}</MDTypography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MDTypography variant="button" fontWeight="bold" textTransform="uppercase">
                          Từ ngày:
                        </MDTypography>
                        <MDTypography variant="body2">
                          {formatDate(data.thoiGianBatDau)}
                        </MDTypography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MDTypography variant="button" fontWeight="bold" textTransform="uppercase">
                          Đến ngày:
                        </MDTypography>
                        <MDTypography variant="body2">
                          {formatDate(data.thoiGianKetThuc)}
                        </MDTypography>
                      </Grid>
                      <Grid item xs={12}>
                        <MDTypography variant="button" fontWeight="bold" textTransform="uppercase">
                          Lý do:
                        </MDTypography>
                        <MDTypography variant="body2">{data.lyDo}</MDTypography>
                      </Grid>
                    </Grid>
                  </>
                )}

                {/* Kết quả xử lý */}
                {(data.trangThai === "DA_PHE_DUYET" || data.trangThai === "TU_CHOI") && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <MDTypography variant="h6" fontWeight="medium" mb={2}>
                      Kết quả xử lý
                    </MDTypography>
                    <Grid container spacing={2}>
                      {data.canBoXuLy && (
                        <Grid item xs={12} md={6}>
                          <MDTypography
                            variant="button"
                            fontWeight="bold"
                            textTransform="uppercase"
                          >
                            Cán bộ xử lý:
                          </MDTypography>
                          <MDTypography variant="body2">{data.canBoXuLy.hoTen}</MDTypography>
                        </Grid>
                      )}
                      <Grid item xs={12} md={6}>
                        <MDTypography variant="button" fontWeight="bold" textTransform="uppercase">
                          Ngày cập nhật:
                        </MDTypography>
                        <MDTypography variant="body2">{formatDate(data.ngayCapNhat)}</MDTypography>
                      </Grid>
                      {data.ghiChu && (
                        <Grid item xs={12}>
                          <MDTypography
                            variant="button"
                            fontWeight="bold"
                            textTransform="uppercase"
                          >
                            Ghi chú:
                          </MDTypography>
                          <MDTypography variant="body2">{data.ghiChu}</MDTypography>
                        </Grid>
                      )}
                      {data.lyDoTuChoi && (
                        <Grid item xs={12}>
                          <MDTypography
                            variant="button"
                            fontWeight="bold"
                            textTransform="uppercase"
                            color="error"
                          >
                            Lý do từ chối:
                          </MDTypography>
                          <MDTypography variant="body2" color="error">
                            {data.lyDoTuChoi}
                          </MDTypography>
                        </Grid>
                      )}
                    </Grid>
                  </>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Nút hành động */}
                <MDBox display="flex" gap={2}>
                  <MDButton variant="gradient" color="info" onClick={() => navigate(-1)}>
                    <Icon>arrow_back</Icon>&nbsp;Quay lại
                  </MDButton>
                  {isCanBo && data.trangThai === "CHO_XU_LY" && (
                    <MDButton
                      variant="gradient"
                      color="success"
                      onClick={() => navigate(`/xu-ly-yeu-cau-cu-tru/${data.maYeuCau}`)}
                    >
                      <Icon>edit</Icon>&nbsp;Xử lý yêu cầu
                    </MDButton>
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

export default ChiTietYeuCauCuTru;
