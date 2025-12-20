import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getThongKeGioiTinh } from "layouts/thong-ke/services/thongKeService";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";

const ThongKeGioiTinh = ({ color = "info" }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    getThongKeGioiTinh()
      .then((res) => {
        console.log("RAW API: ", res);
        const apiData = res.data.gioiTinh;

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
      color={color}
      title="Thống kê giới tính"
      description="Giới tính: Nam / Nữ"
      date="Cập nhật mới nhất"
      chart={chartData}
    />
  );
};

ThongKeGioiTinh.propTypes = {
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
};

export default ThongKeGioiTinh;
