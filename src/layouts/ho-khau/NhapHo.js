import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { nhapHo } from "services/hokhauService";

// @mui components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import {
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Icons
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function NhapHo() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State lưu danh sách các dòng nhập liệu
  const [rows, setRows] = useState([
    { cccd: "", quanHe: "" }, // Dòng mặc định đầu tiên
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Thêm dòng mới
  const handleAddRow = () => {
    setRows([...rows, { cccd: "", quanHe: "" }]);
  };

  // Xóa dòng
  const handleRemoveRow = (index) => {
    if (rows.length === 1) {
      setError("Cần ít nhất 1 thành viên để nhập hộ.");
      return;
    }
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  // Cập nhật dữ liệu khi gõ
  const handleChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate
    const invalidRow = rows.find((r) => !r.cccd.trim());
    if (invalidRow) {
      setError("Vui lòng nhập đầy đủ số CCCD cho tất cả các dòng.");
      return;
    }

    setLoading(true);
    try {
      // Mapping dữ liệu theo chuẩn DTO Backend mới
      const payload = {
        maHoNhapVao: id,
        danhSachNhanKhau: rows.map((r) => ({
          cccd: r.cccd.trim(),
          quanHeVoiChuHo: r.quanHe.trim() || "Thành viên",
        })),
      };

      await nhapHo(id, payload);
      alert("Nhập hộ thành công!");
      navigate(`/ho-khau/${id}`);
    } catch (err) {
      console.error(err);
      setError(
        "Nhập hộ thất bại. Vui lòng kiểm tra lại số CCCD (có thể sai hoặc chưa có trong hệ thống)."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              {/* Header Gradient Success */}
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="success"
                borderRadius="lg"
                coloredShadow="success"
                textAlign="center"
              >
                <MDTypography variant="h5" color="white" fontWeight="medium">
                  NHẬP HỘ KHẨU
                </MDTypography>
                <MDTypography variant="caption" color="white" opacity={0.8}>
                  Thêm thành viên và thiết lập quan hệ
                </MDTypography>
              </MDBox>

              <MDBox pt={4} pb={3} px={3}>
                {error && (
                  <MDBox mb={2}>
                    <Alert severity="error">{error}</Alert>
                  </MDBox>
                )}

                <form onSubmit={handleSubmit}>
                  <MDBox display="flex" justifyContent="flex-end" mb={2}>
                    <MDButton
                      size="small"
                      color="info"
                      startIcon={<AddCircleIcon />}
                      onClick={handleAddRow}
                    >
                      Thêm dòng
                    </MDButton>
                  </MDBox>

                  <TableContainer sx={{ border: "1px solid #f0f2f5", borderRadius: "8px", mb: 3 }}>
                    <Table>
                      <TableHead sx={{ display: "table-header-group", bgcolor: "#f8f9fa" }}>
                        <TableRow>
                          <TableCell width="5%">STT</TableCell>
                          <TableCell width="45%">Số CCCD (Bắt buộc)</TableCell>
                          <TableCell width="40%">Quan hệ với Chủ hộ</TableCell>
                          <TableCell width="10%" align="center">
                            Xóa
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <MDTypography variant="caption" fontWeight="medium">
                                {index + 1}
                              </MDTypography>
                            </TableCell>
                            <TableCell>
                              <MDInput
                                placeholder="Nhập số CCCD..."
                                value={row.cccd}
                                onChange={(e) => handleChange(index, "cccd", e.target.value)}
                                fullWidth
                                size="small"
                                required
                              />
                            </TableCell>
                            <TableCell>
                              <MDInput
                                placeholder="VD: Con, Cháu, Vợ..."
                                value={row.quanHe}
                                onChange={(e) => handleChange(index, "quanHe", e.target.value)}
                                fullWidth
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="Xóa dòng này">
                                <IconButton
                                  color="error"
                                  onClick={() => handleRemoveRow(index)}
                                  disabled={rows.length === 1}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <MDBox display="flex" justifyContent="flex-end" gap={2}>
                    <MDButton variant="outlined" color="dark" onClick={() => navigate(-1)}>
                      Hủy bỏ
                    </MDButton>
                    <MDButton
                      type="submit"
                      variant="gradient"
                      color="success"
                      disabled={loading}
                      startIcon={<Icon>check</Icon>}
                    >
                      {loading ? "Đang xử lý..." : "Xác nhận Nhập"}
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

export default NhapHo;
