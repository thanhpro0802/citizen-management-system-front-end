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
  const [currentUser, setCurrentUser] = useState(null);

  // State Form xử lý
  const [mucDo, setMucDo] = useState("THAP");
  const [maCanBo, setMaCanBo] = useState("");
  const [thoiHan, setThoiHan] = useState("");
  const [noiDungXuLy, setNoiDungXuLy] = useState("");

  // --- STATE CHO MODAL ---
  const [openDialog, setOpenDialog] = useState(false);
  const [listCanBo, setListCanBo] = useState([]);
  const [selectedCanBoInfo, setSelectedCanBoInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const getRoleLabel = (role) => {
    switch (role) {
      case "ADMIN":
        return "Quản trị viên";
      case "TO_TRUONG":
        return "Tổ trưởng";
      case "TO_PHO":
        return "Tổ phó";
      case "CAN_BO_PHAN_ANH":
        return "Cán bộ phản ánh";
      case "CAN_BO_HO_KHAU":
        return "Cán bộ hộ khẩu";
      case "CAN_BO":
        return "Cán bộ";
      default:
        return role || "N/A";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  // --- KIỂM TRA QUYỀN & LẤY USER ---
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/authentication/sign-in");
      return;
    }
    const user = JSON.parse(userStr);
    setCurrentUser(user);

    const role = user.roles || user.role || user.vaiTro || "";
    const ROLES_QUAN_LY = ["ADMIN", "CAN_BO_PHAN_ANH", "TO_TRUONG", "TO_PHO"];

    const isAllowed = Array.isArray(role)
      ? role.some((r) => ROLES_QUAN_LY.includes(r))
      : ROLES_QUAN_LY.includes(role);

    if (!isAllowed) {
      navigate("/forbidden");
    }
  }, [navigate]);

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
    setSearchTerm("");
    try {
      const res = await getAllCanBo();
      if (res && res.data) {
        const list = Array.isArray(res.data) ? res.data : res.data.content || [];
        setListCanBo(list);
      }
    } catch (err) {
      setMessage({ type: "error", content: "Không tải được danh sách cán bộ." });
    }
  };

  const handleSelectCanBo = (canBoInfo) => {
    setMaCanBo(canBoInfo.id || canBoInfo.maTaiKhoan);
    setSelectedCanBoInfo(canBoInfo);
    setOpenDialog(false);
  };

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

  const handlePageChange = (event, value) => setPage(value);
  const currentRows = lichSu.slice((page - 1) * rowsPerPage, page * rowsPerPage);
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

  // ✅ Kiểm tra quyền quản lý: Tổ phó (TO_PHO) cũng có quyền phân công
  const isManager = ["ADMIN", "TO_TRUONG", "TO_PHO"].includes(
    currentUser?.vaiTro ||
      currentUser?.role ||
      (Array.isArray(currentUser?.roles) ? currentUser.roles[0] : "")
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

                {/* Phần Mức độ ưu tiên - Tổ phó cũng có quyền chỉnh sửa */}
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
                        disabled={!isManager}
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

                {/* PHẦN 1: PHÂN CÔNG - Hiển thị cho ADMIN, TO_TRUONG, TO_PHO */}
                {data.trangThaiHienTai === "CHO" && (
                  <MDBox mt={2}>
                    {isManager ? (
                      <>
                        <MDTypography variant="h6" color="info" gutterBottom>
                          1. Phân Công Xử Lý
                        </MDTypography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <MDBox mb={1}>
                              <MDTypography variant="caption" fontWeight="bold">
                                Cán bộ phụ trách:
                              </MDTypography>
                            </MDBox>
                            <MDBox display="flex" gap={1}>
                              <MDInput
                                fullWidth
                                value={selectedCanBoInfo ? `${selectedCanBoInfo.hoTen}` : maCanBo}
                                placeholder="Chưa chọn cán bộ..."
                                disabled
                              />
                              <MDButton
                                variant="gradient"
                                color="info"
                                onClick={handleOpenSelect}
                                sx={{ minWidth: "110px" }}
                              >
                                <Icon>list</Icon>&nbsp;Chọn
                              </MDButton>
                            </MDBox>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <MDBox mb={1}>
                              <MDTypography variant="caption" fontWeight="bold">
                                Deadline:
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
                      </>
                    ) : (
                      <MDBox p={2} bgColor="grey-100" borderRadius="lg" textAlign="center">
                        <MDTypography variant="h6" color="secondary">
                          🕒 Đang chờ Tổ trưởng/Tổ phó phân công xử lý
                        </MDTypography>
                      </MDBox>
                    )}
                  </MDBox>
                )}

                {/* PHẦN 2: XỬ LÝ - Dành cho người được phân công hoặc quản lý */}
                {data.trangThaiHienTai === "DANG_XU_LY" && (
                  <MDBox mt={2}>
                    <MDTypography variant="h6" color="warning" gutterBottom>
                      2. Ghi Nhật Ký & Xử Lý
                    </MDTypography>
                    <MDInput
                      label="Nội dung kết quả..."
                      multiline
                      rows={4}
                      fullWidth
                      value={noiDungXuLy}
                      onChange={(e) => setNoiDungXuLy(e.target.value)}
                    />
                    <MDBox mt={2} display="flex" gap={2}>
                      <MDButton variant="outlined" color="info" onClick={handleNoiBo}>
                        Ghi Nhật Ký
                      </MDButton>
                      <MDButton variant="gradient" color="success" onClick={handlePhanHoi}>
                        Trả Lời Dân (Hoàn tất)
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
                  <MDTypography variant="h5" color="dark" mb={2}>
                    📜 Lịch sử xử lý
                  </MDTypography>
                  {lichSu.length === 0 ? (
                    <MDTypography variant="caption">Chưa có hoạt động.</MDTypography>
                  ) : (
                    <MDBox display="flex" flexDirection="column" gap={2}>
                      {currentRows.map((item, index) => (
                        <MDBox
                          key={index}
                          p={2}
                          borderRadius="lg"
                          bgColor="grey-100"
                          borderLeft="4px solid #115e59"
                        >
                          <MDBox display="flex" justifyContent="space-between">
                            <MDTypography variant="caption" fontWeight="bold" color="dark">
                              {item.hanhDong}
                            </MDTypography>
                            <MDTypography variant="caption" color="text">
                              {formatDate(item.thoiGian)}
                            </MDTypography>
                          </MDBox>
                          <MDTypography variant="button" display="block">
                            Người thực hiện: {item.nguoiThucHien}
                          </MDTypography>
                          <MDTypography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                            {item.noiDung}
                          </MDTypography>
                        </MDBox>
                      ))}
                    </MDBox>
                  )}
                  {lichSu.length > rowsPerPage && (
                    <MDBox display="flex" justifyContent="center" mt={3}>
                      <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
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

      {/* DIALOG CHỌN CÁN BỘ */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <MDBox
          p={2}
          variant="gradient"
          bgColor="info"
          display="flex"
          justifyContent="space-between"
        >
          <MDTypography variant="h6" color="white">
            Chọn Cán Bộ
          </MDTypography>
          <Icon onClick={() => setOpenDialog(false)} sx={{ color: "white", cursor: "pointer" }}>
            close
          </Icon>
        </MDBox>
        <DialogContent dividers>
          <MDInput
            fullWidth
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
          <MDBox sx={{ maxHeight: "400px", overflowY: "auto" }}>
            {listCanBo
              .filter((cb) => (cb.hoTen || "").toLowerCase().includes(searchTerm.toLowerCase()))
              .map((cb, idx) => (
                <Card key={idx} sx={{ mb: 1, p: 2, boxShadow: "none", border: "1px solid #eee" }}>
                  <Grid container alignItems="center">
                    <Grid item xs={5}>
                      <MDTypography variant="body2" fontWeight="bold">
                        {cb.hoTen || cb.nhanKhau?.hoTen}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={3}>
                      <MDTypography variant="caption">{getRoleLabel(cb.vaiTro)}</MDTypography>
                    </Grid>
                    <Grid item xs={2}>
                      <MDTypography variant="caption">{cb.soDienThoai || cb.sdt}</MDTypography>
                    </Grid>
                    <Grid item xs={2} textAlign="right">
                      <MDButton
                        variant="gradient"
                        color="success"
                        size="small"
                        onClick={() => handleSelectCanBo(cb)}
                      >
                        Chọn
                      </MDButton>
                    </Grid>
                  </Grid>
                </Card>
              ))}
          </MDBox>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

export default XuLyPhanAnh;
