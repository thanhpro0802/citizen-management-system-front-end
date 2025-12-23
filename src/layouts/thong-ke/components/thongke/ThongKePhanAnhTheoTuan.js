import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import StackedBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import { getThongKePhanAnhTheoTuan } from "layouts/thong-ke/services/ThongKeService";

const ThongKePhanAnhTheoTuan = ({ startDate }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    getThongKePhanAnhTheoTuan(startDate)
      .then((res) => {
        console.log("RAW API:", res);
        const apiData = res.data;
        // console.log("choXuLy:", apiData.datasets[1].data);

        setChartData({
          labels: apiData.labels,
          datasets: [
            {
              label: "Chờ xử lý",
              data: apiData.datasets[0].data,
              backgroundColor: "rgba(244, 67, 54, 0.8)",
            },
            {
              label: "Đang xử lý",
              data: apiData.datasets[1].data,
              backgroundColor: "rgba(255, 193, 7, 0.8)",
            },
            {
              label: "Đã xử lý",
              data: apiData.datasets[2].data,
              backgroundColor: "rgba(76, 175, 80, 0.8)",
            },
          ],
        });
      })
      .catch((err) => {
        console.error("API ERROR:", err.response || err);
      });
  }, [startDate]);

  if (!chartData) return null;

  return (
    <StackedBarChart
      color="info"
      title="Thống kê phản ánh theo tuần"
      description="Phân loại theo trạng thái"
      date="Cập nhật mới nhất"
      chart={chartData}
    />
  );
};

ThongKePhanAnhTheoTuan.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  startDate: PropTypes.string.isRequired,
};

export default ThongKePhanAnhTheoTuan;
