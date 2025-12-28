import * as React from "react";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BarChart } from "@mui/x-charts/BarChart";
import { getThongKeTamTruTheoThang } from "layouts/thong-ke/services/ThongKeService";
import { useTheme } from "@mui/material/styles";

const ThongKeTamTruTheoThang = ({ year }) => {
  const [labels, setLabels] = useState([]);
  const [series, setSeries] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    getThongKeTamTruTheoThang(year)
      .then((res) => {
        console.log("RAW API:", res.data);

        const apiData = res.data;

        setLabels(apiData.labels);

        setSeries([
          {
            data: apiData.datasets[0].data,
            label: "Bắt đầu",
            color: theme.palette.success.main,
          },
          {
            data: apiData.datasets[1].data,
            label: "Kết thúc",
            color: theme.palette.error.main,
          },
        ]);
      })
      .catch((err) => {
        console.error("API ERROR:", err.response || err);
      });
  }, [year, theme]);

  if (!labels.length) return null;

  return (
    <BarChart
      width={750}
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

ThongKeTamTruTheoThang.propTypes = {
  year: PropTypes.number.isRequired,
};

export default ThongKeTamTruTheoThang;
