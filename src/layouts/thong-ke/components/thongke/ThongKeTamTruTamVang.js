import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { getThongKeTamTruTamVang } from "layouts/thong-ke/services/ThongKeService";
import dayjs from "dayjs";

const TYPE_CONFIG = {
  TAM_TRU: {
    key: "tamTru",
    title: "Số tạm trú",
  },
  TAM_VANG: {
    key: "tamVang",
    title: "Số tạm vắng",
  },
};

const ThongKeTamTruTamVang = ({ type, startDate, color }) => {
  const [tong, setTong] = useState(0);

  useEffect(() => {
    getThongKeTamTruTamVang({ type, startDate })
      .then((res) => {
        console.log("RAW API:", res);
        const config = TYPE_CONFIG[type];
        setTong(res.data[config.key]);
      })
      .catch((err) => {
        console.error("Lỗi lấy số tạm trú / tạm vắng", err);
      });
  }, [type, startDate]);

  return (
    <ComplexStatisticsCard
      color={color}
      icon="home"
      title={TYPE_CONFIG[type].title}
      count={tong}
      percentage={{
        color: "success",
        amount: "",
        label: `Cập nhật ngày ${dayjs(startDate).format("DD/MM/YYYY")}`,
      }}
    />
  );
};

ThongKeTamTruTamVang.propTypes = {
  type: PropTypes.oneOf(["TAM_TRU", "TAM_VANG"]).isRequired,
  startDate: PropTypes.string.isRequired,
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
};

export default ThongKeTamTruTamVang;
