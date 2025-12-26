import React, { useEffect, useState } from "react";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import { getThongKePhanAnh } from "layouts/thong-ke/services/ThongKeService";
import PropTypes from "prop-types";

const ThongKePhanAnh = ({ color = "warning", startDate }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    getThongKePhanAnh(startDate)
      .then((res) => {
        console.log("RAW API: ", res);
        const apiData = res.data.ngay;

        setChartData({
          labels: apiData.labels,
          datasets: {
            label: apiData.datasets.label,
            data: apiData.datasets.data,
          },
        });
      })
      .catch((err) => {
        console.error("API ERROR:", err.response || err);
      });
  }, [startDate]);

  if (!chartData) return null;

  return (
    <ReportsBarChart
      color={color}
      title="Thống kê phản ánh"
      description={`Từ ngày ${startDate}`}
      date="Cập nhật mới nhất"
      chart={chartData}
    />
  );
};

ThongKePhanAnh.propTypes = {
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

export default ThongKePhanAnh;
