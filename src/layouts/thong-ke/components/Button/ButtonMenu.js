import React, { useState } from "react";
import PropTypes from "prop-types";
import { Menu, MenuItem } from "@mui/material";
import MDButton from "components/MDButton";
import BarChartIcon from "@mui/icons-material/BarChart";

const ButtonMenu = ({ color, title = "Menu", items = [], onSelect }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <MDButton color={color} variant="outlined" onClick={handleClick} startIcon={<BarChartIcon />}>
        {title}
      </MDButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {items.map((item) => (
          <MenuItem
            key={item.value}
            onClick={() => {
              onSelect(item.value);
              handleClose();
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

ButtonMenu.propTypes = {
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
  title: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  onSelect: PropTypes.func.isRequired,
};

export default ButtonMenu;
