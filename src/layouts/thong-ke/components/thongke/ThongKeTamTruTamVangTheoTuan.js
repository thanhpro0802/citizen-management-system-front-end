import * as React from "react";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BarChart } from "@mui/x-charts/BarChart";
import { getThongKeTamTruTamVangTheoTuan } from "layouts/thong-ke/services/ThongKeService";
import { useTheme } from "@mui/material/styles";
import MDBox from "components/MDBox";

const TYPE_CONFIG = {
  TAM_TRU: {
    key: "tamTru",
    title: "Số tạm trú",
  },
  TAM_VANG: {
    key: "tamVang",
    title: "Số tạm vắng",
  },
};

const ThongKeTamTruTamVangTheoTuan = ({ type, startDate }) => {
  const [labels, setLabels] = useState([]);
  const [series, setSeries] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    getThongKeTamTruTamVangTheoTuan({ type, startDate })
      .then((res) => {
        console.log("RAW API:", res);
        const config = TYPE_CONFIG[type];
        const apiData = res.data[config.key];

        setLabels(apiData.labels);

        setSeries([
          {
            data: apiData.datasets[0].data,
            label: "Bắt đầu",
            stack: "total",
            color: theme.palette.success.main,
          },
          {
            data: apiData.datasets[1].data,
            label: "Kết thúc",
            stack: "total",
            color: theme.palette.error.main,
          },
        ]);
      })
      .catch((err) => {
        console.error("API ERROR:", err.response || err);
      });
  }, [type, startDate]);

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

ThongKeTamTruTamVangTheoTuan.propTypes = {
  type: PropTypes.oneOf(["TAM_TRU", "TAM_VANG"]).isRequired,
  startDate: PropTypes.string.isRequired,
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

export default ThongKeTamTruTamVangTheoTuan;
