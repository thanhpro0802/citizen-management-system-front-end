import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import { getThongKeNhanKhau } from "layouts/thong-ke/services/ThongKeService";

const TYPE_CONFIG = {
  DO_TUOI: {
    key: "doTuoi",
    title: "Thống kê độ tuổi",
    description: "Đơn vị: Tuổi",
  },
  GIOI_TINH: {
    key: "gioiTinh",
    title: "Thống kê giới tính",
    description: "Đơn vị: Người",
  },
  QUE_QUAN: {
    key: "queQuan",
    title: "Thống kê quê quán",
    description: "Đơn vị: Người",
  },
};

const ThongKeNhanKhau = ({ type, color = "info" }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!TYPE_CONFIG[type]) return;

    getThongKeNhanKhau(type)
      .then((res) => {
        const config = TYPE_CONFIG[type];
        const apiData = res.data[config.key];

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
  }, [type]);

  if (!chartData) return null;

  return (
    <ReportsBarChart
      color={color}
      title={TYPE_CONFIG[type].title}
      description={TYPE_CONFIG[type].description}
      date="Cập nhật mới nhất"
      chart={chartData}
    />
  );
};

ThongKeNhanKhau.propTypes = {
  type: PropTypes.oneOf(["DO_TUOI", "GIOI_TINH", "QUE_QUAN"]).isRequired,
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

export default ThongKeNhanKhau;
