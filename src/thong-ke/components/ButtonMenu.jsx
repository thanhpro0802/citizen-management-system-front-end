import React, { useState } from "react";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
import { Button, Menu, MenuItem } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";

const ButtonMenu = ({ title = "Menu", items = [], onSelect }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <Button 
        variant="contained"
        color={colors.primary[100]}
        onClick={handleClick}
        startIcon={<BarChartIcon />}
      >
        {title}
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {items.map((item) => (
          <MenuItem key={item.value} onClick={() => { onSelect(item.value); handleClose(); }}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ButtonMenu;
