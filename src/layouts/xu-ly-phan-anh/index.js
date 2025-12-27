import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";

// Import cho Modal
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

// Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDAlert from "components/MDAlert";

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Services
import {
  getChiTietPhanAnh,
  getLichSuPhanAnh,
  phanCongXuLy,
  capNhatXuLyNoiBo,
  phanHoiCongDan,
  updateMucDoKhanCap,
} from "services/phanAnhService";

import { getAllCanBo } from "services/userService";

function XuLyPhanAnh() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State dữ liệu chính
  const [data, setData] = useState(null);
  const [lichSu, setLichSu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ type: "", content: "" });

  // State Form xử lý
  const [mucDo, setMucDo] = useState("THAP");
  const [maCanBo, setMaCanBo] = useState("");
  const [thoiHan, setThoiHan] = useState("");
  const [noiDungXuLy, setNoiDungXuLy] = useState("");

  // --- STATE CHO MODAL (CÓ TÌM KIẾM) ---
  const [openDialog, setOpenDialog] = useState(false);
  const [listCanBo, setListCanBo] = useState([]);
  const [selectedCanBoInfo, setSelectedCanBoInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Thêm state tìm kiếm
  // -----------------------

  // State Phân trang lịch sử
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // --- HELPER FUNCTIONS ---
  const getStatusLabel = (s) =>
    s === "DA_XU_LY" ? "Đã xong" : s === "DANG_XU_LY" ? "Đang xử lý" : "Chờ xử lý";

  const getMucDoLabel = (code) => {
    switch (code) {
      case "THAP":
        return "Thấp";
      case "TRUNG_BINH":
        return "Trung Bình";
      case "CAO":
        return "Cao";
      default:
        return code;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      const [resDetail, resHistory] = await Promise.all([
        getChiTietPhanAnh(id),
        getLichSuPhanAnh(id),
      ]);

      if (resDetail && resDetail.data) {
        setData(resDetail.data);
        if (resDetail.data.mucDoKhanCap) setMucDo(resDetail.data.mucDoKhanCap);
      }

      if (resHistory && resHistory.data) {
        setLichSu(resHistory.data.sort((a, b) => new Date(b.thoiGian) - new Date(a.thoiGian)));
      }
    } catch (err) {
      setError("Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // --- LOGIC MODAL ---
  const handleOpenSelect = async () => {
    setOpenDialog(true);
    setSearchTerm(""); // Reset tìm kiếm mỗi khi mở modal
    try {
      const res = await getAllCanBo();
      if (res && res.data) {
        const list = Array.isArray(res.data) ? res.data : res.data.content || [];
        setListCanBo(list);
      }
    } catch (err) {
      console.error("Lỗi tải danh sách cán bộ:", err);
      setMessage({ type: "error", content: "Không tải được danh sách cán bộ." });
    }
  };

  const handleSelectCanBo = (canBoInfo) => {
    setMaCanBo(canBoInfo.id || canBoInfo.maTaiKhoan);
    setSelectedCanBoInfo(canBoInfo);
    setOpenDialog(false);
  };
  // -------------------

  // --- HANDLERS ---
  const handleChangeMucDo = async (event) => {
    const newMucDo = event.target.value;
    setMucDo(newMucDo);
    try {
      await updateMucDoKhanCap(id, newMucDo);
      setMessage({ type: "success", content: `Đã đổi mức độ thành: ${getMucDoLabel(newMucDo)}` });
      fetchData();
    } catch (e) {
      setMessage({ type: "error", content: "Lỗi cập nhật mức độ." });
    }
  };

  const handlePhanCong = async () => {
    if (!maCanBo) {
      setMessage({ type: "error", content: "Vui lòng chọn cán bộ trước!" });
      return;
    }
    try {
      await phanCongXuLy(id, maCanBo, thoiHan);
      setMessage({
        type: "success",
        content: `Đã phân công cho: ${selectedCanBoInfo?.hoTen || maCanBo}`,
      });
      fetchData();
    } catch (e) {
      setMessage({ type: "error", content: "Lỗi phân công!" });
    }
  };

  const handleNoiBo = async () => {
    try {
      await capNhatXuLyNoiBo(id, noiDungXuLy);
      setMessage({ type: "success", content: "Đã lưu nhật ký." });
      setNoiDungXuLy("");
      fetchData();
      setPage(1);
    } catch (e) {
      setMessage({ type: "error", content: "Lỗi lưu dữ liệu." });
    }
  };

  const handlePhanHoi = async () => {
    if (!window.confirm("Hoàn tất hồ sơ?")) return;
    try {
      await phanHoiCongDan(id, noiDungXuLy);
      setMessage({ type: "success", content: "Đã hoàn tất!" });
      setTimeout(() => navigate("/quan-ly-phan-anh"), 1500);
    } catch (e) {
      setMessage({ type: "error", content: "Lỗi phản hồi!" });
    }
  };

  // Pagination logic
  const handlePageChange = (event, value) => setPage(value);
  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = lichSu.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(lichSu.length / rowsPerPage);

  if (loading)
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox p={5}>Đang tải...</MDBox>
      </DashboardLayout>
    );
  if (error || !data)
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox p={5}>Lỗi dữ liệu</MDBox>
      </DashboardLayout>
    );

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
                bgColor="primary"
                borderRadius="lg"
                coloredShadow="primary"
                display="flex"
                justifyContent="space-between"
              >
                <MDTypography variant="h6" color="white">
                  Xử Lý: {data.tieuDe}
                </MDTypography>
                <MDBox bgColor="white" px={2} borderRadius="md">
                  <MDTypography variant="button" fontWeight="bold" color="dark">
                    {getStatusLabel(data.trangThaiHienTai)}
                  </MDTypography>
                </MDBox>
              </MDBox>

              <MDBox p={4}>
                {message.content && (
                  <MDBox mb={2}>
                    <MDAlert
                      color={message.type}
                      dismissible
                      onClose={() => setMessage({ type: "", content: "" })}
                    >
                      {message.content}
                    </MDAlert>
                  </MDBox>
                )}

                <MDBox
                  mb={3}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  bgColor="#f8f9fa"
                  p={2}
                  borderRadius="lg"
                  border="1px solid #e0e0e0"
                >
                  <MDTypography variant="h6" color="text">
                    Mức độ ưu tiên:
                  </MDTypography>
                  <MDBox width="200px">
                    <FormControl fullWidth size="small">
                      <InputLabel id="lvl">Mức độ</InputLabel>
                      <Select
                        labelId="lvl"
                        value={mucDo || "THAP"}
                        label="Mức độ"
                        onChange={handleChangeMucDo}
                        sx={{ height: 40, bgcolor: "white" }}
                      >
                        <MenuItem value="THAP">🟢 Thấp</MenuItem>
                        <MenuItem value="TRUNG_BINH">🟡 Trung Bình</MenuItem>
                        <MenuItem value="CAO">🔴 Cao</MenuItem>
                      </Select>
                    </FormControl>
                  </MDBox>
                </MDBox>

                <MDBox mb={3} p={2} bgColor="grey-100" borderRadius="lg">
                  <MDTypography variant="caption" fontWeight="bold">
                    Nội dung người dân gửi:
                  </MDTypography>
                  <MDTypography variant="body2">{data.noiDung}</MDTypography>
                </MDBox>
                <Divider />

                {data.trangThaiHienTai === "CHO" && (
                  <MDBox mt={2}>
                    <MDTypography variant="h6" color="info" gutterBottom>
                      1. Phân Công Xử Lý
                    </MDTypography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <MDBox mb={1}>
                          <MDTypography variant="caption" fontWeight="bold" color="text">
                            Cán bộ phụ trách:
                          </MDTypography>
                        </MDBox>
                        <MDBox display="flex" gap={1}>
                          <MDInput
                            fullWidth
                            value={
                              selectedCanBoInfo
                                ? `${selectedCanBoInfo.hoTen} (${selectedCanBoInfo.id || "..."})`
                                : maCanBo
                            }
                            placeholder="Chưa chọn cán bộ..."
                            disabled
                            InputProps={{
                              startAdornment: <Icon sx={{ mr: 1 }}>person</Icon>,
                            }}
                          />
                          <MDButton
                            variant="gradient"
                            color="info"
                            onClick={handleOpenSelect}
                            sx={{ minWidth: "110px", px: 1 }}
                          >
                            <Icon>list</Icon>&nbsp;Chọn
                          </MDButton>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <MDBox mb={1}>
                          <MDTypography variant="caption" fontWeight="bold" color="text">
                            Hạn chót xử lý (Deadline):
                          </MDTypography>
                        </MDBox>
                        <MDInput
                          type="date"
                          fullWidth
                          value={thoiHan}
                          onChange={(e) => setThoiHan(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <MDButton variant="gradient" color="info" onClick={handlePhanCong}>
                          Phân Công
                        </MDButton>
                      </Grid>
                    </Grid>
                  </MDBox>
                )}

                {data.trangThaiHienTai === "DANG_XU_LY" && (
                  <MDBox mt={2}>
                    <MDTypography variant="h6" color="warning" gutterBottom>
                      2. Ghi Nhật Ký & Xử Lý
                    </MDTypography>
                    <MDInput
                      label="Nội dung công việc / kết quả..."
                      multiline
                      rows={4}
                      fullWidth
                      value={noiDungXuLy}
                      onChange={(e) => setNoiDungXuLy(e.target.value)}
                    />
                    <MDBox mt={2} display="flex" gap={2}>
                      <MDButton variant="outlined" color="info" onClick={handleNoiBo}>
                        Ghi Nhật Ký (Nội bộ)
                      </MDButton>
                      <MDButton variant="gradient" color="success" onClick={handlePhanHoi}>
                        Trả Lời Dân (Xong)
                      </MDButton>
                    </MDBox>
                  </MDBox>
                )}

                {data.trangThaiHienTai === "DA_XU_LY" && (
                  <MDBox mt={2} textAlign="center">
                    <MDTypography variant="h5" color="success">
                      ✅ Hồ sơ đã hoàn tất
                    </MDTypography>
                  </MDBox>
                )}

                <Divider sx={{ my: 4 }} />

                <MDBox>
                  <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <MDTypography variant="h5" color="dark">
                      📜 Lịch sử xử lý & Nhật ký
                    </MDTypography>
                    <MDTypography variant="caption">Tổng số: {lichSu.length} bản ghi</MDTypography>
                  </MDBox>

                  {lichSu.length === 0 ? (
                    <MDTypography variant="caption" color="text">
                      Chưa có hoạt động nào.
                    </MDTypography>
                  ) : (
                    <MDBox display="flex" flexDirection="column" gap={2}>
                      {currentRows.map((item, index) => {
                        let actionLabel = item.hanhDong;
                        let actionColor = "dark";
                        switch (item.hanhDong) {
                          case "TAO_MOI":
                            actionLabel = "🆕 Tạo mới phản ánh";
                            actionColor = "info";
                            break;
                          case "PHAN_CONG":
                            actionLabel = "👉 Phân công xử lý";
                            actionColor = "warning";
                            break;
                          case "XU_LY":
                            actionLabel = "📝 Ghi nhật ký xử lý";
                            actionColor = "dark";
                            break;
                          case "PHAN_HOI":
                            actionLabel = "✅ Đã phản hồi & Hoàn tất";
                            actionColor = "success";
                            break;
                          case "DANH_GIA":
                            actionLabel = "⭐ Công dân đánh giá";
                            actionColor = "primary";
                            break;
                          default:
                            break;
                        }
                        return (
                          <MDBox
                            key={index}
                            p={2}
                            borderRadius="lg"
                            bgColor="grey-100"
                            border="1px solid #e0e0e0"
                            sx={{ borderLeft: `4px solid`, borderLeftColor: actionColor }}
                          >
                            <MDBox
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              mb={1}
                            >
                              <MDTypography
                                variant="caption"
                                fontWeight="bold"
                                color={actionColor}
                                textTransform="uppercase"
                              >
                                {actionLabel}
                              </MDTypography>
                              <MDTypography variant="caption" color="text">
                                🕒 {formatDate(item.thoiGian)}
                              </MDTypography>
                            </MDBox>
                            <MDTypography
                              variant="button"
                              fontWeight="bold"
                              color="dark"
                              display="block"
                            >
                              Người thực hiện: {item.nguoiThucHien || "Hệ thống"}
                            </MDTypography>
                            <MDBox
                              mt={1}
                              p={1}
                              bgColor="white"
                              borderRadius="md"
                              border="1px dashed #ccc"
                            >
                              <MDTypography
                                variant="body2"
                                color="text"
                                sx={{ whiteSpace: "pre-line" }}
                              >
                                {item.noiDung || "(Không có nội dung chi tiết)"}
                              </MDTypography>
                            </MDBox>
                          </MDBox>
                        );
                      })}
                    </MDBox>
                  )}
                  {lichSu.length > rowsPerPage && (
                    <MDBox display="flex" justifyContent="center" mt={3}>
                      <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                      />
                    </MDBox>
                  )}
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {/* --- DIALOG CHỌN CÁN BỘ (GRID + TÌM KIẾM + SCROLL) --- */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <MDBox
          p={2}
          variant="gradient"
          sx={{ background: "linear-gradient(195deg, #0f766e, #115e59)" }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <MDTypography variant="h6" color="white">
            Danh Sách Cán Bộ ({listCanBo.length})
          </MDTypography>
          <Icon onClick={() => setOpenDialog(false)} sx={{ color: "white", cursor: "pointer" }}>
            close
          </Icon>
        </MDBox>

        <DialogContent dividers>
          {/* 1. Ô TÌM KIẾM NHANH */}
          <MDBox mb={2}>
            <MDInput
              fullWidth
              placeholder="Nhập tên hoặc mã cán bộ để tìm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Icon sx={{ mr: 1 }}>search</Icon>,
              }}
            />
          </MDBox>

          {/* 2. HEADER (DÙNG GRID ĐỂ THẲNG HÀNG) */}
          <MDBox p={2} mb={1} borderRadius="lg" bgColor="grey-200">
            <Grid container alignItems="center">
              <Grid item xs={5}>
                <MDTypography variant="button" fontWeight="bold" color="dark">
                  Thông tin Cán bộ
                </MDTypography>
              </Grid>
              <Grid item xs={2}>
                <MDTypography variant="button" fontWeight="bold" color="dark">
                  Chức vụ
                </MDTypography>
              </Grid>
              <Grid item xs={3}>
                <MDTypography variant="button" fontWeight="bold" color="dark">
                  SĐT
                </MDTypography>
              </Grid>
              <Grid item xs={2} textAlign="center">
                <MDTypography variant="button" fontWeight="bold" color="dark">
                  Thao tác
                </MDTypography>
              </Grid>
            </Grid>
          </MDBox>

          {/* 3. DANH SÁCH (CÓ SCROLLBAR VÀ LOGIC FILTER) */}
          <MDBox
            display="flex"
            flexDirection="column"
            gap={1}
            // Tạo thanh cuộn nếu danh sách dài quá 400px
            sx={{ maxHeight: "400px", overflowY: "auto", pr: 1 }}
          >
            {listCanBo
              // BƯỚC 1: LỌC THEO TỪ KHÓA
              .filter((cb) => {
                const term = searchTerm.toLowerCase();
                const name = (cb.hoTen || cb.nhanKhau?.hoTen || "").toLowerCase();
                const code = (cb.maTaiKhoan || cb.soCccd || "").toLowerCase();
                return name.includes(term) || code.includes(term);
              }).length > 0 ? (
              // BƯỚC 2: RENDER RA DANH SÁCH ĐÃ LỌC
              listCanBo
                .filter((cb) => {
                  const term = searchTerm.toLowerCase();
                  const name = (cb.hoTen || cb.nhanKhau?.hoTen || "").toLowerCase();
                  const code = (cb.maTaiKhoan || cb.soCccd || "").toLowerCase();
                  return name.includes(term) || code.includes(term);
                })
                .map((cb, index) => {
                  const hoTenHienThi =
                    cb.hoTen || (cb.nhanKhau && cb.nhanKhau.hoTen) || "Chưa cập nhật";
                  const sdtHienThi =
                    cb.soDienThoai || cb.sdt || (cb.nhanKhau && cb.nhanKhau.soDienThoai) || "";
                  const chucVuHienThi = cb.vaiTro === "CAN_BO" ? "Cán bộ" : cb.vaiTro || "N/A";

                  let maRaw = cb.maTaiKhoan || cb.soCccd || cb.id || "";
                  let maHienThi = maRaw.length > 15 ? `${maRaw.substring(0, 8)}...` : maRaw;

                  return (
                    <Card key={index} sx={{ border: "1px solid #eee", boxShadow: "none" }}>
                      <MDBox p={2}>
                        <Grid container alignItems="center">
                          {/* Cột 1: Tên (xs=5 khớp với header) */}
                          <Grid item xs={5}>
                            <MDBox display="flex" flexDirection="column">
                              <MDTypography variant="body2" fontWeight="medium" color="dark">
                                {hoTenHienThi}
                              </MDTypography>
                              <MDBox
                                bgColor="grey-100"
                                borderRadius="md"
                                px={1}
                                py={0.5}
                                mt={0.5}
                                width="fit-content"
                                display="flex"
                                alignItems="center"
                                border="1px solid #ddd"
                              >
                                <Icon
                                  fontSize="small"
                                  sx={{ fontSize: "10px !important", mr: 0.5 }}
                                >
                                  tag
                                </Icon>
                                <MDTypography
                                  variant="caption"
                                  fontWeight="bold"
                                  color="text"
                                  sx={{ lineHeight: 1 }}
                                >
                                  {maHienThi}
                                </MDTypography>
                              </MDBox>
                            </MDBox>
                          </Grid>

                          {/* Cột 2: Chức vụ (xs=2 khớp với header) */}
                          <Grid item xs={2}>
                            <MDTypography variant="caption" color="text">
                              {chucVuHienThi}
                            </MDTypography>
                          </Grid>

                          {/* Cột 3: SĐT (xs=3 khớp với header) */}
                          <Grid item xs={3}>
                            <MDTypography variant="caption" color="dark">
                              {sdtHienThi}
                            </MDTypography>
                          </Grid>

                          {/* Cột 4: Nút (xs=2 khớp với header) */}
                          <Grid item xs={2} textAlign="center">
                            <MDButton
                              variant="gradient"
                              color="success"
                              size="small"
                              onClick={() =>
                                handleSelectCanBo({
                                  ...cb,
                                  hoTen: hoTenHienThi,
                                  id: maRaw,
                                })
                              }
                            >
                              Chọn
                            </MDButton>
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  );
                })
            ) : (
              <MDBox textAlign="center" py={3}>
                <MDTypography variant="caption">
                  Không tìm thấy cán bộ nào khớp với &quot;{searchTerm}&quot;
                </MDTypography>
              </MDBox>
            )}
          </MDBox>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setOpenDialog(false)} color="dark">
            Đóng
          </MDButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default XuLyPhanAnh;
