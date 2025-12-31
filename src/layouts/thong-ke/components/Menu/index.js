import * as React from "react";
import PropTypes from "prop-types";
import MDButton from "components/MDButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const ThongKeModeMenu = ({ mode, onChange }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (newMode) => {
    setAnchorEl(null);
    if (newMode) {
      onChange(newMode);
    }
  };

  const MODE_LABEL = {
    week: "Tuần",
    quarter: "Quý",
    month: "Tháng",
  };

  return (
    <>
      <MDButton color="secondary" variant="outlined" id="thongke-button" onClick={handleClick}>
        {MODE_LABEL[mode]}
      </MDButton>

      <Menu anchorEl={anchorEl} open={open} onClose={() => handleClose(null)}>
        <MenuItem onClick={() => handleClose("week")}>Tuần</MenuItem>
        <MenuItem onClick={() => handleClose("quarter")}>Quý</MenuItem>
        <MenuItem onClick={() => handleClose("month")}>Tháng</MenuItem>
      </Menu>
    </>
  );
};

ThongKeModeMenu.propTypes = {
  mode: PropTypes.oneOf(["week", "quarter", "month"]).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ThongKeModeMenu;
