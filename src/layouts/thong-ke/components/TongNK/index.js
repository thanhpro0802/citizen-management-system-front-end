import React, { useEffect, useState } from "react";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { getTongNhanKhau } from "layouts/thong-ke/services/thongKeService";

const TongNhanKhau = () => {
  const [tong, setTong] = useState(0);

  useEffect(() => {
    getTongNhanKhau()
      .then((res) => {
        setTong(res.data.tong);
      })
      .catch((err) => {
        console.error("Lỗi lấy tổng nhân khẩu:", err);
      });
  }, []);

  return (
    <ComplexStatisticsCard
      color="info"
      icon="groups"
      title="Tổng nhân khẩu"
      count={tong}
      percentage={{
        color: "success",
        amount: "",
        label: "mới cập nhật",
      }}
    />
  );
};

export default TongNhanKhau;
