import React, { useEffect, useState } from "react";
import { getThongKeDanToc } from "layouts/thong-ke/services/thongKeService";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";

const ThongKeDanToc = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    getThongKeDanToc()
      .then((res) => {
        console.log("RAW API:", res);
        const apiData = res.data;

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
      color="info"
      title="Thống kê dân tộc"
      description="Phân bố nhân khẩu theo dân tộc"
      date="Cập nhật mới nhất"
      chart={chartData}
    />
  );
};

export default ThongKeDanToc;
