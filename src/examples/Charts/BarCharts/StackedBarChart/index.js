import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import configs from "./config";

function StackedBarChart({ color, title, description, date, chart }) {
  const { data, options } = configs(chart.labels, chart.datasets);

  return (
    <Card>
      <MDBox p={2}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <MDTypography variant="h6">{title}</MDTypography>
          <Icon color={color}>stacked_bar_chart</Icon>
        </MDBox>

        {description && (
          <MDTypography variant="button" color="text" mb={1}>
            {description}
          </MDTypography>
        )}

        <MDBox height="19rem">
          <Bar data={data} options={options} />
        </MDBox>

        {date && (
          <MDBox mt={2}>
            <MDTypography variant="caption" color="text">
              {date}
            </MDTypography>
          </MDBox>
        )}
      </MDBox>
    </Card>
  );
}

StackedBarChart.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  date: PropTypes.string,
  chart: PropTypes.shape({
    labels: PropTypes.array.isRequired,
    datasets: PropTypes.array.isRequired,
  }).isRequired,
};

export default StackedBarChart;
