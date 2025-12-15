import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTheme, Button, Menu, MenuItem } from "@mui/material";
import MDButton from "components/MDButton";
import BarChartIcon from "@mui/icons-material/BarChart";
import { tokens } from "../theme";

const ButtonMenu = ({ title = "Menu", items = [], onSelect }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <MDButton
        variant="contained"
        onClick={handleClick}
        startIcon={<BarChartIcon />}
        sx={{
          backgroundColor: colors.primary[100],
          color: colors.grey[900],
          "&:hover": {
            backgroundColor: colors.primary[200],
          },
        }}
      >
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
