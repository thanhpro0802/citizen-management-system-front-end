import * as React from "react";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BarChart } from "@mui/x-charts/BarChart";
import { getThongKePhanAnhTheoThang } from "layouts/thong-ke/services/ThongKeService";
import { useTheme } from "@mui/material/styles";
import MDBox from "components/MDBox";

const ThongKePhanAnhTheoThang = ({ year }) => {
  const [labels, setLabels] = useState([]);
  const [series, setSeries] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    getThongKePhanAnhTheoThang(year)
      .then((res) => {
        const apiData = res.data;

        setLabels(apiData.labels);

        setSeries([
          {
            data: apiData.datasets[0].data,
            label: "Chờ xử lý",
            stack: "total",
            color: theme.palette.error.main,
          },
          {
            data: apiData.datasets[1].data,
            label: "Đang xử lý",
            stack: "total",
            color: theme.palette.warning.main,
          },
          {
            data: apiData.datasets[2].data,
            label: "Đã xử lý",
            stack: "total",
            color: theme.palette.success.main,
          },
        ]);
      })
      .catch((err) => {
        console.error("API ERROR:", err.response || err);
      });
  }, [year]);

  if (!labels.length) return null;

  return (
    <MDBox
      width="100%"
      sx={{
        overflowX: "auto",
      }}
    >
      <BarChart
        height={350}
        series={series}
        xAxis={[
          {
            data: labels,
            scaleType: "band",
          },
        ]}
        sx={{ width: "100%" }}
      />
    </MDBox>
  );
};

ThongKePhanAnhTheoThang.propTypes = {
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
  year: PropTypes.string.isRequired,
};

export default ThongKePhanAnhTheoThang;
