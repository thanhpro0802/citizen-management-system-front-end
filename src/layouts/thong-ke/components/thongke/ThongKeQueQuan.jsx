import React, { useEffect, useState } from "react";
import { getThongKeQueQuan } from "../../services/ThongKeService";
import PieChart from "../charts/PieChart";

const ThongKeQueQuan = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getThongKeQueQuan()
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  return <PieChart data={data} />;
};

export default ThongKeQueQuan;
