import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// 1. Service: Gom tất cả vào 1 dòng duy nhất
import { fetchHoKhauDetail, deleteHoKhau, fetchMyHoKhau } from "services/hokhauService";

// 2. PropTypes: Chỉ để 1 dòng duy nhất
import PropTypes from "prop-types";

// 3. Material UI components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

// 4. Custom Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// 5. Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// [SỬA LỖI 2]: Tách Component hiển thị thông tin ra ngoài và khai báo PropTypes
const InfoItem = ({ label, value }) => (
  <MDBox mb={2}>
    <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
      {label}
    </MDTypography>
    <MDTypography variant="body2" fontWeight="medium" color="dark">
      {value || "---"}
    </MDTypography>
  </MDBox>
);

// Khai báo kiểu dữ liệu cho InfoItem để ESLint không báo lỗi nữa
InfoItem.propTypes = {
  label: PropTypes.string, // label có thể không bắt buộc, nhưng tốt nhất nên khai báo
  value: PropTypes.string,
};

// [SỬA]: Nhận prop isMe từ routes
function HoKhauDetail({ isMe }) {
  const { id } = useParams(); // id chỉ có khi Cán bộ xem chi tiết
  const navigate = useNavigate();

  const [hoKhau, setHoKhau] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // [LOGIC MỚI]: Nếu là isMe thì gọi fetchMyHoKhau, ngược lại gọi fetchHoKhauDetail(id)
    const fetchData = isMe ? fetchMyHoKhau() : fetchHoKhauDetail(id);

    fetchData
      .then((res) => {
        setHoKhau(res.data);
      })
      .catch((err) => {
        // Xử lý lỗi hiển thị tin nhắn từ Backend (VD: "Chưa thuộc hộ khẩu nào")
        const msg = err.response?.data || "Không thể tải thông tin hộ khẩu.";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [id, isMe]);

  const handleDelete = async () => {
    try {
      await deleteHoKhau(id);
      navigate("/ho-khau");
    } catch (e) {
      alert("Lỗi khi xóa hộ khẩu: " + e.message);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress color="info" />
        </MDBox>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3} px={3}>
          <MDTypography color="error" variant="h6">
            {error}
          </MDTypography>
          <MDButton
            variant="outlined"
            color="info"
            onClick={() => navigate("/ho-khau")}
            sx={{ mt: 2 }}
          >
            Quay lại danh sách
          </MDButton>
        </MDBox>
      </DashboardLayout>
    );
  }

  const showActions = !isMe;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
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
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDBox>
                  <MDTypography variant="h6" color="white">
                    {isMe ? "Hộ Khẩu Của Tôi" : "Chi Tiết Hộ Khẩu"}
                  </MDTypography>
                  <MDTypography variant="caption" color="white" opacity={0.8}>
                    {hoKhau ? `Mã HK: ${hoKhau.maHoKhau}` : ""}
                  </MDTypography>
                </MDBox>

                {/* Nếu là User xem của mình thì không cần nút Quay lại danh sách */}
                {!isMe && (
                  <MDButton
                    variant="outlined"
                    color="white"
                    size="small"
                    onClick={() => navigate("/ho-khau")}
                  >
                    <Icon>arrow_back</Icon>&nbsp;Quay lại
                  </MDButton>
                )}
              </MDBox>

              <MDBox p={4}>
                {/* ... (Phần hiển thị Thông tin chung & Bảng thành viên giữ nguyên) ... */}

                {/* ... COPY LẠI CODE HIỂN THỊ CŨ ... */}

                {/* [SỬA]: Chỉ hiển thị nhóm nút hành động nếu showActions = true */}
                {showActions && (
                  <MDBox mt={4} display="flex" flexWrap="wrap" gap={2} justifyContent="flex-end">
                    <MDButton
                      variant="outlined"
                      color="info"
                      onClick={() => navigate(`/ho-khau/${id || hoKhau?.maHoKhau}/nhap-ho`)}
                    >
                      <Icon>person_add</Icon>&nbsp;Nhập hộ
                    </MDButton>

                    <MDButton
                      variant="outlined"
                      color="warning"
                      onClick={() => navigate(`/ho-khau/${id || hoKhau?.maHoKhau}/tach-ho`)}
                    >
                      <Icon>person_remove</Icon>&nbsp;Tách hộ
                    </MDButton>

                    <MDButton
                      variant="outlined"
                      color="secondary"
                      onClick={() => navigate(`/ho-khau/${id || hoKhau?.maHoKhau}/doi-chu-ho`)}
                    >
                      <Icon>manage_accounts</Icon>&nbsp;Đổi chủ
                    </MDButton>

                    <MDBox flexGrow={1} />

                    <MDButton
                      variant="gradient"
                      color="dark"
                      onClick={() => navigate(`/ho-khau/${id || hoKhau?.maHoKhau}/chinh-sua`)}
                    >
                      <Icon>edit</Icon>&nbsp;Chỉnh sửa
                    </MDButton>

                    <MDButton variant="gradient" color="error" onClick={() => setOpenDelete(true)}>
                      <Icon>delete</Icon>&nbsp;Xóa Hộ
                    </MDButton>
                  </MDBox>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Dialog Xóa chỉ cần render khi showActions = true, hoặc cứ để đó cũng được vì không bao giờ setOpenDelete(true) */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        {/* ... giữ nguyên ... */}
      </Dialog>
    </DashboardLayout>
  );
}

// Khai báo propTypes
HoKhauDetail.propTypes = {
  isMe: PropTypes.bool,
};

HoKhauDetail.defaultProps = {
  isMe: false,
};

export default HoKhauDetail;
