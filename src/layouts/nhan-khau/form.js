/**
 * Component form để thêm mới hoặc chỉnh sửa thông tin nhân khẩu
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';

// Service
import nhanKhauService from 'services/nhanKhauService';

function NhanKhauForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hoTen: '',
    ngaySinh: '',
    gioiTinh: 'Nam',
    soCCCD: '',
    queQuan: '',
    danToc: 'Kinh',
    quanHeVoiChuHo: '',
    maHoKhau: '',
  });

  const [errors, setErrors] = useState({});

  // Load dữ liệu khi edit
  useEffect(() => {
    if (isEditMode) {
      loadNhanKhau();
    }
  }, [id]);

  const loadNhanKhau = async () => {
    try {
      setLoading(true);
      const data = await nhanKhauService.getNhanKhauById(id);

      // Format date for input type="date"
      const formattedDate = data.ngaySinh
        ? new Date(data.ngaySinh).toISOString().split('T')[0]
        : '';

      setFormData({
        hoTen: data.hoTen || '',
        ngaySinh: formattedDate,
        gioiTinh: data.gioiTinh || 'Nam',
        soCCCD: data.soCCCD || '',
        queQuan: data.queQuan || '',
        danToc: data.danToc || 'Kinh',
        quanHeVoiChuHo: data.quanHeVoiChuHo || '',
        maHoKhau: data.maHoKhau || '',
      });
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      alert('Không thể tải thông tin nhân khẩu');
      navigate('/nhan-khau');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    // Xóa lỗi khi user nhập
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.hoTen || formData.hoTen.trim() === '') {
      newErrors.hoTen = 'Họ tên không được để trống';
    }

    if (!formData.ngaySinh) {
      newErrors.ngaySinh = 'Ngày sinh không được để trống';
    }

    if (!formData.gioiTinh) {
      newErrors.gioiTinh = 'Giới tính không được để trống';
    }

    if (formData.soCCCD && formData.soCCCD.length !== 12) {
      newErrors.soCCCD = 'Số CCCD phải có 12 chữ số';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Chuyển đổi ngày sinh sang format phù hợp
      const submitData = {
        ...formData,
        ngaySinh: formData.ngaySinh ? new Date(formData.ngaySinh).toISOString() : null,
      };

      if (isEditMode) {
        await nhanKhauService.updateNhanKhau(id, submitData);
        alert('Cập nhật nhân khẩu thành công');
      } else {
        await nhanKhauService.createNhanKhau(submitData);
        alert('Thêm mới nhân khẩu thành công');
      }

      navigate('/nhan-khau');
    } catch (error) {
      console.error('Lỗi khi lưu:', error);
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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
              >
                <MDTypography variant="h6" color="white">
                  {isEditMode ? 'Chỉnh sửa nhân khẩu' : 'Thêm mới nhân khẩu'}
                </MDTypography>
              </MDBox>

              <MDBox p={3}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Họ tên */}
                    <Grid item xs={12} md={6}>
                      <MDInput
                        label="Họ và tên *"
                        fullWidth
                        value={formData.hoTen}
                        onChange={handleChange('hoTen')}
                        error={Boolean(errors.hoTen)}
                        helperText={errors.hoTen}
                      />
                    </Grid>

                    {/* Ngày sinh */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Ngày sinh *"
                        type="date"
                        fullWidth
                        value={formData.ngaySinh}
                        onChange={handleChange('ngaySinh')}
                        error={Boolean(errors.ngaySinh)}
                        helperText={errors.ngaySinh}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>

                    {/* Giới tính */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        select
                        label="Giới tính *"
                        fullWidth
                        value={formData.gioiTinh}
                        onChange={handleChange('gioiTinh')}
                        error={Boolean(errors.gioiTinh)}
                        helperText={errors.gioiTinh}
                      >
                        <MenuItem value="Nam">Nam</MenuItem>
                        <MenuItem value="Nữ">Nữ</MenuItem>
                        <MenuItem value="Khác">Khác</MenuItem>
                      </TextField>
                    </Grid>

                    {/* Số CCCD */}
                    <Grid item xs={12} md={6}>
                      <MDInput
                        label="Số CCCD"
                        fullWidth
                        value={formData.soCCCD}
                        onChange={handleChange('soCCCD')}
                        error={Boolean(errors.soCCCD)}
                        helperText={errors.soCCCD}
                        inputProps={{ maxLength: 12 }}
                      />
                    </Grid>

                    {/* Quê quán */}
                    <Grid item xs={12} md={6}>
                      <MDInput
                        label="Quê quán"
                        fullWidth
                        value={formData.queQuan}
                        onChange={handleChange('queQuan')}
                      />
                    </Grid>

                    {/* Dân tộc */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        select
                        label="Dân tộc"
                        fullWidth
                        value={formData.danToc}
                        onChange={handleChange('danToc')}
                      >
                        <MenuItem value="Kinh">Kinh</MenuItem>
                        <MenuItem value="Tày">Tày</MenuItem>
                        <MenuItem value="Thái">Thái</MenuItem>
                        <MenuItem value="Mường">Mường</MenuItem>
                        <MenuItem value="Khmer">Khmer</MenuItem>
                        <MenuItem value="Hoa">Hoa</MenuItem>
                        <MenuItem value="Nùng">Nùng</MenuItem>
                        <MenuItem value="H'Mông">H&apos;Mông</MenuItem>
                        <MenuItem value="Dao">Dao</MenuItem>
                        <MenuItem value="Khác">Khác</MenuItem>
                      </TextField>
                    </Grid>

                    {/* Quan hệ với chủ hộ */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        select
                        label="Quan hệ với chủ hộ"
                        fullWidth
                        value={formData.quanHeVoiChuHo}
                        onChange={handleChange('quanHeVoiChuHo')}
                      >
                        <MenuItem value="">Không xác định</MenuItem>
                        <MenuItem value="Chủ hộ">Chủ hộ</MenuItem>
                        <MenuItem value="Vợ/Chồng">Vợ/Chồng</MenuItem>
                        <MenuItem value="Con">Con</MenuItem>
                        <MenuItem value="Cha/Mẹ">Cha/Mẹ</MenuItem>
                        <MenuItem value="Anh/Chị/Em">Anh/Chị/Em</MenuItem>
                        <MenuItem value="Ông/Bà">Ông/Bà</MenuItem>
                        <MenuItem value="Cháu">Cháu</MenuItem>
                        <MenuItem value="Khác">Khác</MenuItem>
                      </TextField>
                    </Grid>

                    {/* Mã hộ khẩu */}
                    <Grid item xs={12} md={6}>
                      <MDInput
                        label="Mã hộ khẩu"
                        fullWidth
                        value={formData.maHoKhau}
                        onChange={handleChange('maHoKhau')}
                        helperText="Để trống nếu chưa thuộc hộ khẩu nào"
                      />
                    </Grid>

                    {/* Buttons */}
                    <Grid item xs={12}>
                      <MDBox display="flex" justifyContent="flex-end" gap={2} mt={2}>
                        <MDButton
                          variant="outlined"
                          color="dark"
                          onClick={() => navigate('/nhan-khau')}
                          disabled={loading}
                        >
                          Hủy
                        </MDButton>
                        <MDButton variant="gradient" color="info" type="submit" disabled={loading}>
                          {loading ? 'Đang lưu...' : isEditMode ? 'Cập nhật' : 'Thêm mới'}
                        </MDButton>
                      </MDBox>
                    </Grid>
                  </Grid>
                </form>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default NhanKhauForm;
