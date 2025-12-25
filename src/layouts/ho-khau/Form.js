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
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"; // Icon thùng rác

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDAlert from "components/MDAlert";

// Layout
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

  const [initialOwner, setInitialOwner] = useState(null); // Lưu thông tin chủ hộ gốc
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

        // Lọc chủ hộ ra khỏi danh sách thành viên ban đầu để tránh lặp
        const rawMembers = hk.danhSachThanhVien || [];
        const filteredMembers = rawMembers.filter((m) => m.soCCCD !== currentOwner?.soCCCD);
        setMembers(filteredMembers);
      })
      .catch((err) => setError("Không thể tải thông tin hộ khẩu."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  // --- LOGIC HOÁN ĐỔI CHỦ HỘ ---
  const handleOwnerCCCDChange = (e) => {
    const newCCCD = e.target.value;
    setForm((prev) => ({ ...prev, cccdChuHo: newCCCD }));

    // 1. Kiểm tra xem CCCD mới có thuộc về một thành viên đang trong danh sách không
    const memberToPromoteIndex = members.findIndex((m) => m.soCCCD === newCCCD);

    if (memberToPromoteIndex !== -1) {
      // TÌM THẤY: Người này đang là thành viên -> Đẩy lên làm chủ hộ
      const newMembers = [...members];
      const memberPromoted = newMembers[memberToPromoteIndex];

      // Xóa người này khỏi danh sách thành viên
      newMembers.splice(memberToPromoteIndex, 1);

      // Đẩy chủ hộ CŨ xuống làm thành viên (nếu chưa có trong list)
      // Chỉ đẩy xuống nếu chủ hộ cũ tồn tại và khác chủ hộ mới
      if (initialOwner && initialOwner.soCCCD !== newCCCD) {
        // Kiểm tra xem chủ hộ cũ đã có trong list chưa (tránh add nhiều lần)
        const oldOwnerExists = newMembers.find((m) => m.soCCCD === initialOwner.soCCCD);
        if (!oldOwnerExists) {
          newMembers.unshift({
            ...initialOwner,
            quanHeVoiChuHo: "", // Reset quan hệ để bắt buộc nhập
            isOldOwner: true, // Đánh dấu để highlight
          });
        }
      }
      setMembers(newMembers);
    }
    // 2. Nếu người dùng xóa CCCD hoặc nhập CCCD người lạ -> Nếu CCCD TRÙNG chủ hộ GỐC
    else if (initialOwner && newCCCD === initialOwner.soCCCD) {
      // Khôi phục: Xóa chủ hộ gốc khỏi danh sách thành viên (vì họ đã quay lại làm chủ)
      const newMembers = members.filter((m) => m.soCCCD !== initialOwner.soCCCD);
      // (Lưu ý: Nếu trước đó đã promote ai đó, người đó sẽ bị mất khỏi list.
      // Logic đơn giản nhất ở đây là chỉ xóa oldOwner khỏi list thôi)
      setMembers(newMembers);
    }
  };

  const handleMemberRelationChange = (index, newValue) => {
    const newMembers = [...members];
    newMembers[index].quanHeVoiChuHo = newValue;
    setMembers(newMembers);
  };

  // Hàm xóa thành viên khỏi danh sách (Dùng cho cả việc xóa chủ hộ cũ)
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

    // Validate: Nếu có người là OldOwner trong list mà chưa nhập quan hệ
    const missingRelation = members.find((m) => m.isOldOwner && !m.quanHeVoiChuHo);
    if (missingRelation) {
      setError(`Vui lòng nhập quan hệ mới cho chủ hộ cũ (${missingRelation.hoTen}).`);
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
      navigate(`/ho-khau/${id}`); // Quay về trang chi tiết
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra. Vui lòng kiểm tra CCCD chủ hộ có tồn tại không.");
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
                    <Grid item xs={12}>
                      <MDInput
                        label="Địa chỉ thường trú"
                        name="diaChi"
                        value={form.diaChi}
                        onChange={(e) => setForm({ ...form, diaChi: e.target.value })}
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <MDInput
                        label="Số CCCD Chủ hộ"
                        name="cccdChuHo"
                        value={form.cccdChuHo}
                        onChange={handleOwnerCCCDChange} // Dùng hàm xử lý riêng
                        fullWidth
                        required
                        placeholder="Nhập CCCD..."
                        helperText={
                          isEdit ? "Nhập CCCD của thành viên để đưa họ lên làm chủ hộ." : ""
                        }
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <MDInput
                        label="Ngày đăng ký"
                        name="ngayDangKy"
                        type="date"
                        value={form.ngayDangKy}
                        onChange={(e) => setForm({ ...form, ngayDangKy: e.target.value })}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
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
                        mb={1}
                      >
                        <MDTypography variant="h6" color="dark">
                          Thành viên ({members.length})
                        </MDTypography>
                        <MDButton
                          size="small"
                          color="info"
                          variant="text"
                          onClick={() => navigate(`/ho-khau/${id}/nhap-ho`)}
                        >
                          <Icon>person_add</Icon>&nbsp;Thêm người
                        </MDButton>
                      </MDBox>

                      <TableContainer sx={{ border: "1px solid #f0f2f5", borderRadius: "8px" }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Họ tên</TableCell>
                              <TableCell width="40%">Quan hệ với chủ hộ</TableCell>
                              <TableCell align="center">CCCD</TableCell>
                              <TableCell align="center">Xóa</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {members.length > 0 ? (
                              members.map((mem, index) => {
                                // Highlight nếu là chủ hộ cũ bị đẩy xuống
                                const needsUpdate = mem.isOldOwner;
                                return (
                                  <TableRow
                                    key={mem.maNhanKhau}
                                    sx={needsUpdate ? { backgroundColor: "#fff3cd" } : {}}
                                  >
                                    <TableCell>
                                      <MDTypography variant="button" fontWeight="medium">
                                        {mem.hoTen}
                                      </MDTypography>
                                      {needsUpdate && (
                                        <MDTypography
                                          variant="caption"
                                          display="block"
                                          color="error"
                                          fontWeight="bold"
                                        >
                                          (Chủ hộ cũ - Cần cập nhật)
                                        </MDTypography>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <MDInput
                                        value={mem.quanHeVoiChuHo || ""}
                                        onChange={(e) =>
                                          handleMemberRelationChange(index, e.target.value)
                                        }
                                        placeholder={
                                          needsUpdate
                                            ? "NHẬP QUAN HỆ MỚI (VD: Bố, Mẹ)"
                                            : "VD: Con, Vợ..."
                                        }
                                        fullWidth
                                        size="small"
                                        error={needsUpdate && !mem.quanHeVoiChuHo}
                                        autoFocus={needsUpdate}
                                      />
                                    </TableCell>
                                    <TableCell align="center">
                                      <MDTypography variant="caption" color="text">
                                        {mem.soCCCD || mem.soCccd || "-"}
                                      </MDTypography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Tooltip title="Xóa người này khỏi hộ">
                                        <IconButton
                                          color="error"
                                          onClick={() => handleDeleteMember(index)}
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                      </Tooltip>
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} align="center">
                                  Chưa có thành viên phụ.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </MDBox>
                  )}

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
