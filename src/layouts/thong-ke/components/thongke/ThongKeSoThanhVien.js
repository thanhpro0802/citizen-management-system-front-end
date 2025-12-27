import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getThongKeSoThanhVien } from "layouts/thong-ke/services/ThongKeService";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";

const ThongKeSoThanhVien = ({ color }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    getThongKeSoThanhVien()
      .then((res) => {
        console.log("RAW API:", res);
        const apiData = res.data.soThanhVien;

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
  }, []);

  if (!chartData) return null;

  return (
    <ReportsBarChart
      color={color || "info"}
      title="Thống kê số thành viên"
      description="Đơn vị: Người"
      date="Cập nhật mới nhất"
      chart={chartData}
    />
  );
};

ThongKeSoThanhVien.propTypes = {
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
  title: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  onSelect: PropTypes.func.isRequired,
};

export default ThongKeSoThanhVien;
