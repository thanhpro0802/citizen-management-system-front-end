/* eslint-disable react/prop-types */
// --- THÊM DÒNG NÀY ĐỂ SỬA LỖI toBeInTheDocument ---
import "@testing-library/jest-dom";
// --------------------------------------------------

import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "layouts/dashboard";
import statisticsService from "services/statisticsService";
import { BrowserRouter } from "react-router-dom";
import { MaterialUIControllerProvider } from "context";
import { ThemeProvider } from "@mui/material/styles";
import theme from "assets/theme";

// 1. Mock service
jest.mock("services/statisticsService");

// 2. Mock các component con
jest.mock("examples/LayoutContainers/DashboardLayout", () => ({ children }) => (
  <div data-testid="dashboard-layout">{children}</div>
));
jest.mock("examples/Navbars/DashboardNavbar", () => () => <div>Navbar</div>);
jest.mock("examples/Footer", () => () => <div>Footer</div>);
jest.mock("examples/Charts/BarCharts/ReportsBarChart", () => () => <div>Mock Bar Chart</div>);
jest.mock("examples/Charts/LineCharts/ReportsLineChart", () => () => <div>Mock Line Chart</div>);
jest.mock("examples/Charts/PieChart", () => () => <div>Mock Pie Chart</div>);

describe("Dashboard Component Integration Test", () => {
  const mockOverviewData = {
    tongHoKhau: 1234,
    tongNhanKhau: 5678,
    tongPhanAnh: 99,
    phanAnhDangXuLy: 5,
    phanAnhHoanThanh: 90,
    phanAnhQuaHan: 4,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    statisticsService.getOverview.mockResolvedValue({ data: mockOverviewData });
    statisticsService.getNhanKhauByGioiTinh.mockResolvedValue({ data: {} });
    statisticsService.getNhanKhauByDoTuoi.mockResolvedValue({ data: {} });
    statisticsService.getPhanAnhByTrangThai.mockResolvedValue({ data: {} });
    statisticsService.getPhanAnhByMonth.mockResolvedValue({ data: {} });
    statisticsService.getHoKhauByMonth.mockResolvedValue({ data: {} });
  });

  test("Phải hiển thị đúng số liệu từ API (Tìm lỗi lệch tên biến)", async () => {
    render(
      <MaterialUIControllerProvider>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Dashboard />
          </BrowserRouter>
        </ThemeProvider>
      </MaterialUIControllerProvider>
    );

    await waitFor(() => {
      const hoKhauElement = screen.queryByText("1,234");
      if (!hoKhauElement) {
        // Nếu dòng này chạy -> CODE FE ĐANG SAI (đây là điều chúng ta muốn tìm)
        throw new Error(
          "LỖI TÌM THẤY: Giao diện không hiển thị số '1,234'. Có thể do FE đang dùng sai tên biến (tongSoHoKhau thay vì tongHoKhau)."
        );
      }
      expect(hoKhauElement).toBeInTheDocument();

      const nhanKhauElement = screen.queryByText("5,678");
      if (!nhanKhauElement) {
        throw new Error(
          "LỖI TÌM THẤY: Giao diện không hiển thị số '5,678'. Kiểm tra biến tongNhanKhau."
        );
      }
      expect(nhanKhauElement).toBeInTheDocument();

      expect(screen.getByText("99")).toBeInTheDocument();
    });
  });
});
