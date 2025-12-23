import * as React from "react";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BarChart } from "@mui/x-charts/BarChart";
import { getThongKePhanAnhTheoTuan } from "layouts/thong-ke/services/ThongKeService";

const ThongKePhanAnhTheoTuan = ({ startDate }) => {
  const [labels, setLabels] = useState([]);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    getThongKePhanAnhTheoTuan(startDate)
      .then((res) => {
        const apiData = res.data;

        setLabels(apiData.labels);

        setSeries([
          {
            data: apiData.datasets[0].data,
            label: "Chờ xử lý",
            stack: "total",
          },
          {
            data: apiData.datasets[1].data,
            label: "Đang xử lý",
            stack: "total",
          },
          {
            data: apiData.datasets[2].data,
            label: "Đã xử lý",
            stack: "total",
          },
        ]);
      })
      .catch((err) => {
        console.error("API ERROR:", err.response || err);
      });
  }, [startDate]);

  if (!labels.length) return null;

  return (
    <BarChart
      width={600}
      height={350}
      series={series}
      xAxis={[
        {
          data: labels,
          scaleType: "band",
        },
      ]}
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
