import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { getThongKeNhanKhau } from "layouts/thong-ke/services/ThongKeService";

const TongNhanKhau = ({ type }) => {
  const [tong, setTong] = useState(0);

  useEffect(() => {
    getThongKeNhanKhau(type)
      .then((res) => {
        console.log("RAW API:", res);
        setTong(res.data.tong);
      })
      .catch((err) => {
        console.error("Lỗi lấy tổng nhân khẩu:", err);
      });
  }, [type]);

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

TongNhanKhau.propTypes = {
  type: PropTypes.string.isRequired,
};

export default TongNhanKhau;
