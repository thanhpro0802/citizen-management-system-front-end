import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchHoKhauDetail, createHoKhau, updateHoKhau } from "services/hokhauService";

// @mui components
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
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDAlert from "components/MDAlert";

// Layouts
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function HoKhauForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    diaChi: "",
    cccdChuHo: "",
    ngayDangKy: new Date().toISOString().slice(0, 10),
  });

  const [initialOwner, setInitialOwner] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    fetchHoKhauDetail(id)
      .then((res) => {
        const hk = res.data;
        const currentOwner = hk.chuHo;

        setForm({
          diaChi: hk.diaChi || "",
          cccdChuHo: currentOwner?.soCCCD || "",
          ngayDangKy: hk.ngayDangKy ? String(hk.ngayDangKy).slice(0, 10) : "",
        });
        setInitialOwner(currentOwner);

        const rawMembers = hk.danhSachThanhVien || [];
        const filteredMembers = rawMembers.filter((m) => m.maNhanKhau !== currentOwner?.maNhanKhau);
        setMembers(filteredMembers);
      })
      .catch(() => setError("Không thể tải thông tin hộ khẩu."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleOwnerCCCDChange = (e) => {
    const newCCCD = e.target.value;
    setForm((prev) => ({ ...prev, cccdChuHo: newCCCD }));

    let newMembers = [...members];
    if (initialOwner && newCCCD === initialOwner.soCCCD) {
      newMembers = newMembers.filter((m) => m.soCCCD !== initialOwner.soCCCD);
    } else {
      if (initialOwner) {
        const oldOwnerExists = newMembers.find((m) => m.soCCCD === initialOwner.soCCCD);
        if (!oldOwnerExists) {
          newMembers.unshift({
            ...initialOwner,
            quanHeVoiChuHo: "",
            isOldOwner: true,
          });
        }
      }
      const memberIndex = newMembers.findIndex((m) => m.soCCCD === newCCCD);
      if (memberIndex !== -1) {
        newMembers.splice(memberIndex, 1);
      }
    }
    setMembers(newMembers);
  };

  const handleMemberRelationChange = (index, newValue) => {
    const newMembers = [...members];
    newMembers[index].quanHeVoiChuHo = newValue;
    setMembers(newMembers);
  };

  const handleDeleteMember = (index) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người này khỏi hộ khẩu?")) {
      const newMembers = [...members];
      newMembers.splice(index, 1);
      setMembers(newMembers);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const missingRelation = members.find((m) => m.isOldOwner && !m.quanHeVoiChuHo);
    if (missingRelation) {
      setError(`Vui lòng nhập quan hệ mới cho chủ hộ cũ (${missingRelation.hoTen}).`);
      setLoading(false);
      return;
    }
    const conflict = members.find((m) => m.quanHeVoiChuHo?.trim().toLowerCase() === "chủ hộ");
    if (conflict) {
      setError(`Thành viên ${conflict.hoTen} không thể có quan hệ là 'Chủ hộ'.`);
      setLoading(false);
      return;
    }

    const reqBody = {
      diaChi: form.diaChi,
      ngayDangKy: form.ngayDangKy,
      chuHo: form.cccdChuHo ? { soCCCD: form.cccdChuHo.trim() } : null,
      danhSachThanhVien: members.map((m) => ({
        maNhanKhau: m.maNhanKhau,
        quanHeVoiChuHo: m.quanHeVoiChuHo,
      })),
    };

    try {
      if (isEdit) {
        await updateHoKhau(id, reqBody);
        alert("Cập nhật thành công!");
      } else {
        await createHoKhau(reqBody);
        alert("Tạo mới thành công!");
      }
      navigate(`/ho-khau/${id}`);
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra. Kiểm tra CCCD chủ hộ có tồn tại không.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} lg={10}>
            <Card>
              {/* Header Gradient */}
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
                  {isEdit ? "CẬP NHẬT HỘ KHẨU" : "THÊM MỚI HỘ KHẨU"}
                </MDTypography>
                <MDButton
                  variant="outlined"
                  color="white"
                  size="small"
                  onClick={() => navigate(-1)}
                  startIcon={<Icon>arrow_back</Icon>}
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
                  <MDBox mb={2}>
                    <MDTypography
                      variant="button"
                      fontWeight="bold"
                      color="text"
                      textTransform="uppercase"
                    >
                      I. Thông tin chung
                    </MDTypography>
                  </MDBox>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <MDInput
                        label="Địa chỉ thường trú"
                        value={form.diaChi}
                        onChange={(e) => setForm({ ...form, diaChi: e.target.value })}
                        fullWidth
                        required
                        variant="standard"
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <MDInput
                        label="Ngày đăng ký"
                        type="date"
                        value={form.ngayDangKy}
                        onChange={(e) => setForm({ ...form, ngayDangKy: e.target.value })}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        variant="standard"
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <MDInput
                        label="CCCD Chủ Hộ"
                        value={form.cccdChuHo}
                        onChange={handleOwnerCCCDChange}
                        fullWidth
                        required
                        placeholder="Nhập số CCCD..."
                        variant="standard"
                        helperText={isEdit ? "Đổi CCCD sẽ đổi chủ hộ." : ""}
                      />
                    </Grid>
                  </Grid>

                  {isEdit && (
                    <MDBox mt={4}>
                      <Divider />
                      <MDBox
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                      >
                        <MDTypography
                          variant="button"
                          fontWeight="bold"
                          color="text"
                          textTransform="uppercase"
                        >
                          II. Danh sách thành viên ({members.length})
                        </MDTypography>
                        <MDButton
                          size="small"
                          color="info"
                          variant="text"
                          onClick={() => navigate(`/ho-khau/${id}/nhap-ho`)}
                        >
                          <Icon>person_add</Icon>&nbsp;Thêm nhanh
                        </MDButton>
                      </MDBox>

                      <TableContainer sx={{ border: "1px solid #dee2e6", borderRadius: "8px" }}>
                        <Table>
                          <TableHead sx={{ display: "table-header-group", bgcolor: "#f8f9fa" }}>
                            <TableRow>
                              <TableCell width="30%">
                                <MDTypography variant="caption" fontWeight="bold" color="secondary">
                                  HỌ TÊN
                                </MDTypography>
                              </TableCell>
                              <TableCell width="40%">
                                <MDTypography variant="caption" fontWeight="bold" color="secondary">
                                  QUAN HỆ VỚI CHỦ HỘ
                                </MDTypography>
                              </TableCell>
                              <TableCell align="center">
                                <MDTypography variant="caption" fontWeight="bold" color="secondary">
                                  CCCD
                                </MDTypography>
                              </TableCell>
                              <TableCell align="center">
                                <MDTypography variant="caption" fontWeight="bold" color="secondary">
                                  XÓA
                                </MDTypography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {members.length > 0 ? (
                              members.map((mem, index) => {
                                const needsUpdate = mem.isOldOwner;
                                return (
                                  <TableRow
                                    key={mem.maNhanKhau}
                                    sx={needsUpdate ? { backgroundColor: "#fffbf2" } : {}}
                                  >
                                    <TableCell>
                                      <MDTypography
                                        variant="button"
                                        fontWeight="medium"
                                        color="dark"
                                      >
                                        {mem.hoTen}
                                      </MDTypography>
                                      {needsUpdate && (
                                        <MDTypography
                                          variant="caption"
                                          display="block"
                                          color="error"
                                          fontWeight="bold"
                                        >
                                          (Chủ hộ cũ - Cần cập nhật quan hệ)
                                        </MDTypography>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <MDInput
                                        value={mem.quanHeVoiChuHo || ""}
                                        onChange={(e) =>
                                          handleMemberRelationChange(index, e.target.value)
                                        }
                                        placeholder="Nhập quan hệ (Vợ, Con...)"
                                        fullWidth
                                        size="small"
                                        error={needsUpdate && !mem.quanHeVoiChuHo}
                                      />
                                    </TableCell>
                                    <TableCell align="center">
                                      <MDTypography variant="caption" color="text">
                                        {mem.soCCCD || mem.soCccd || "-"}
                                      </MDTypography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Tooltip title="Loại khỏi hộ">
                                        <IconButton
                                          color="error"
                                          size="small"
                                          onClick={() => handleDeleteMember(index)}
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} align="center">
                                  <MDTypography variant="caption" color="text">
                                    Chưa có thành viên phụ.
                                  </MDTypography>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </MDBox>
                  )}

                  <MDBox mt={4} display="flex" justifyContent="flex-end" gap={2}>
                    <MDButton variant="outlined" color="secondary" onClick={() => navigate(-1)}>
                      Hủy bỏ
                    </MDButton>
                    <MDButton type="submit" variant="gradient" color="info" disabled={loading}>
                      {loading ? "Đang lưu..." : isEdit ? "Lưu Thay Đổi" : "Tạo Mới"}
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
