import * as React from "react";
import PropTypes from "prop-types";
import MDButton from "components/MDButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const CommonMenu = ({ value, options, onChange, buttonColor = "secondary" }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const currentLabel = options.find((opt) => opt.value === value)?.label || "Chọn";

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (newValue) => {
    setAnchorEl(null);
    if (newValue !== undefined) {
      onChange(newValue);
    }
  };

  return (
    <>
      <MDButton color={buttonColor} variant="outlined" onClick={handleClick}>
        {currentLabel}
      </MDButton>

      <Menu anchorEl={anchorEl} open={open} onClose={() => handleClose()}>
        {options.map((opt) => (
          <MenuItem
            key={opt.value}
            selected={opt.value === value}
            onClick={() => handleClose(opt.value)}
          >
            {opt.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

CommonMenu.propTypes = {
  value: PropTypes.any.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  buttonColor: PropTypes.string,
};

export default CommonMenu;
