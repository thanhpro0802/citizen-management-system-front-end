import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getThongKeDoTuoi } from "layouts/thong-ke/services/ThongKeService";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";

const ThongKeDoTuoi = ({ color = "info" }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    getThongKeDoTuoi()
      .then((res) => {
        console.log("RAW API: ", res);
        const apiData = res.data.doTuoi;

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
      title="Thống kê độ tuổi"
      description="Đơn vị: Tuổi"
      date="Cập nhật mới nhất"
      chart={chartData}
    />
  );
};

ThongKeDoTuoi.propTypes = {
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

export default ThongKeDoTuoi;
