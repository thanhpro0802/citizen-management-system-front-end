import React, { useEffect, useState } from "react";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { getTongHoKhau } from "layouts/thong-ke/services/ThongKeService";

const TongHoKhau = () => {
  const [tong, setTong] = useState(0);

  useEffect(() => {
    getTongHoKhau()
      .then((res) => {
        setTong(res.data.tong);
      })
      .catch((err) => {
        console.error("Lỗi lấy tổng nhân khẩu:", err);
      });
  }, []);

  return (
    <ComplexStatisticsCard
      color="success"
      icon="house"
      title="Tổng hộ khẩu"
      count={tong}
      percentage={{
        color: "success",
        amount: "",
        label: "mới cập nhật",
      }}
    />
  );
};

export default TongHoKhau;
