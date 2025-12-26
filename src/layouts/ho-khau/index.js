import { useState, useEffect } from "react";
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDAlert from "components/MDAlert";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function QuanLyHoKhau() {
const [hoKhauList, setHoKhauList] = useState([]);
const [loading, setLoading] = useState(false);
const [openDialog, setOpenDialog] = useState(false);
const [formData, setFormData] = useState({
    maHoKhau: "",
    diaChi: "",
    ngayLap: "",
});
const [isEdit, setIsEdit] = useState(false);
const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
const [searchQuery, setSearchQuery] = useState("");
const [selectedHoKhau, setSelectedHoKhau] = useState(null);

const API_URL = "http://localhost:8080/api/ho-khau";

// Lấy token từ localStorage
const token = localStorage.getItem("token");
const axiosConfig = {
    headers: {
    Authorization: `Bearer ${token}`,
    },
};

useEffect(() => {
    fetchHoKhau();
}, []);

const fetchHoKhau = async () => {
    setLoading(true);
    try {
    const response = await axios.get(API_URL, axiosConfig);
    setHoKhauList(response.data);
    } catch (error) {
    showAlert("Lỗi khi tải dữ liệu: " + (error.response?.data?.message || error.message), "error");
    } finally {
    setLoading(false);
    }
};

const handleOpenDialog = (hoKhau = null) => {
    if (hoKhau) {
    setFormData({
        maHoKhau: hoKhau.maHoKhau,
        diaChi: hoKhau.diaChi || "",
        ngayLap: hoKhau.ngayLap?.split("T")[0] || "",
    });
    setIsEdit(true);
    } else {
    setFormData({
        maHoKhau: "",
        diaChi: "",
        ngayLap: "",
    });
    setIsEdit(false);
    }
    setOpenDialog(true);
};

const handleCloseDialog = () => {
    setOpenDialog(false);
};

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async () => {
    try {
    if (isEdit) {
        await axios.put(`${API_URL}/${formData.maHoKhau}`, formData, axiosConfig);
        showAlert("Cập nhật hộ khẩu thành công!", "success");
    } else {
        await axios.post(API_URL, formData, axiosConfig);
        showAlert("Thêm hộ khẩu thành công!", "success");
    }
    fetchHoKhau();
    handleCloseDialog();
    } catch (error) {
    showAlert(
        "Lỗi: " + (error.response?.data?.message || error.message),
        "error"
    );
    }
};

const handleDelete = async (maHoKhau) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hộ khẩu này?")) {
    try {
        await axios.delete(`${API_URL}/${maHoKhau}`, axiosConfig);
        showAlert("Xóa hộ khẩu thành công!", "success");
        fetchHoKhau();
    } catch (error) {
        showAlert(
        "Lỗi khi xóa: " + (error.response?.data?.message || error.message),
        "error"
        );
    }
    }
};

const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 3000);
};

const filteredData = hoKhauList.filter((item) =>
    Object.values(item).some((val) =>
    String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
);

const columns = [
    { Header: "Mã hộ khẩu", accessor: "maHoKhau", width: "20%" },
    { Header: "Địa chỉ", accessor: "diaChi", width: "40%" },
    { Header: "Ngày lập", accessor: "ngayLap", width: "15%" },
    { Header: "Số thành viên", accessor: "soThanhVien", width: "15%" },
    { Header: "Hành động", accessor: "action", width: "10%" },
];

const rows = filteredData.map((item) => ({
    maHoKhau: item.maHoKhau,
    diaChi: item.diaChi || "Chưa có thông tin",
    ngayLap: item.ngayLap?.split("T")[0] || "",
    soThanhVien: item.thanhVienList?.length || 0,
    action: (
    <MDBox display="flex" gap={1}>
        <IconButton
        size="small"
        color="info"
        onClick={() => setSelectedHoKhau(item)}
        title="Xem chi tiết"
        >
        <Icon>visibility</Icon>
        </IconButton>
        <IconButton size="small" color="warning" onClick={() => handleOpenDialog(item)}>
        <Icon>edit</Icon>
        </IconButton>
        <IconButton
        size="small"
        color="error"
        onClick={() => handleDelete(item.maHoKhau)}
        >
        <Icon>delete</Icon>
        </IconButton>
    </MDBox>
    ),
}));

return (
    <DashboardLayout>
    <DashboardNavbar />
    <MDBox pt={6} pb={3}>
        {alert.show && (
        <MDAlert color={alert.type} dismissible>
            {alert.message}
        </MDAlert>
        )}

        <Grid container spacing={6}>
        <Grid item xs={12}>
            <Card>
            <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="success"
                borderRadius="lg"
                coloredShadow="success"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <MDTypography variant="h6" color="white">
                Quản Lý Hộ Khẩu
                </MDTypography>
                <MDButton
                variant="gradient"
                color="light"
                onClick={() => handleOpenDialog()}
                >
                <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                &nbsp;Thêm mới
                </MDButton>
            </MDBox>
            <MDBox p={3}>
                <MDBox mb={2}>
                <MDInput
                    label="Tìm kiếm..."
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                </MDBox>
                {loading ? (
                <MDTypography variant="body2">Đang tải...</MDTypography>
                ) : (
                <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={{ defaultValue: 10 }}
                    showTotalEntries={true}
                    noEndBorder
                />
                )}
            </MDBox>
            </Card>
        </Grid>

        {/* Chi tiết hộ khẩu */}
        {selectedHoKhau && (
            <Grid item xs={12}>
            <Card>
                <MDBox p={3}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <MDTypography variant="h6">
                    Chi tiết hộ khẩu: {selectedHoKhau.maHoKhau}
                    </MDTypography>
                    <IconButton onClick={() => setSelectedHoKhau(null)}>
                    <Icon>close</Icon>
                    </IconButton>
                </MDBox>
                <MDTypography variant="body2" mb={1}>
                    <strong>Địa chỉ:</strong> {selectedHoKhau.diaChi}
                </MDTypography>
                <MDTypography variant="body2" mb={2}>
                    <strong>Ngày lập:</strong> {selectedHoKhau.ngayLap?.split("T")[0]}
                </MDTypography>

                <MDTypography variant="h6" mb={2}>
                    Danh sách thành viên ({selectedHoKhau.thanhVienList?.length || 0})
                </MDTypography>
                {selectedHoKhau.thanhVienList &&
                selectedHoKhau.thanhVienList.length > 0 ? (
                    selectedHoKhau.thanhVienList.map((tv, index) => (
                    <Accordion key={index}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <MDTypography variant="body2">
                            {tv.hoTen} - {tv.quanHeVoiChuHo}
                        </MDTypography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                            <MDTypography variant="caption">
                                <strong>Mã NK:</strong> {tv.maNhanKhau}
                            </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                            <MDTypography variant="caption">
                                <strong>CCCD:</strong> {tv.soCccd}
                            </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                            <MDTypography variant="caption">
                                <strong>Ngày sinh:</strong> {tv.ngaySinh?.split("T")[0]}
                            </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                            <MDTypography variant="caption">
                                <strong>Giới tính:</strong> {tv.gioiTinh}
                            </MDTypography>
                            </Grid>
                            <Grid item xs={12}>
                            <MDTypography variant="caption">
                                <strong>Quê quán:</strong> {tv.queQuan}
                            </MDTypography>
                            </Grid>
                        </Grid>
                        </AccordionDetails>
                    </Accordion>
                    ))
                ) : (
                    <MDTypography variant="body2" color="text">
                    Chưa có thành viên
                    </MDTypography>
                )}
                </MDBox>
            </Card>
            </Grid>
        )}
        </Grid>
    </MDBox>

    {/* Dialog thêm/sửa */}
    <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEdit ? "Cập nhật hộ khẩu" : "Thêm hộ khẩu mới"}</DialogTitle>
        <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
            <TextField
                label="Mã hộ khẩu"
                name="maHoKhau"
                value={formData.maHoKhau}
                onChange={handleInputChange}
                fullWidth
                disabled={isEdit}
                required
            />
            </Grid>
            <Grid item xs={12}>
            <TextField
                label="Địa chỉ"
                name="diaChi"
                value={formData.diaChi}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
            />
            </Grid>
            <Grid item xs={12}>
            <TextField
                label="Ngày lập"
                name="ngayLap"
                type="date"
                value={formData.ngayLap}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
            />
            </Grid>
        </Grid>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleCloseDialog}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEdit ? "Cập nhật" : "Thêm mới"}
        </Button>
        </DialogActions>
    </Dialog>

    <Footer />
    </DashboardLayout>
);
}

export default QuanLyHoKhau;
