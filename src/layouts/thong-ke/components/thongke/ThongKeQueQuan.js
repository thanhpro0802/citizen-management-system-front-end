import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getThongKeQueQuan } from "layouts/thong-ke/services/ThongKeService";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";

const ThongKeQueQuan = ({ color = "info" }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    getThongKeQueQuan()
      .then((res) => {
        console.log("RAW API: ", res);
        const apiData = res.data.queQuan;

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
      title="Thống kê quê quán"
      description="Cấp: Tỉnh / Thành phố"
      date="Cập nhật mới nhất"
      chart={chartData}
    />
  );
};

ThongKeQueQuan.propTypes = {
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

export default ThongKeQueQuan;
