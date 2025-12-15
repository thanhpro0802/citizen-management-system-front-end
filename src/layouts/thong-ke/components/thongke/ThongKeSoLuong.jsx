import React, { useEffect, useState } from "react";
import { getThongKeSoLuong } from "../../services/ThongKeService";
import PieChart from "../charts/PieChart";

const ThongKeSoLuong = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getThongKeSoLuong()
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  return <PieChart data={data} />;
};

export default ThongKeSoLuong;
