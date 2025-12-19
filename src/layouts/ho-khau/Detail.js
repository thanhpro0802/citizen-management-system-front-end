import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchHoKhauDetail, deleteHoKhau } from "services/hokhauService";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import {
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";

function HoKhauDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hoKhau, setHoKhau] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    fetchHoKhauDetail(id)
      .then((res) => {
        setHoKhau(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Không thể tải thông tin hộ khẩu");
        setLoading(false);
      });
  }, [id]);

  const handleDelete = () => {
    deleteHoKhau(id)
      .then(() => {
        alert("Xóa hộ khẩu thành công!");
        navigate("/ho-khau");
      })
      .catch(() => alert("Lỗi khi xóa hộ khẩu"));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </MDBox>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Alert severity="error">{error}</Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <MDBox pt={6} pb={3}>
        <Paper style={{ padding: 24 }}>
          <Typography variant="h5">Thông tin Hộ khẩu</Typography>
          <Typography>Mã hộ khẩu: {hoKhau.maHoKhau}</Typography>
          <Typography>Chủ hộ: {hoKhau.chuHo?.hoTen}</Typography>
          <Typography>Địa chỉ: {hoKhau.diaChi}</Typography>

          <Typography variant="h6" style={{ marginTop: 16 }}>
            Thành viên:
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>CCCD</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>Quan hệ với chủ hộ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(hoKhau.danhSachThanhVien || []).map((nk) => (
                <TableRow key={nk.maNhanKhau || nk.id}>
                  <TableCell>{nk.soCccd || nk.cccd}</TableCell>
                  <TableCell>{nk.hoTen}</TableCell>
                  <TableCell>{nk.quanHeVoiChuHo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <MDBox mt={3} display="flex" gap={1}>
            <Button variant="contained" onClick={() => navigate("/ho-khau")}>
              Quay lại
            </Button>
            <Button variant="contained" onClick={() => navigate(`/ho-khau/${id}/chinh-sua`)}>
              Chỉnh sửa
            </Button>
            <Button variant="outlined" onClick={() => navigate(`/ho-khau/${id}/tach-ho`)}>
              Tách hộ
            </Button>
            <Button variant="outlined" onClick={() => navigate(`/ho-khau/${id}/nhap-ho`)}>
              Nhập hộ
            </Button>
            <Button variant="outlined" onClick={() => navigate(`/ho-khau/${id}/thay-doi-chu-ho`)}>
              Đổi chủ hộ
            </Button>
            <Button variant="contained" color="error" onClick={() => setOpenDelete(true)}>
              Xóa
            </Button>
          </MDBox>
        </Paper>
      </MDBox>

      {/* Dialog xác nhận xóa */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa hộ khẩu này? </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Hủy</Button>
          <Button color="error" onClick={handleDelete}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default HoKhauDetail;
