import React, { useEffect, useState } from "react";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { getTongNhanKhau } from "layouts/thong-ke/services/thongKeService";

const TongHoKhau = () => {
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
      color="success"
      icon="house"
      title="Tổng hộ khẩu"
      count={10}
      percentage={{
        color: "success",
        amount: "",
        label: "mới cập nhật",
      }}
    />
  );
};

export default TongHoKhau;
