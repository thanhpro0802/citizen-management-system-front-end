import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getThongKeGioiTinh } from "layouts/thong-ke/services/thongKeService";
import PieChart from "examples/Charts/PieChart";
import DoTuoiData from "layouts/thong-ke/services/DoTuoiData";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";

const ThongKeGioiTinh = ({ color }) => {
  // const [chartData, setChartData] = useState(null);

  // useEffect(() => {
  //   console.log("USE EFFECT RUN");
  //   getThongKeDoTuoi()
  //     .then((res) => {
  //       console.log("RAW API:", res);
  //       const apiData = res.data;

  //       setChartData({
  //         labels: apiData.labels,
  //         datasets: [
  //           {
  //             label: "Thống kê độ tuổi",
  //             data: apiData.datasets[0].data,
  //             backgroundColors: ["info", "success", "warning", "error"],
  //           },
  //         ],
  //       });
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       console.error("API ERROR:", err);
  //       console.error("API ERROR:", err.response || err);
  //     });
  // }, []);

  // //console.log("API:", chartData);

  // if (!chartData) return null;

  return (
    <ReportsBarChart
      color={color || "info"}
      title="Thống kê giới tính"
      description="Giới tính: Nam/Nữ"
      date="2 years ago"
      chart={DoTuoiData}
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
  title: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  onSelect: PropTypes.func.isRequired,
};

export default ThongKeGioiTinh;
