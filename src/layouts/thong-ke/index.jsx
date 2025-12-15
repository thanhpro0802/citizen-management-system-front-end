import React, { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { tokens } from "theme";
import Header from "./components/Header";
import ButtonMenu from "./components/ButtonMenu";
import ThongKeDoTuoi from "./components/thongke/ThongKeDoTuoi";
import ThongKeGioiTinh from "./components/thongke/ThongKeGioiTinh";
import ThongKeQueQuan from "./components/thongke/ThongKeQueQuan";
import ThongKeSoLuong from "./components/thongke/ThongKeSoLuong";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const ThongKe = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [typeNK, setTypeNK] = useState("age");
  const [typeHK, setTypeHK] = useState("mem-count");

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox m="20px">
        {/* HEADER */}
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <Header title="THỐNG KÊ" subtitle="Nhân khẩu & Hộ khẩu" />
        </MDBox>

        {/* GRID & CHARTS */}
        <MDBox display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="500px" gap="20px">
          {/* ROW 1 */}
          {/* Thống kê Nhân khẩu */}
          <MDBox
            gridColumn="span 6"
            backgroundColor={colors.primary[400]}
            display="flex"
            flexDirection="column"
            alignItems="flex-end"
            justifyContent="center"
            borderRadius={8}
            p={3}
          >
            <MDBox alignSelf="flex-start" mb={1}>
              <MDTypography variant="h2" fontWeight="bold">
                Nhân khẩu
              </MDTypography>
            </MDBox>
            <ButtonMenu
              title="Chọn thống kê"
              items={[
                { value: "age", label: "Thống kê độ tuổi" },
                { value: "gender", label: "Thống kê giới tính" },
                { value: "province", label: "Thống kê quê quán" },
              ]}
              onSelect={(value) => setTypeNK(value)}
            />

            {typeNK === "age" && <ThongKeDoTuoi />}
            {typeNK === "gender" && <ThongKeGioiTinh />}
            {typeNK === "province" && <ThongKeQueQuan />}
          </MDBox>

          {/* Thống kê Hộ khẩu */}
          <MDBox
            gridColumn="span 6"
            backgroundColor={colors.primary[400]}
            display="flex"
            flexDirection="column"
            alignItems="flex-end"
            justifyContent="center"
            borderRadius={8}
            p={3}
          >
            <MDBox alignSelf="flex-start" mb={1}>
              <MDTypography variant="h2" fontWeight="bold">
                Hộ khẩu
              </MDTypography>
            </MDBox>
            <ButtonMenu
              title="Chọn thống kê"
              items={[{ value: "mem-count", label: "Thống kê số lượng" }]}
              onSelect={(value) => setTypeHK(value)}
            />

            {typeHK === "mem-count" && <ThongKeSoLuong />}
          </MDBox>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
};

export default ThongKe;
