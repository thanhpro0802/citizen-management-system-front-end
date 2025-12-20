import { Icon } from "@mui/material";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TimelineItem from "examples/Timeline/TimelineItem";

function LichSu() {
  return (
    <Card sx={{ height: "100%" }}>
      {/* Header */}
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Lịch Sử
        </MDTypography>

        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            <MDTypography display="inline" variant="body2" verticalAlign="middle">
              <Icon sx={{ color: ({ palette: { success } }) => success.main }}>arrow_upward</Icon>
            </MDTypography>
            &nbsp;
            <MDTypography variant="button" color="text" fontWeight="medium">
              24%
            </MDTypography>{" "}
            this month
          </MDTypography>
        </MDBox>
      </MDBox>
      {/* Body */}
      <MDBox p={2}>
        <TimelineItem color="" icon="" title="" dateTime="" />
      </MDBox>
    </Card>
  );
}
