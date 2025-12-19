import React, { useEffect, useState } from "react";
import { getThongKeDoTuoi } from "../../services/ThongKeService";
import PieChart from "examples/Charts/PieChart";
import DoTuoiData from "layouts/thong-ke/services/DoTuoiData";

const ThongKeDoTuoi = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    console.log("USE EFFECT RUN");
    getThongKeDoTuoi()
      .then((res) => {
        console.log("RAW API:", res);
        const apiData = res.data;

        setChartData({
          labels: apiData.labels,
          datasets: [
            {
              label: "Thống kê độ tuổi",
              data: apiData.datasets[0].data,
              backgroundColors: ["info", "success", "warning", "error"],
            },
          ],
        });
      })
      .catch((err) => {
        console.error(err);
        console.error("API ERROR:", err);
        console.error("API ERROR:", err.response || err);
      });
  }, []);

  //console.log("API:", chartData);

  if (!chartData) return null;

  return (
    <PieChart
      icon="groups"
      title="Thống kê độ tuổi"
      description="Phân bố nhân khẩu theo độ tuổi"
      height={220}
      chart={DoTuoiData}
    />
  );
};

export default ThongKeDoTuoi;
