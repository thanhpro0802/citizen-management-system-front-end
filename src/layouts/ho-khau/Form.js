import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchHoKhauDetail, createHoKhau, updateHoKhau } from "services/hokhauService";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput"; // Input đẹp của template
import MDAlert from "components/MDAlert";

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function HoKhauForm() {
  const { id } = useParams(); // id = maHoKhau
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    diaChi: "",
    maNhanKhauChuHo: "",
    ngayDangKy: new Date().toISOString().slice(0, 10),
  });

  // Lưu danh sách thành viên để hiển thị (chỉ xem)
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    fetchHoKhauDetail(id)
      .then((res) => {
        const hk = res.data;
        setForm({
          diaChi: hk.diaChi || "",
          maNhanKhauChuHo: hk.chuHo?.maNhanKhau || "", // Lấy ID chủ hộ hiện tại
          ngayDangKy: hk.ngayDangKy
            ? String(hk.ngayDangKy).slice(0, 10)
            : new Date().toISOString().slice(0, 10),
        });
        // Lưu danh sách thành viên để hiển thị bên dưới
        setMembers(hk.danhSachThanhVien || []);
      })
      .catch((err) => {
        setError("Không thể tải thông tin hộ khẩu.");
      })
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Payload gửi đi
    const reqBody = {
      diaChi: form.diaChi,
      ngayDangKy: form.ngayDangKy,
      // Nếu có nhập mã chủ hộ thì gửi object, ko thì null
      chuHo: form.maNhanKhauChuHo ? { maNhanKhau: form.maNhanKhauChuHo.trim() } : null,
    };

    try {
      if (isEdit) {
        await updateHoKhau(id, reqBody);
        alert("Cập nhật thành công!");
      } else {
        await createHoKhau(reqBody);
        alert("Tạo mới thành công!");
      }
      navigate("/ho-khau");
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra. Vui lòng kiểm tra mã chủ hộ (UUID) có tồn tại không.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
            <Card>
              {/* Header Gradient Xanh */}
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
                alignItems="center"
                justifyContent="space-between"
              >
                <MDTypography variant="h6" color="white">
                  {isEdit ? "Cập Nhật Hộ Khẩu" : "Thêm Mới Hộ Khẩu"}
                </MDTypography>
                {/* Nút quay lại */}
                <MDButton
                  variant="outlined"
                  color="white"
                  size="small"
                  onClick={() => navigate(-1)}
                >
                  Quay lại
                </MDButton>
              </MDBox>

              <MDBox pt={4} pb={3} px={3}>
                {error && (
                  <MDBox mb={2}>
                    <MDAlert color="error" dismissible onClose={() => setError("")}>
                      {error}
                    </MDAlert>
                  </MDBox>
                )}

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Hàng 1: Địa chỉ (Full width) */}
                    <Grid item xs={12}>
                      <MDInput
                        label="Địa chỉ thường trú"
                        name="diaChi"
                        value={form.diaChi}
                        onChange={handleChange}
                        fullWidth
                        required
                        variant="outlined"
                      />
                    </Grid>

                    {/* Hàng 2: Mã Chủ hộ & Ngày đăng ký */}
                    <Grid item xs={12} md={8}>
                      <MDInput
                        label="Mã nhân khẩu chủ hộ (UUID)"
                        name="maNhanKhauChuHo"
                        value={form.maNhanKhauChuHo}
                        onChange={handleChange}
                        fullWidth
                        placeholder="Nhập UUID của nhân khẩu làm chủ hộ..."
                        helperText={
                          isEdit
                            ? "Để trống nếu không muốn đổi chủ hộ tại đây"
                            : "Bắt buộc khi tạo mới"
                        }
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <MDInput
                        label="Ngày đăng ký"
                        name="ngayDangKy"
                        type="date"
                        value={form.ngayDangKy}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>

                  {/* Phần hiển thị danh sách thành viên (Chỉ hiện khi Edit) */}
                  {isEdit && (
                    <MDBox mt={4}>
                      <Divider />
                      <MDBox
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <MDTypography variant="h6" color="dark">
                          Thành viên hiện tại ({members.length})
                        </MDTypography>
                        <MDButton
                          size="small"
                          color="info"
                          variant="text"
                          onClick={() => navigate(`/ho-khau/${id}/nhap-ho`)}
                        >
                          <Icon>person_add</Icon>&nbsp;Thêm thành viên
                        </MDButton>
                      </MDBox>

                      <TableContainer sx={{ border: "1px solid #f0f2f5", borderRadius: "8px" }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Họ tên</TableCell>
                              <TableCell>Quan hệ với chủ hộ</TableCell>
                              <TableCell>CCCD</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {members.length > 0 ? (
                              members.map((mem) => (
                                <TableRow key={mem.maNhanKhau}>
                                  <TableCell>
                                    <MDTypography variant="button" fontWeight="medium">
                                      {mem.hoTen}
                                    </MDTypography>
                                  </TableCell>
                                  <TableCell>
                                    <MDTypography variant="caption" color="text">
                                      {mem.quanHeVoiChuHo || "Chưa cập nhật"}
                                    </MDTypography>
                                  </TableCell>
                                  <TableCell>
                                    <MDTypography variant="caption" color="text">
                                      {mem.soCCCD || mem.soCccd || "-"}
                                    </MDTypography>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={3} align="center">
                                  <MDTypography variant="caption">
                                    Chưa có thành viên nào
                                  </MDTypography>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <MDTypography variant="caption" color="text" sx={{ mt: 1, display: "block" }}>
                        * Để xóa hoặc tách thành viên, vui lòng sử dụng chức năng <b>Tách hộ</b> ở
                        trang danh sách.
                      </MDTypography>
                    </MDBox>
                  )}

                  {/* Nút hành động */}
                  <MDBox mt={4} display="flex" justifyContent="flex-end">
                    <MDButton
                      variant="gradient"
                      color="dark"
                      onClick={() => navigate(-1)}
                      sx={{ mr: 2 }}
                    >
                      Hủy bỏ
                    </MDButton>
                    <MDButton type="submit" variant="gradient" color="info" disabled={loading}>
                      {loading ? "Đang xử lý..." : isEdit ? "Lưu Thay Đổi" : "Tạo Mới"}
                    </MDButton>
                  </MDBox>
                </form>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default HoKhauForm;
