import React, { useState } from "react";
import { Box, Card, Grid, Typography, useTheme } from "@mui/material";
import MDBox from "components/MDBox";
import ButtonMenu from "./components/Button/ButtonMenu";

import ThongKePhanAnh from "./components/thongke/ThongKePhanAnh";
import ThongKePhanAnhTheoTuan from "./components/thongke/ThongKePhanAnhTheoTuan";
import ThongKeNhanKhau from "./components/thongke/ThongKeNhanKhau";
import TongNhanKhau from "./components/TongNK";
import ThongKeSoThanhVien from "./components/thongke/ThongKeSoThanhVien";
import TongHoKhau from "./components/TongHK";
import ThongKeTamTruTamVang from "./components/thongke/ThongKeTamTruTamVang";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import dayjs from "dayjs";
import BasicDatePicker from "./components/Calendar/DatePicker";
import YearPicker from "./components/Calendar/YearPicker";
import ThongKePhanAnhTheoNam from "./components/thongke/ThongKePhanAnhTheoNam";
import ThongKeModeMenu from "./components/Menu";
import MDTypography from "components/MDTypography";

function ThongKe() {
  const [typeNK, setTypeNK] = useState("age");
  const [typeHK, setTypeHK] = useState("mem-count");
  const [startDate, setStartDate] = useState(dayjs);
  const [mode, setMode] = useState("week");
  const [year, setYear] = useState(dayjs().year());

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* Phần đầu */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <TongNhanKhau type="TONG_NK" />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ThongKeTamTruTamVang
                type="TAM_TRU"
                startDate={startDate.format("YYYY-MM-DD")}
                color="error"
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ThongKeTamTruTamVang
                type="TAM_VANG"
                startDate={startDate.format("YYYY-MM-DD")}
                color="dark"
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <TongHoKhau />
            </MDBox>
          </Grid>
        </Grid>

        {/* Phần giữa */}
        <MDBox mt={4.5}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox position="relative" mb={3}>
                <MDBox position="absolute" bottom={12} right={16} zIndex={10}>
                  <ButtonMenu
                    color="info"
                    title="Chọn thống kê"
                    items={[
                      { value: "age", label: "Độ tuổi" },
                      { value: "gender", label: "Giới tính" },
                      { value: "province", label: "Quê quán" },
                    ]}
                    onSelect={(value) => setTypeNK(value)}
                  />
                </MDBox>

                {typeNK === "age" && <ThongKeNhanKhau type={"DO_TUOI"} />}
                {typeNK === "gender" && <ThongKeNhanKhau type={"GIOI_TINH"} />}
                {typeNK === "province" && <ThongKeNhanKhau type={"QUE_QUAN"} />}
              </MDBox>
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <MDBox position="relative" mb={3}>
                <MDBox position="absolute" bottom={12} right={16} zIndex={10}>
                  <ButtonMenu
                    color="success"
                    title="Chọn thống kê"
                    items={[{ value: "mem-count", label: "Số thành viên" }]}
                    onSelect={(value) => setTypeHK(value)}
                  />
                </MDBox>

                {typeHK === "mem-count" && <ThongKeSoThanhVien color="success" />}
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <Card>
                {/* HEADER */}
                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  px={3}
                  pt={3}
                >
                  <MDTypography variant="h6" fontWeight="medium">
                    Thống Kê Phản Ánh
                  </MDTypography>
                </MDBox>

                {/* FILTER */}
                <MDBox px={3} pt={2}>
                  <MDBox position="absolute" right={16} zIndex={10}>
                    <ThongKeModeMenu mode={mode} onChange={setMode} />
                  </MDBox>
                  {mode === "week" && (
                    <BasicDatePicker
                      label="Chọn ngày"
                      value={startDate}
                      onChange={(date) => setStartDate(date)}
                    />
                  )}

                  {mode === "year" && <YearPicker value={year} onChange={setYear} />}
                </MDBox>

                {/* CHART */}
                <MDBox px={2} pb={3} pt={2}>
                  {mode === "week" && startDate && (
                    <ThongKePhanAnhTheoTuan startDate={startDate.format("YYYY-MM-DD")} />
                  )}

                  {mode === "year" && year && <ThongKePhanAnhTheoNam year={year} />}
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>

        {/* Phần dưới */}
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              {/* <Projects /> */}
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              {/* <OrdersOverview /> */}
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}
export default ThongKe;
