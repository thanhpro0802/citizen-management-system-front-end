import * as React from "react";
import PropTypes from "prop-types";
import MDButton from "components/MDButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const TamTruTamVangMenu = ({ mode, onChange }) => {
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
    tamTru: "Tạm trú",
    tamVang: "Tạm vắng",
  };

  return (
    <>
      <MDButton color="secondary" variant="outlined" id="thongke-button" onClick={handleClick}>
        {MODE_LABEL[mode]}
      </MDButton>

      <Menu anchorEl={anchorEl} open={open} onClose={() => handleClose(null)}>
        <MenuItem onClick={() => handleClose("tamTru")}>Tạm trú</MenuItem>
        <MenuItem onClick={() => handleClose("tamVang")}>Tạm vắng</MenuItem>
      </Menu>
    </>
  );
};

TamTruTamVangMenu.propTypes = {
  mode: PropTypes.oneOf(["tamTru", "tamVang"]).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TamTruTamVangMenu;
