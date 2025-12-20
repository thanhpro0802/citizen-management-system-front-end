import React, { useState } from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import MDBox from "components/MDBox";
import ButtonMenu from "./components/ButtonMenu";
import ThongKeDoTuoi from "./components/thongke/ThongKeDoTuoi";
import ThongKeGioiTinh from "./components/thongke/ThongKeGioiTinh";
import ThongKeQueQuan from "./components/thongke/ThongKeQueQuan";
import ThongKeSoThanhVien from "./components/thongke/ThongKeSoThanhVien";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import TongNhanKhau from "./components/TongNK";
import TongHoKhau from "./components/TongHK";
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

function ThongKe() {
  const [typeNK, setTypeNK] = useState("age");
  const [typeHK, setTypeHK] = useState("mem-count");

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* Phần đầu */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            <MDBox mb={1.5}>
              <TongNhanKhau />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
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
                      { value: "age", label: "Thống kê độ tuổi" },
                      { value: "gender", label: "Thống kê giới tính" },
                      { value: "province", label: "Thống kê quê quán" },
                    ]}
                    onSelect={(value) => setTypeNK(value)}
                  />
                </MDBox>

                {typeNK === "age" && <ThongKeDoTuoi />}
                {typeNK === "gender" && <ThongKeGioiTinh />}
                {typeNK === "province" && <ThongKeQueQuan />}
              </MDBox>
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <MDBox position="relative" mb={3}>
                <MDBox position="absolute" bottom={12} right={16} zIndex={10}>
                  <ButtonMenu
                    color="success"
                    title="Chọn thống kê"
                    items={[
                      { value: "mem-count", label: "Thống kê số thành viên" },
                      { value: "gender", label: "Thống kê giới tính" },
                      { value: "province", label: "Thống kê quê quán" },
                    ]}
                    onSelect={(value) => setTypeHK(value)}
                  />
                </MDBox>

                {typeHK === "mem-count" && <ThongKeSoThanhVien color="success" />}
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        {/* Phần dưới */}
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}
export default ThongKe;
