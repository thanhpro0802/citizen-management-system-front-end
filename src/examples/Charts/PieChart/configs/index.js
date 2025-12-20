/* eslint-disable no-dupe-keys */
import colors from "assets/theme/base/colors";

const { gradients, dark } = colors;

const COLOR_KEYS = ["info", "success", "warning", "error", "primary", "secondary"];

function configs(labels = [], datasets = {}) {
  const backgroundColors = labels.map((_, index) => {
    const colorKey = datasets.backgroundColors?.[index] || COLOR_KEYS[index % COLOR_KEYS.length];

    return gradients[colorKey] ? gradients[colorKey].state : dark.main;
  });

  return {
    data: {
      labels,
      datasets: [
        {
          label: datasets.label || "",
          data: datasets.data || [],
          backgroundColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
        },
      },
    },
  };
}

export default configs;
