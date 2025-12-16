/**
 * Component hiển thị danh sách nhân khẩu với tính năng tìm kiếm, phân trang, thêm/sửa/xóa
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// @mui material components
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import DataTable from 'examples/Tables/DataTable';

// Service
import nhanKhauService from 'services/nhanKhauService';

function NhanKhauList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Tìm kiếm
  const [searchCriteria, setSearchCriteria] = useState({
    q: '',
    gioiTinh: '',
    status: '',
    maHoKhau: '',
  });
  const [searchTrigger, setSearchTrigger] = useState(0); // Trigger để reload data

  // Delete dialog
  const [deleteDialog, setDeleteDialog] = useState({ open: false, maNhanKhau: null, hoTen: '' });

  // Load data
  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Search criteria:', searchCriteria);
      const result = await nhanKhauService.searchNhanKhau(searchCriteria, page, size);
      console.log('Search result:', result);
      setData(result.content || []);
      setTotalPages(result.totalPages || 0);
      setTotalElements(result.totalElements || 0);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      // Chỉ hiện lỗi nếu là lỗi server, không phải không tìm thấy kết quả
      setData([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, size, searchTrigger]);

  // Xử lý tìm kiếm
  const handleSearch = () => {
    setPage(0);
    setSearchTrigger((prev) => prev + 1); // Trigger reload
  };

  // Xử lý xóa
  const handleDelete = async () => {
    try {
      await nhanKhauService.deleteNhanKhau(deleteDialog.maNhanKhau);
      setDeleteDialog({ open: false, maNhanKhau: null, hoTen: '' });
      loadData();
      alert('Xóa nhân khẩu thành công');
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      alert('Không thể xóa nhân khẩu: ' + error.message);
    }
  };

  // Format ngày sinh
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  // Hiển thị trạng thái
  const renderStatus = (status) => {
    const statusColors = {
      THUONG_TRU: 'success',
      TAM_TRU: 'info',
      TAM_VANG: 'warning',
      KHAI_TU: 'error',
      UNKNOWN: 'default',
    };

    const statusLabels = {
      THUONG_TRU: 'Thường trú',
      TAM_TRU: 'Tạm trú',
      TAM_VANG: 'Tạm vắng',
      KHAI_TU: 'Đã mất',
      UNKNOWN: 'Chưa xác định',
    };

    return (
      <Chip
        label={statusLabels[status] || status}
        color={statusColors[status] || 'default'}
        size="small"
      />
    );
  };

  // Cấu hình bảng
  const columns = [
    { Header: 'Mã nhân khẩu', accessor: 'maNhanKhau', width: '15%' },
    { Header: 'Họ tên', accessor: 'hoTen', width: '20%' },
    { Header: 'Ngày sinh', accessor: 'ngaySinh', width: '12%' },
    { Header: 'Giới tính', accessor: 'gioiTinh', width: '10%' },
    { Header: 'Số CCCD', accessor: 'soCCCD', width: '15%' },
    { Header: 'Trạng thái', accessor: 'trangThai', width: '13%' },
    { Header: 'Thao tác', accessor: 'actions', width: '15%' },
  ];

  const rows = data.map((item) => ({
    maNhanKhau: item.maNhanKhau,
    hoTen: item.hoTen,
    ngaySinh: formatDate(item.ngaySinh),
    gioiTinh: item.gioiTinh,
    soCCCD: item.soCCCD || 'N/A',
    trangThai: renderStatus(item.trangThai),
    actions: (
      <MDBox display="flex" gap={1}>
        <MDButton
          variant="text"
          color="info"
          size="small"
          onClick={() => navigate(`/nhan-khau/${item.maNhanKhau}`)}
        >
          <Icon>visibility</Icon>
        </MDButton>
        <MDButton
          variant="text"
          color="dark"
          size="small"
          onClick={() => navigate(`/nhan-khau/edit/${item.maNhanKhau}`)}
        >
          <Icon>edit</Icon>
        </MDButton>
        <MDButton
          variant="text"
          color="error"
          size="small"
          onClick={() =>
            setDeleteDialog({ open: true, maNhanKhau: item.maNhanKhau, hoTen: item.hoTen })
          }
        >
          <Icon>delete</Icon>
        </MDButton>
      </MDBox>
    ),
  }));

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
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Danh sách nhân khẩu
                </MDTypography>
                <MDButton
                  variant="contained"
                  color="white"
                  size="small"
                  onClick={() => navigate('/nhan-khau/create')}
                >
                  <Icon>add</Icon>&nbsp; Thêm mới
                </MDButton>
              </MDBox>

              {/* Bộ lọc tìm kiếm */}
              <MDBox p={3}>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={3}>
                    <MDInput
                      label="Tìm kiếm (Họ tên, CCCD)"
                      fullWidth
                      value={searchCriteria.q}
                      onChange={(e) => setSearchCriteria({ ...searchCriteria, q: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      select
                      label="Giới tính"
                      fullWidth
                      value={searchCriteria.gioiTinh}
                      onChange={(e) =>
                        setSearchCriteria({ ...searchCriteria, gioiTinh: e.target.value })
                      }
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="">Tất cả</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      select
                      label="Trạng thái"
                      fullWidth
                      value={searchCriteria.status}
                      onChange={(e) =>
                        setSearchCriteria({ ...searchCriteria, status: e.target.value })
                      }
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="">Tất cả</option>
                      <option value="THUONG_TRU">Thường trú</option>
                      <option value="TAM_TRU">Tạm trú</option>
                      <option value="TAM_VANG">Tạm vắng</option>
                      <option value="KHAI_TU">Đã mất</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <MDInput
                      label="Mã hộ khẩu"
                      fullWidth
                      value={searchCriteria.maHoKhau}
                      onChange={(e) =>
                        setSearchCriteria({ ...searchCriteria, maHoKhau: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <MDButton variant="gradient" color="info" fullWidth onClick={handleSearch}>
                      <Icon>search</Icon>&nbsp; Tìm kiếm
                    </MDButton>
                  </Grid>
                </Grid>

                {/* Bảng dữ liệu */}
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />

                {/* Phân trang */}
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                  <MDTypography variant="caption" color="text">
                    Hiển thị {data.length} / {totalElements} bản ghi
                  </MDTypography>
                  <MDBox display="flex" gap={1}>
                    <MDButton
                      variant="outlined"
                      color="info"
                      size="small"
                      disabled={page === 0}
                      onClick={() => setPage(page - 1)}
                    >
                      Trang trước
                    </MDButton>
                    <MDTypography variant="button" color="text" px={2} pt={1}>
                      Trang {page + 1} / {totalPages || 1}
                    </MDTypography>
                    <MDButton
                      variant="outlined"
                      color="info"
                      size="small"
                      disabled={page >= totalPages - 1}
                      onClick={() => setPage(page + 1)}
                    >
                      Trang sau
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, maNhanKhau: null, hoTen: '' })}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa nhân khẩu <strong>{deleteDialog.hoTen}</strong>?
            <br />
            Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton
            onClick={() => setDeleteDialog({ open: false, maNhanKhau: null, hoTen: '' })}
            color="dark"
          >
            Hủy
          </MDButton>
          <MDButton onClick={handleDelete} color="error" autoFocus>
            Xóa
          </MDButton>
        </DialogActions>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}

export default NhanKhauList;
