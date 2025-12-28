import React, { useState } from "react";
import { Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import ButtonMenu from "./components/Button/ButtonMenu";

import ThongKePhanAnhTheoTuan from "./components/thongke/ThongKePhanAnhTheoTuan";
import ThongKeNhanKhau from "./components/thongke/ThongKeNhanKhau";
import TongNhanKhau from "./components/TongNK";
import ThongKeSoThanhVien from "./components/thongke/ThongKeSoThanhVien";
import TongHoKhau from "./components/TongHK";
import ThongKeTamTruTamVang from "./components/thongke/ThongKeTamTruTamVang";
import ThongKeTamTruTamVangTheoTuan from "./components/thongke/ThongKeTamTruTamVangTheoTuan";
import ThongKePhanAnhTheoThang from "./components/thongke/ThongKePhanAnhTheoThang";
import ThongKePhanAnhTheoQuy from "./components/thongke/ThongKePhanAnhTheoQuy";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import BasicDatePicker from "./components/Calendar/DatePicker";
import YearPicker from "./components/Calendar/YearPicker";
import ThongKeModeMenu from "./components/Menu";
import CommonMenu from "./components/Menu/CommonMenu";
import dayjs from "dayjs";
import ThongKeTamTruTheoThang from "./components/thongke/ThongKeTamTruTheoThang";
import TamTruTamVangMenu from "./components/Menu/TamTruTamVangMenu";
import TamVangTamTru from "./components/Menu/TamVangTamTruMenu";
import ThongKeTamVangTheoThang from "./components/thongke/ThongKeTamVangTheoThang";

function ThongKe() {
  const [typeNK, setTypeNK] = useState("age");
  const [typeHK, setTypeHK] = useState("mem-count");
  const [date, setDate] = useState(dayjs);
  const [mode, setMode] = useState("tamTru");
  const [datePA, setDatePA] = useState(dayjs);
  const [modePA, setModePA] = useState("week");
  const [year, setYear] = useState(dayjs().year());
  const [yearT, setYearT] = useState(dayjs().year());
  const [modeT, setModeT] = useState("week");

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
                startDate={date.format("YYYY-MM-DD")}
                color="error"
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ThongKeTamTruTamVang
                type="TAM_VANG"
                startDate={date.format("YYYY-MM-DD")}
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
                    <ThongKeModeMenu mode={modePA} onChange={setModePA} />
                  </MDBox>
                  {modePA === "week" && (
                    <BasicDatePicker
                      label="Chọn ngày"
                      value={datePA}
                      onChange={(datePA) => setDatePA(datePA)}
                    />
                  )}

                  {modePA === "month" && <YearPicker value={year} onChange={setYear} />}
                  {modePA === "quarter" && <YearPicker value={year} onChange={setYear} />}
                </MDBox>

                {/* CHART */}
                <MDBox px={2} pb={3} pt={2}>
                  {modePA === "week" && datePA && (
                    <ThongKePhanAnhTheoTuan startDate={datePA.format("YYYY-MM-DD")} />
                  )}

                  {modePA === "month" && year && <ThongKePhanAnhTheoThang year={year} />}
                  {modePA === "quarter" && year && <ThongKePhanAnhTheoQuy year={year} />}
                </MDBox>
              </Card>
            </Grid>
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
                    Thống Kê Tạm Trú / Tạm Vắng
                  </MDTypography>
                </MDBox>

                {/* FILTER */}
                <MDBox px={3} pt={2}>
                  <MDBox
                    position="absolute"
                    right={16}
                    top={46}
                    zIndex={10}
                    display="flex"
                    flexDirection="column"
                    gap={1.5}
                  >
                    <TamTruTamVangMenu mode={mode} onChange={setMode} />
                    <TamVangTamTru mode={modeT} onChange={setModeT} />
                  </MDBox>

                  <MDBox>
                    {modeT === "week" && (
                      <BasicDatePicker
                        label="Chọn ngày"
                        value={date}
                        onChange={(date) => setDate(date)}
                      />
                    )}

                    {modeT === "month" && <YearPicker value={yearT} onChange={setYearT} />}
                  </MDBox>
                </MDBox>

                {/* CHART */}
                <MDBox px={2} pb={3} pt={2}>
                  {/* TẠM TRÚ */}
                  {mode === "tamTru" && modeT === "week" && date && (
                    <ThongKeTamTruTamVangTheoTuan
                      type="TAM_TRU"
                      startDate={date.format("YYYY-MM-DD")}
                      color="error"
                    />
                  )}

                  {mode === "tamTru" && modeT === "month" && yearT && (
                    <ThongKeTamTruTheoThang year={yearT} />
                  )}

                  {/* TẠM VẮNG */}
                  {mode === "tamVang" && modeT === "week" && date && (
                    <ThongKeTamTruTamVangTheoTuan
                      type="TAM_VANG"
                      startDate={date.format("YYYY-MM-DD")}
                      color="warning"
                    />
                  )}

                  {mode === "tamVang" && modeT === "month" && yearT && (
                    <ThongKeTamVangTheoThang year={yearT} />
                  )}
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}
export default ThongKe;
