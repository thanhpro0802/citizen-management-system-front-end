import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import PieChart from '../components/charts/PieChart';

export default function Dashboard() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Thống kê tổng quan nhân khẩu
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Thống kê độ tuổi</Typography>
            <PieChart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Thống kê giới tính</Typography>
            {/* Thêm biểu đồ hoặc số liệu */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Thống kê quê quán</Typography>
            {/* Thêm biểu đồ hoặc số liệu */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
