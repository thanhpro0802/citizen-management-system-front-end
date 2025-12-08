import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getThongKe } from "../services/ThongKeService";

ChartJS.register(ArcElement, Tooltip, Legend);

const ThongKeComponent = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    getThongKe()
      .then(res => {
        const labels = Object.keys(res.data);
        const values = Object.values(res.data);
 
        setChartData({
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: [
                "#36A2EB",
                "#FF6384",
                "#FFCE56",
                "#4BC0C0",
                "#4BC0C1"
              ]
            }
          ]
        });
      });
  }, []);

  if (!chartData) return <div>Đang tải...</div>;

  return <Pie data={chartData} />;
}

export default ThongKeComponent