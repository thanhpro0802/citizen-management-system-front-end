import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Icon from "@mui/material/Icon";
import TablePagination from "@mui/material/TablePagination";

// Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API
import { getPhanAnhCuaToi } from "services/phanAnhService";

function LichSuPhanAnh() {
  const [danhSach, setDanhSach] = useState([]);
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Helper
  const getMucDoLabel = (mucDo) => {
    switch (mucDo) {
      case "CAO":
        return "Cao";
      case "TRUNG_BINH":
        return "Trung Bình";
      case "THAP":
        return "Thấp";
      default:
        return "Thấp";
    }
  };

  const getMucDoColor = (mucDo) => {
    switch (mucDo) {
      case "CAO":
        return "error";
      case "TRUNG_BINH":
        return "warning";
      default:
        return "success";
    }
  };

  const getLinhVucLabel = (code) => {
    switch (code) {
      case "AN_NINH_TRAT_TU":
        return "An ninh trật tự";
      case "HA_TANG_DO_THI":
        return "Hạ tầng đô thị";
      case "MOI_TRUONG":
        return "Môi trường";
      case "Y_TE":
        return "Y tế";
      case "GIAO_DUC":
        return "Giáo dục";
      case "HANH_CHINH_CONG":
        return "Hành chính công";
      default:
        return code ? code.replace(/_/g, " ") : "Khác";
    }
  };

  const getStatusColor = (status) => {
    if (status === "DA_XU_LY") return "success";
    if (status === "DANG_XU_LY") return "info";
    return "secondary";
  };

  const getStatusLabel = (status) => {
    if (status === "DA_XU_LY") return "Đã Xử Lý";
    if (status === "DANG_XU_LY") return "Đang Xử Lý";
    return "Chờ Tiếp Nhận";
  };

  const handleXemChiTiet = (id) => {
    navigate(`/chi-tiet-phan-anh/${id}`);
  };

  // --- LOGIC SẮP XẾP MỚI ---
  const sortPhanAnh = (data) => {
    return data.sort((a, b) => {
      // 1. Ưu tiên: Chưa hoàn thành lên trước
      const isDoneA = a.trangThaiHienTai === "DA_XU_LY";
      const isDoneB = b.trangThaiHienTai === "DA_XU_LY";
      if (isDoneA !== isDoneB) {
        return isDoneA ? 1 : -1; // Done xuống dưới (1)
      }

      // 2. Ưu tiên: Mức độ khẩn cấp (Cao > TB > Thấp)
      const priorityMap = { CAO: 3, TRUNG_BINH: 2, THAP: 1 };
      const pA = priorityMap[a.mucDoKhanCap] || 0;
      const pB = priorityMap[b.mucDoKhanCap] || 0;
      if (pA !== pB) {
        return pB - pA; // Điểm cao lên trước
      }

      // 3. Ưu tiên: Thời gian mới nhất
      return (b.thoiGianTao || "").localeCompare(a.thoiGianTao || "");
    });
  };
  // -------------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPhanAnhCuaToi();
        const sortedData = sortPhanAnh(response.data); // Gọi hàm sort
        setDanhSach(sortedData);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
                  Lịch Sử Phản Ánh Của Tôi
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <TableContainer>
                  <Table>
                    <TableHead style={{ display: "table-header-group" }}>
                      <TableRow>
                        <TableCell>Tiêu đề</TableCell>
                        <TableCell>Lĩnh vực</TableCell>
                        <TableCell align="center">Mức độ</TableCell>
                        <TableCell align="center">Trạng thái</TableCell>
                        <TableCell align="center">Đánh giá</TableCell>
                        <TableCell align="center">Hành động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {danhSach.length > 0 ? (
                        danhSach
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => (
                            <TableRow key={row.maPhanAnh}>
                              <TableCell style={{ maxWidth: "250px" }}>
                                <MDTypography variant="button" fontWeight="medium">
                                  {row.tieuDe}
                                </MDTypography>
                              </TableCell>
                              <TableCell>
                                <MDTypography variant="caption" color="text">
                                  {getLinhVucLabel(row.linhVuc)}
                                </MDTypography>
                              </TableCell>
                              <TableCell align="center">
                                <MDBadge
                                  badgeContent={getMucDoLabel(row.mucDoKhanCap)}
                                  color={getMucDoColor(row.mucDoKhanCap)}
                                  variant="gradient"
                                  size="sm"
                                />
                              </TableCell>
                              <TableCell align="center">
                                <MDBadge
                                  badgeContent={getStatusLabel(row.trangThaiHienTai)}
                                  color={getStatusColor(row.trangThaiHienTai)}
                                  variant="gradient"
                                  size="sm"
                                />
                              </TableCell>
                              <TableCell align="center">
                                {row.danhGiaHaiLong ? (
                                  <MDTypography variant="caption" fontWeight="bold" color="warning">
                                    {row.danhGiaHaiLong} ⭐
                                  </MDTypography>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell align="center">
                                <MDButton
                                  variant="text"
                                  color="info"
                                  size="small"
                                  onClick={() => handleXemChiTiet(row.maPhanAnh)}
                                >
                                  <Icon>visibility</Icon>&nbsp;Chi tiết
                                </MDButton>
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            <MDTypography variant="caption" color="text">
                              Chưa có dữ liệu.
                            </MDTypography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  rowsPerPageOptions={[]}
                  component="div"
                  count={danhSach.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}–${to} trong tổng số ${count}`
                  }
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default LichSuPhanAnh;
