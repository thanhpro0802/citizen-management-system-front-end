import React, { useState } from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
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

function ThongKe() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}></Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ThongKeDoTuoi />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}
export default ThongKe;
