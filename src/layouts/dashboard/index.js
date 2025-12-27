// React hooks
import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem"; // <--- THÊM ĐỂ LÀM DROPDOWN CHỌN QUÝ

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import PieChart from "examples/Charts/PieChart";

// Services
import statisticsService from "services/statisticsService";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0); // 0: Dân cư, 1: Phản ánh

  // States dữ liệu
  const [overview, setOverview] = useState(null);
  const [nhanKhauByGioiTinh, setNhanKhauByGioiTinh] = useState({});
  const [nhanKhauByDoTuoi, setNhanKhauByDoTuoi] = useState({});
  const [phanAnhByTrangThai, setPhanAnhByTrangThai] = useState({});
  const [phanAnhByMonth, setPhanAnhByMonth] = useState({});
  const [hoKhauByMonth, setHoKhauByMonth] = useState({});

  // --- STATE LỌC DỮ LIỆU ---

  // 1. Filter cho Hộ khẩu (Năm)
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());

  // 2. Filter cho Phản ánh theo tháng (Năm)
  const [phanAnhYearFilter, setPhanAnhYearFilter] = useState(new Date().getFullYear());

  // 3. Filter cho Trạng thái xử lý (Quý & Năm) - MỚI
  const currentMonth = new Date().getMonth() + 1;
  const currentQuarter = Math.ceil(currentMonth / 3); // Tính quý hiện tại (1-4)
  const [statusYear, setStatusYear] = useState(new Date().getFullYear());
  const [statusQuarter, setStatusQuarter] = useState(currentQuarter);

  // Effect 1: Load dữ liệu chung (Tổng quan, Giới tính, Độ tuổi)
  // Lưu ý: Đã bỏ `getPhanAnhByTrangThai` ra khỏi đây để xử lý riêng
  useEffect(() => {
    fetchStatistics();
  }, []);

  // Effect 2: Load dữ liệu Hộ khẩu (khi yearFilter đổi)
  useEffect(() => {
    const fetchHoKhauData = async () => {
      try {
        const res = await statisticsService.getHoKhauByMonth(yearFilter);
        setHoKhauByMonth(res.data);
      } catch (err) {
        console.error("Lỗi tải dữ liệu hộ khẩu:", err);
      }
    };
    fetchHoKhauData();
  }, [yearFilter]);

  // Effect 3: Load dữ liệu Phản ánh theo tháng (khi phanAnhYearFilter đổi)
  useEffect(() => {
    const fetchPhanAnhData = async () => {
      try {
        const res = await statisticsService.getPhanAnhByMonth(phanAnhYearFilter);
        setPhanAnhByMonth(res.data);
      } catch (err) {
        console.error("Lỗi tải dữ liệu phản ánh theo tháng:", err);
      }
    };
    fetchPhanAnhData();
  }, [phanAnhYearFilter]);

  // Effect 4: Load dữ liệu Trạng thái xử lý (khi statusYear HOẶC statusQuarter đổi) - MỚI
  useEffect(() => {
    const fetchTrangThaiData = async () => {
      try {
        // Giả sử service có hàm nhận vào (năm, quý).
        // Nếu service cũ chưa có params, bạn cần cập nhật service để truyền params này xuống backend.
        const res = await statisticsService.getPhanAnhByTrangThai(statusYear, statusQuarter);
        setPhanAnhByTrangThai(res.data);
      } catch (err) {
        console.error("Lỗi tải dữ liệu trạng thái xử lý:", err);
      }
    };
    fetchTrangThaiData();
  }, [statusYear, statusQuarter]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  // Handlers đổi bộ lọc
  const handleYearChange = (e) => setYearFilter(e.target.value);
  const handlePhanAnhYearChange = (e) => setPhanAnhYearFilter(e.target.value);

  const handleStatusYearChange = (e) => setStatusYear(e.target.value);
  const handleStatusQuarterChange = (e) => setStatusQuarter(e.target.value);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [overviewRes, gioiTinhRes, doTuoiRes] = await Promise.all([
        statisticsService.getOverview(),
        statisticsService.getNhanKhauByGioiTinh(),
        statisticsService.getNhanKhauByDoTuoi(),
      ]);

      setOverview(overviewRes.data);
      setNhanKhauByGioiTinh(gioiTinhRes.data);
      setNhanKhauByDoTuoi(doTuoiRes.data);
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // --- FORMAT DATA HELPERS ---
  const formatMonthlyData = (data) => {
    const months = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
    const values = months.map((_, index) => data[index + 1] || 0);
    return { labels: months, datasets: { label: "Số lượng", data: values } };
  };

  const formatGenderData = (data) => {
    const labels = [];
    const values = [];
    const colors = [];
    if (data["Nam"]) {
      labels.push("Nam");
      values.push(data["Nam"]);
      colors.push("info");
    }
    if (data["Nữ"]) {
      labels.push("Nữ");
      values.push(data["Nữ"]);
      colors.push("error");
    }
    if (data["Khác"]) {
      labels.push("Khác");
      values.push(data["Khác"]);
      colors.push("dark");
    }
    return { labels, datasets: { label: "Số người", data: values, backgroundColors: colors } };
  };

  const formatAgeGroupData = (data) => {
    const labels = [];
    const values = [];
    const sortedEntries = Object.entries(data).sort((a, b) => {
      const order = ["0-17", "18-35", "36-60", "61+"];
      return order.indexOf(a[0]) - order.indexOf(b[0]);
    });
    sortedEntries.forEach(([key, value]) => {
      labels.push(key);
      values.push(value);
    });
    return { labels, datasets: { label: "Số người", data: values } };
  };

  const formatStatusData = (data) => {
    const statusMap = {
      CHO: { label: "Chờ xử lý", color: "warning" },
      DANG_XU_LY: { label: "Đang xử lý", color: "info" },
      DA_XU_LY: { label: "Đã xử lý", color: "success" },
    };
    const labels = [];
    const values = [];
    const colors = [];
    Object.entries(data).forEach(([key, value]) => {
      if (statusMap[key]) {
        labels.push(statusMap[key].label);
        values.push(value);
        colors.push(statusMap[key].color);
      }
    });
    return { labels, datasets: { label: "Số phản ánh", data: values, backgroundColors: colors } };
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // --- RENDER COMPONENTS ---
  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3} display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress color="info" size={60} />
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3}>
          <MDTypography variant="h5" color="error">
            {error}
          </MDTypography>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  const currentYear = new Date().getFullYear();
  const phanAnhMonthData = formatMonthlyData(phanAnhByMonth);
  const hoKhauMonthData = formatMonthlyData(hoKhauByMonth);
  const genderData = formatGenderData(nhanKhauByGioiTinh);
  const ageGroupData = formatAgeGroupData(nhanKhauByDoTuoi);
  const statusData = formatStatusData(phanAnhByTrangThai);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* --- THANH TAB NAVIGATION --- */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={12} lg={12}>
            <AppBar position="static">
              <Tabs orientation="horizontal" value={tabValue} onChange={handleSetTabValue}>
                <Tab
                  label="Thống kê Dân cư"
                  icon={<Icon fontSize="medium">groups</Icon>}
                  iconPosition="start"
                />
                <Tab
                  label="Quản lý Phản ánh"
                  icon={<Icon fontSize="medium">feedback</Icon>}
                  iconPosition="start"
                />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>

        {/* --- NỘI DUNG TAB 0: DÂN CƯ --- */}
        {tabValue === 0 && (
          <MDBox>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="dark"
                    icon="home"
                    title="Hộ khẩu"
                    count={formatNumber(overview?.tongHoKhau || 0)}
                    percentage={{ color: "success", amount: "", label: "Tổng số hộ" }}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="primary"
                    icon="groups"
                    title="Nhân khẩu"
                    count={formatNumber(overview?.tongNhanKhau || 0)}
                    percentage={{ color: "success", amount: "", label: "Tổng nhân khẩu" }}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="info"
                    icon="person_add"
                    title="Tạm trú"
                    count={formatNumber(overview?.tongTamTru || 0)}
                    percentage={{ color: "success", amount: "", label: "Đang tạm trú" }}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="warning"
                    icon="person_remove"
                    title="Tạm vắng"
                    count={formatNumber(overview?.tongTamVang || 0)}
                    percentage={{ color: "warning", amount: "", label: "Đang tạm vắng" }}
                  />
                </MDBox>
              </Grid>
            </Grid>

            {/* Charts Dân cư */}
            <MDBox mt={3}>
              <Grid container spacing={3}>
                {/* Chart Hộ khẩu */}
                <Grid item xs={12} md={6} lg={4}>
                  <MDBox mb={3}>
                    <ReportsLineChart
                      color="dark"
                      title={
                        <MDBox display="flex" justifyContent="space-between" alignItems="center">
                          <span style={{ fontSize: "1rem", fontWeight: 700 }}>Hộ khẩu mới</span>
                          <TextField
                            size="small"
                            type="number"
                            value={yearFilter}
                            onChange={handleYearChange}
                            placeholder="Năm"
                            variant="outlined"
                            sx={{ width: "80px", "& .MuiInputBase-root": { height: "30px" } }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </MDBox>
                      }
                      description={`Thống kê năm ${yearFilter}`}
                      date="cập nhật mới nhất"
                      chart={hoKhauMonthData}
                    />
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={4}>
                  <MDBox mb={3}>
                    <ReportsBarChart
                      color="success"
                      title="Nhân khẩu theo độ tuổi"
                      description="Phân bố nhóm tuổi"
                      date="cập nhật mới nhất"
                      chart={ageGroupData}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <MDBox mb={3}>
                    <PieChart
                      icon={{ color: "primary", component: "people" }}
                      title="Giới tính"
                      description="Cơ cấu giới tính"
                      chart={genderData}
                    />
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>
          </MDBox>
        )}

        {/* --- NỘI DUNG TAB 1: PHẢN ÁNH --- */}
        {tabValue === 1 && (
          <MDBox>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={6}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="success"
                    icon="feedback"
                    title="Tổng số Phản ánh"
                    count={formatNumber(overview?.tongPhanAnh || 0)}
                    percentage={{ color: "success", amount: "", label: "Tổng số ý kiến người dân" }}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="error"
                    icon="warning"
                    title="Đã quá hạn xử lý"
                    count={formatNumber(overview?.phanAnhQuaHan || 0)}
                    percentage={{
                      color: "error",
                      amount: "Cảnh báo",
                      label: "Cần giải quyết ngay lập tức",
                    }}
                  />
                </MDBox>
              </Grid>
            </Grid>

            {/* Charts Phản ánh */}
            <MDBox mt={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={8}>
                  <MDBox mb={3}>
                    {/* Chart Phản ánh theo tháng */}
                    <ReportsBarChart
                      color="info"
                      title={
                        <MDBox display="flex" justifyContent="space-between" alignItems="center">
                          <span style={{ fontSize: "1rem", fontWeight: 700 }}>
                            Phản ánh theo tháng
                          </span>
                          <TextField
                            size="small"
                            type="number"
                            value={phanAnhYearFilter}
                            onChange={handlePhanAnhYearChange}
                            placeholder="Năm"
                            variant="outlined"
                            sx={{ width: "80px", "& .MuiInputBase-root": { height: "30px" } }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </MDBox>
                      }
                      description={`Thống kê năm ${phanAnhYearFilter}`}
                      date="cập nhật mới nhất"
                      chart={phanAnhMonthData}
                    />
                  </MDBox>
                </Grid>

                {/* --- CHART TRẠNG THÁI XỬ LÝ (CÓ LỌC QUÝ & NĂM - ĐÃ FIX) --- */}
                <Grid item xs={12} md={6} lg={4}>
                  <MDBox mb={3}>
                    <PieChart
                      icon={{ color: "info", component: "feedback" }}
                      // SỬA: Dùng sx để đảm bảo width 100% hoạt động, đẩy 2 phần sang 2 bên
                      title={
                        <MDBox
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          {/* Tiêu đề bên trái */}
                          <span style={{ fontSize: "1rem", fontWeight: 700 }}>Trạng thái</span>

                          {/* Cụm input bên phải */}
                          <MDBox display="flex" gap={1} alignItems="center">
                            {/* 1. Chọn Quý */}
                            <TextField
                              select
                              value={statusQuarter}
                              onChange={handleStatusQuarterChange}
                              variant="outlined"
                              size="small"
                              sx={{
                                width: "70px", // Tăng nhẹ width để số không bị che
                                "& .MuiInputBase-root": { height: "30px", fontSize: "0.875rem" },
                              }}
                              // Quan trọng: Ngăn click lan ra ngoài làm mở chart menu (nếu có)
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MenuItem value={1}>Q1</MenuItem>
                              <MenuItem value={2}>Q2</MenuItem>
                              <MenuItem value={3}>Q3</MenuItem>
                              <MenuItem value={4}>Q4</MenuItem>
                            </TextField>

                            {/* 2. Chọn Năm */}
                            <TextField
                              type="number"
                              value={statusYear}
                              onChange={handleStatusYearChange}
                              variant="outlined"
                              size="small"
                              sx={{
                                width: "80px",
                                "& .MuiInputBase-root": { height: "30px", fontSize: "0.875rem" },
                                "& .MuiOutlinedInput-input": { padding: "5px 10px" },
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </MDBox>
                        </MDBox>
                      }
                      description={`Dữ liệu Quý ${statusQuarter} / ${statusYear}`}
                      chart={statusData}
                    />
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>
          </MDBox>
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
