import React, { useEffect, useState } from "react";
import { getThongKeDanToc } from "layouts/thong-ke/services/thongKeService";
import PieChart from "examples/Charts/PieChart";
import DoTuoiData from "layouts/thong-ke/services/DoTuoiData";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";

const ThongKeDanToc = () => {
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
      color="info"
      title="Thống kê dân tộc"
      description="Phân bố nhân khẩu theo dân tộc"
      date="2 years ago"
      chart={DoTuoiData}
    />
  );
};

export default ThongKeDanToc;
