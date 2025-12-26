/**
 * Component hiển thị chi tiết thông tin nhân khẩu
 * Bao gồm thông tin cá nhân, lịch sử tạm trú/tạm vắng và các thao tác đặc biệt
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';

// Service
import nhanKhauService from 'services/nhanKhauService';

function NhanKhauDetail() {
const navigate = useNavigate();
const { id } = useParams();
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

// Dialog states
const [tamTruDialog, setTamTruDialog] = useState(false);
const [tamVangDialog, setTamVangDialog] = useState(false);
const [khaiTuDialog, setKhaiTuDialog] = useState(false);

// Form data cho tạm trú/tạm vắng
const [tamTruForm, setTamTruForm] = useState({
    ngayBatDau: '',
    ngayKetThuc: '',
    lyDo: '',
});

const [tamVangForm, setTamVangForm] = useState({
    ngayBatDau: '',
    ngayKetThuc: '',
    lyDo: '',
});

useEffect(() => {
    loadData();
}, [id]);

const loadData = async () => {
    try {
    setLoading(true);
    const result = await nhanKhauService.getNhanKhauById(id);
    setData(result);
    } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error);
    alert('Không thể tải thông tin nhân khẩu');
    navigate('/nhan-khau');
    } finally {
    setLoading(false);
    }
};

const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('vi-VN');
};

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
        size="medium"
    />
    );
};

// Xử lý đăng ký tạm trú
const handleTamTru = async () => {
    try {
    await nhanKhauService.registerTamTru({
        maNhanKhau: id,
        ...tamTruForm,
        ngayBatDau: new Date(tamTruForm.ngayBatDau).toISOString(),
        ngayKetThuc: tamTruForm.ngayKetThuc ? new Date(tamTruForm.ngayKetThuc).toISOString() : null,
    });
    alert('Đăng ký tạm trú thành công');
    setTamTruDialog(false);
    setTamTruForm({ ngayBatDau: '', ngayKetThuc: '', lyDo: '' });
    // Small delay to ensure database commit
    await new Promise((resolve) => setTimeout(resolve, 300));
    loadData();
    } catch (error) {
    console.error('Lỗi:', error);
    alert('Lỗi: ' + error.message);
    }
};

// Xử lý đăng ký tạm vắng
const handleTamVang = async () => {
    try {
    await nhanKhauService.registerTamVang({
        maNhanKhau: id,
        ...tamVangForm,
        ngayBatDau: new Date(tamVangForm.ngayBatDau).toISOString(),
        ngayKetThuc: tamVangForm.ngayKetThuc
        ? new Date(tamVangForm.ngayKetThuc).toISOString()
        : null,
    });
    alert('Đăng ký tạm vắng thành công');
    setTamVangDialog(false);
    setTamVangForm({ ngayBatDau: '', ngayKetThuc: '', lyDo: '' });
    // Small delay to ensure database commit
    await new Promise((resolve) => setTimeout(resolve, 300));
    loadData();
    } catch (error) {
    console.error('Lỗi:', error);
    alert('Lỗi: ' + error.message);
    }
};

// Xử lý khai tử
const handleKhaiTu = async () => {
    try {
    await nhanKhauService.declareDeath(id);
    alert('Khai tử thành công');
    setKhaiTuDialog(false);
    loadData();
    } catch (error) {
    console.error('Lỗi:', error);
    alert('Lỗi: ' + error.message);
    }
};

if (loading || !data) {
    return (
    <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3}>
        <MDTypography variant="h6">Đang tải...</MDTypography>
        </MDBox>
    </DashboardLayout>
    );
}

return (
    <DashboardLayout>
    <DashboardNavbar />
    <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
        {/* Thông tin cơ bản */}
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
                Chi tiết nhân khẩu
                </MDTypography>
                <MDBox display="flex" gap={1}>
                <MDButton
                    variant="contained"
                    color="white"
                    size="small"
                    onClick={() => navigate(`/nhan-khau/edit/${id}`)}
                >
                    <Icon>edit</Icon>&nbsp; Chỉnh sửa
                </MDButton>
                <MDButton
                    variant="contained"
                    color="white"
                    size="small"
                    onClick={() => navigate('/nhan-khau')}
                >
                    <Icon>arrow_back</Icon>&nbsp; Quay lại
                </MDButton>
                </MDBox>
            </MDBox>

            <MDBox p={3}>
                <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <MDBox mb={2}>
                    <MDTypography variant="caption" color="text" fontWeight="bold">
                        Mã nhân khẩu
                    </MDTypography>
                    <MDTypography variant="body2">{data.maNhanKhau}</MDTypography>
                    </MDBox>

                    <MDBox mb={2}>
                    <MDTypography variant="caption" color="text" fontWeight="bold">
                        Họ và tên
                    </MDTypography>
                    <MDTypography variant="body2">{data.hoTen}</MDTypography>
                    </MDBox>

                    <MDBox mb={2}>
                    <MDTypography variant="caption" color="text" fontWeight="bold">
                        Ngày sinh
                    </MDTypography>
                    <MDTypography variant="body2">{formatDate(data.ngaySinh)}</MDTypography>
                    </MDBox>

                    <MDBox mb={2}>
                    <MDTypography variant="caption" color="text" fontWeight="bold">
                        Giới tính
                    </MDTypography>
                    <MDTypography variant="body2">{data.gioiTinh}</MDTypography>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={6}>
                    <MDBox mb={2}>
                    <MDTypography variant="caption" color="text" fontWeight="bold">
                        Số CCCD
                    </MDTypography>
                    <MDTypography variant="body2">{data.soCCCD || 'N/A'}</MDTypography>
                    </MDBox>

                    <MDBox mb={2}>
                    <MDTypography variant="caption" color="text" fontWeight="bold">
                        Quê quán
                    </MDTypography>
                    <MDTypography variant="body2">{data.queQuan || 'N/A'}</MDTypography>
                    </MDBox>

                    <MDBox mb={2}>
                    <MDTypography variant="caption" color="text" fontWeight="bold">
                        Dân tộc
                    </MDTypography>
                    <MDTypography variant="body2">{data.danToc || 'N/A'}</MDTypography>
                    </MDBox>

                    <MDBox mb={2}>
                    <MDTypography variant="caption" color="text" fontWeight="bold">
                        Quan hệ với chủ hộ
                    </MDTypography>
                    <MDTypography variant="body2">{data.quanHeVoiChuHo || 'N/A'}</MDTypography>
                    </MDBox>
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>

                <Grid item xs={12}>
                    <MDBox mb={2}>
                    <MDTypography variant="caption" color="text" fontWeight="bold">
                        Trạng thái
                    </MDTypography>
                    <MDBox mt={1}>{renderStatus(data.trangThai)}</MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12}>
                    <MDBox mb={2}>
                    <MDTypography variant="caption" color="text" fontWeight="bold">
                        Mã hộ khẩu
                    </MDTypography>
                    <MDTypography variant="body2">{data.maHoKhau || 'Chưa có'}</MDTypography>
                    </MDBox>
                </Grid>
                </Grid>
            </MDBox>
            </Card>
        </Grid>

        {/* Thao tác đặc biệt */}
        <Grid item xs={12}>
            <Card>
            <MDBox p={3}>
                <MDTypography variant="h6" mb={2}>
                Thao tác đặc biệt
                </MDTypography>
                <MDBox display="flex" gap={2} flexWrap="wrap">
                <MDButton
                    variant="gradient"
                    color="info"
                    onClick={() => setTamTruDialog(true)}
                    disabled={data.trangThai === 'KHAI_TU'}
                >
                    <Icon>home</Icon>&nbsp; Đăng ký tạm trú
                </MDButton>
                <MDButton
                    variant="gradient"
                    color="warning"
                    onClick={() => setTamVangDialog(true)}
                    disabled={data.trangThai === 'KHAI_TU'}
                >
                    <Icon>flight_takeoff</Icon>&nbsp; Đăng ký tạm vắng
                </MDButton>
                <MDButton
                    variant="gradient"
                    color="error"
                    onClick={() => setKhaiTuDialog(true)}
                    disabled={data.trangThai === 'KHAI_TU'}
                >
                    <Icon>cancel</Icon>&nbsp; Khai tử
                </MDButton>
                </MDBox>
            </MDBox>
            </Card>
        </Grid>
        </Grid>
    </MDBox>

    {/* Dialog đăng ký tạm trú */}
    <Dialog open={tamTruDialog} onClose={() => setTamTruDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Đăng ký tạm trú</DialogTitle>
        <DialogContent>
        <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
            <TextField
                label="Ngày bắt đầu"
                type="date"
                fullWidth
                value={tamTruForm.ngayBatDau}
                onChange={(e) => setTamTruForm({ ...tamTruForm, ngayBatDau: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
            />
            </Grid>
            <Grid item xs={12}>
            <TextField
                label="Ngày kết thúc"
                type="date"
                fullWidth
                value={tamTruForm.ngayKetThuc}
                onChange={(e) => setTamTruForm({ ...tamTruForm, ngayKetThuc: e.target.value })}
                InputLabelProps={{ shrink: true }}
            />
            </Grid>
            <Grid item xs={12}>
            <TextField
                label="Lý do"
                fullWidth
                multiline
                rows={3}
                value={tamTruForm.lyDo}
                onChange={(e) => setTamTruForm({ ...tamTruForm, lyDo: e.target.value })}
            />
            </Grid>
        </Grid>
        </DialogContent>
        <DialogActions>
        <MDButton onClick={() => setTamTruDialog(false)} color="dark">
            Hủy
        </MDButton>
        <MDButton onClick={handleTamTru} color="info">
            Đăng ký
        </MDButton>
        </DialogActions>
    </Dialog>

    {/* Dialog đăng ký tạm vắng */}
    <Dialog open={tamVangDialog} onClose={() => setTamVangDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Đăng ký tạm vắng</DialogTitle>
        <DialogContent>
        <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
            <TextField
                label="Ngày bắt đầu"
                type="date"
                fullWidth
                value={tamVangForm.ngayBatDau}
                onChange={(e) => setTamVangForm({ ...tamVangForm, ngayBatDau: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
            />
            </Grid>
            <Grid item xs={12}>
            <TextField
                label="Ngày kết thúc"
                type="date"
                fullWidth
                value={tamVangForm.ngayKetThuc}
                onChange={(e) => setTamVangForm({ ...tamVangForm, ngayKetThuc: e.target.value })}
                InputLabelProps={{ shrink: true }}
            />
            </Grid>
            <Grid item xs={12}>
            <TextField
                label="Lý do"
                fullWidth
                multiline
                rows={3}
                value={tamVangForm.lyDo}
                onChange={(e) => setTamVangForm({ ...tamVangForm, lyDo: e.target.value })}
            />
            </Grid>
        </Grid>
        </DialogContent>
        <DialogActions>
        <MDButton onClick={() => setTamVangDialog(false)} color="dark">
            Hủy
        </MDButton>
        <MDButton onClick={handleTamVang} color="warning">
            Đăng ký
        </MDButton>
        </DialogActions>
    </Dialog>

    {/* Dialog khai tử */}
    <Dialog open={khaiTuDialog} onClose={() => setKhaiTuDialog(false)}>
        <DialogTitle>Xác nhận khai tử</DialogTitle>
        <DialogContent>
        <DialogContentText>
            Bạn có chắc chắn muốn khai tử cho nhân khẩu <strong>{data.hoTen}</strong>?
            <br />
            Hành động này không thể hoàn tác.
        </DialogContentText>
        </DialogContent>
        <DialogActions>
        <MDButton onClick={() => setKhaiTuDialog(false)} color="dark">
            Hủy
        </MDButton>
        <MDButton onClick={handleKhaiTu} color="error">
            Xác nhận
        </MDButton>
        </DialogActions>
    </Dialog>

    <Footer />
    </DashboardLayout>
);
}

export default NhanKhauDetail;