import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Snackbar,
  Alert,
  Breadcrumbs,
  Skeleton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { fetchHoKhauList, deleteHoKhau } from "services/hokhauService";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";

function HoKhauList() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [delDialog, setDelDialog] = useState({ open: false, id: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });

  useEffect(() => {
    setLoading(true);
    fetchHoKhauList({ page: page + 1, size: rowsPerPage, keyword: search })
      .then((res) => {
        setList(res.data.data || res.data);
        setTotal(res.data.total || res.data.length);
        setLoading(false);
      })
      .catch(() => {
        setList([]);
        setLoading(false);
        setSnackbar({ open: true, message: "Không thể tải danh sách", type: "error" });
      });
  }, [page, rowsPerPage, search]);
  // Trong trường hợp API trả {data, total}, còn nếu trả về array thì cập nhật component cho phù hợp

  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };
  const handleKeywordChange = (e) => setKeyword(e.target.value);
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(keyword);
    setPage(0);
  };

  const handleDelete = () => {
    setLoading(true);
    deleteHoKhau(delDialog.id)
      .then(() => {
        setSnackbar({ open: true, message: "Đã xóa hộ khẩu", type: "success" });
        setDelDialog({ open: false, id: null });
        setList((prev) => prev.filter((hk) => hk.id !== delDialog.id));
        setLoading(false);
      })
      .catch(() => {
        setSnackbar({ open: true, message: "Xóa thất bại", type: "error" });
        setLoading(false);
      });
  };

  return (
    <DashboardLayout>
      <MDBox pb={2}>
        {/* Breadcrumb */}
        <Breadcrumbs sx={{ mb: 2 }}>
          <Typography color="text.primary">Trang chủ</Typography>
          <Typography color="text.primary">Hộ Khẩu</Typography>
        </Breadcrumbs>

        <Paper sx={{ p: 3 }}>
          <MDBox display="flex" alignItems="center" justifyContent="space-between" pb={2}>
            <Typography variant="h4">Danh sách Hộ khẩu</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/ho-khau/tao-moi")}
            >
              Thêm mới
            </Button>
          </MDBox>
          <form onSubmit={handleSearch}>
            <MDBox display="flex" alignItems="center" mb={2} gap={1}>
              <TextField
                label="Tìm kiếm theo mã hộ khẩu hoặc tên chủ hộ"
                value={keyword}
                onChange={handleKeywordChange}
                size="small"
                sx={{ width: 300 }}
              />
              <Button type="submit" variant="contained">
                Tìm kiếm
              </Button>
            </MDBox>
          </form>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Mã hộ khẩu</TableCell>
                  <TableCell>Chủ hộ</TableCell>
                  <TableCell>Địa chỉ</TableCell>
                  <TableCell>Thành viên</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: rowsPerPage }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell colSpan={5}>
                        <Skeleton height={30} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : list.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>Không có dữ liệu</TableCell>
                  </TableRow>
                ) : (
                  list.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.maHoKhau}</TableCell>
                      <TableCell>{row.chuHo?.hoTen}</TableCell>
                      <TableCell>{row.diaChi}</TableCell>
                      <TableCell>{row.nhanKhau?.length || 0}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => navigate(`/ho-khau/${row.id}`)}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => navigate(`/ho-khau/${row.id}/chinh-sua`)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          title="Tách hộ"
                          onClick={() => navigate(`/ho-khau/${row.id}/tach-ho`)}
                        >
                          <PersonRemoveIcon />
                        </IconButton>
                        <IconButton
                          title="Nhập hộ"
                          onClick={() => navigate(`/ho-khau/${row.id}/nhap-ho`)}
                        >
                          <PersonAddAlt1Icon />
                        </IconButton>
                        <IconButton
                          title="Đổi chủ hộ"
                          onClick={() => navigate(`/ho-khau/${row.id}/thay-doi-chu-ho`)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => setDelDialog({ open: true, id: row.id })}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </Paper>
      </MDBox>

      {/* Dialog xác nhận xóa */}
      <Dialog open={delDialog.open} onClose={() => setDelDialog({ open: false, id: null })}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDelDialog({ open: false, id: null })}>Hủy</Button>
          <Button color="error" onClick={handleDelete}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.type} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default HoKhauList;
