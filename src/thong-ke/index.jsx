import React, { useState } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { tokens } from '../theme'
import Header from './components/Header'
import ButtonMenu from './components/ButtonMenu'
import ThongKeDoTuoi from './components/thongke/ThongKeDoTuoi'
import ThongKeGioiTinh from './components/thongke/ThongKeGioiTinh'
import ThongKeQueQuan from './components/thongke/ThongKeQueQuan'
import ThongKeSoLuong from './components/thongke/ThongKeSoLuong'

const ThongKe = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [typeNK, setTypeNK] = useState("age");
  const [typeHK, setTypeHK] = useState("mem-count");

  return (
    <Box m="20px">
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Header title="THỐNG KÊ" subtitle="Nhân khẩu & Hộ khẩu" />
        </Box>

        {/* GRID & CHARTS */}
        <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gridAutoRows="500px"
            gap="20px"
        >
            {/* ROW 1 */}
            {/* Thống kê Nhân khẩu */}
            <Box
                gridColumn="span 6"
                backgroundColor={colors.primary[400]}
                display="flex"
                flexDirection="column"
                alignItems="flex-end"
                justifyContent="center"
                borderRadius={8}
                p={3}
            >   
                <Box alignSelf="flex-start" mb={1}>
                    <Typography variant="h2" fontWeight="bold">
                        Nhân khẩu
                    </Typography>
                </Box>
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

            </Box>
            
            {/* Thống kê Hộ khẩu */}
            <Box
                gridColumn="span 6"
                backgroundColor={colors.primary[400]}
                display="flex"
                flexDirection="column"
                alignItems="flex-end"
                justifyContent="center"
                borderRadius={8}
                
                p={3}
            >   
                <Box alignSelf="flex-start" mb={1}>
                    <Typography variant="h2" fontWeight="bold">
                        Hộ khẩu
                    </Typography>
                </Box>
                <ButtonMenu
                    title="Chọn thống kê"
                    items={[
                        { value: "mem-count", label: "Thống kê số lượng" },
                    ]}
                    onSelect={(value) => setTypeHK(value)}
                />

                {typeHK === "mem-count" && <ThongKeSoLuong />}
            </Box>

        </Box>
    </Box>
  )
}

export default ThongKe