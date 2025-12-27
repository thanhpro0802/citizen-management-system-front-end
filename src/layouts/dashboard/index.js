// React hooks
import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

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
  const [overview, setOverview] = useState(null);
  const [nhanKhauByGioiTinh, setNhanKhauByGioiTinh] = useState({});
  const [nhanKhauByDoTuoi, setNhanKhauByDoTuoi] = useState({});
  const [phanAnhByTrangThai, setPhanAnhByTrangThai] = useState({});
  const [phanAnhByMonth, setPhanAnhByMonth] = useState({});
  const [hoKhauByMonth, setHoKhauByMonth] = useState({});

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentYear = new Date().getFullYear();

      const [overviewRes, gioiTinhRes, doTuoiRes, trangThaiRes, phanAnhMonthRes, hoKhauMonthRes] =
        await Promise.all([
          statisticsService.getOverview(),
          statisticsService.getNhanKhauByGioiTinh(),
          statisticsService.getNhanKhauByDoTuoi(),
          statisticsService.getPhanAnhByTrangThai(),
          statisticsService.getPhanAnhByMonth(currentYear),
          statisticsService.getHoKhauByMonth(currentYear),
        ]);

      setOverview(overviewRes.data);
      setNhanKhauByGioiTinh(gioiTinhRes.data);
      setNhanKhauByDoTuoi(doTuoiRes.data);
      setPhanAnhByTrangThai(trangThaiRes.data);
      setPhanAnhByMonth(phanAnhMonthRes.data);
      setHoKhauByMonth(hoKhauMonthRes.data);
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Format data for monthly charts
  const formatMonthlyData = (data) => {
    const months = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
    const values = months.map((_, index) => data[index + 1] || 0);
    return { labels: months, datasets: { label: "Số lượng", data: values } };
  };

  // Format data for gender pie chart
  const formatGenderData = (data) => {
    const labels = [];
    const values = [];
    const colors = [];

    if (data.NAM) {
      labels.push("Nam");
      values.push(data.NAM);
      colors.push("info");
    }
    if (data.NU) {
      labels.push("Nữ");
      values.push(data.NU);
      colors.push("error");
    }

    return {
      labels,
      datasets: {
        label: "Số người",
        data: values,
        backgroundColors: colors,
      },
    };
  };

  // Format data for age group bar chart
  const formatAgeGroupData = (data) => {
    const labels = [];
    const values = [];

    // Sort by age group order
    const sortedEntries = Object.entries(data).sort((a, b) => {
      const order = ["0-17", "18-35", "36-60", "61+"];
      return order.indexOf(a[0]) - order.indexOf(b[0]);
    });

    sortedEntries.forEach(([key, value]) => {
      labels.push(key);
      values.push(value);
    });

    return {
      labels,
      datasets: {
        label: "Số người",
        data: values,
      },
    };
  };

  // Format data for status pie chart
  const formatStatusData = (data) => {
    const statusMap = {
      CHO_XU_LY: { label: "Chờ xử lý", color: "warning" },
      DANG_XU_LY: { label: "Đang xử lý", color: "info" },
      DA_XU_LY: { label: "Đã xử lý", color: "success" },
      TU_CHOI: { label: "Từ chối", color: "error" },
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

    return {
      labels,
      datasets: {
        label: "Số phản ánh",
        data: values,
        backgroundColors: colors,
      },
    };
  };

  // Format number with commas
  const formatNumber = (num) => {
    if (num === null || num === undefined) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

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
          <MDBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="60vh"
            flexDirection="column"
          >
            <MDTypography variant="h5" color="error" mb={2}>
              {error}
            </MDTypography>
            <MDTypography
              variant="button"
              color="info"
              sx={{ cursor: "pointer" }}
              onClick={fetchStatistics}
            >
              Thử lại
            </MDTypography>
          </MDBox>
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
        {/* Statistics Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="home"
                title="Tổng số Hộ khẩu"
                count={formatNumber(overview?.tongSoHoKhau || 0)}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Tổng số hộ trong hệ thống",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="people"
                title="Tổng số Nhân khẩu"
                count={formatNumber(overview?.tongSoNhanKhau || 0)}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Tổng số người trong hệ thống",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="feedback"
                title="Tổng số Phản ánh"
                count={formatNumber(overview?.tongSoPhanAnh || 0)}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Tổng số phản ánh",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon="pending_actions"
                title="Phản ánh đang xử lý"
                count={formatNumber(overview?.phanAnhDangXuLy || 0)}
                percentage={{
                  color: "warning",
                  amount: "",
                  label: "Cần xử lý",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>

        {/* Charts Row 1 */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Phản ánh theo tháng"
                  description={`Thống kê phản ánh năm ${currentYear}`}
                  date="cập nhật mới nhất"
                  chart={phanAnhMonthData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <PieChart
                  icon={{ color: "primary", component: "people" }}
                  title="Nhân khẩu theo giới tính"
                  description="Phân bố giới tính"
                  chart={genderData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <PieChart
                  icon={{ color: "info", component: "feedback" }}
                  title="Phản ánh theo trạng thái"
                  description="Phân loại trạng thái xử lý"
                  chart={statusData}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        {/* Charts Row 2 */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="success"
                  title="Nhân khẩu theo độ tuổi"
                  description="Phân bố theo nhóm tuổi"
                  date="cập nhật mới nhất"
                  chart={ageGroupData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Hộ khẩu đăng ký theo tháng"
                  description={`Thống kê hộ khẩu năm ${currentYear}`}
                  date="cập nhật mới nhất"
                  chart={hoKhauMonthData}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
