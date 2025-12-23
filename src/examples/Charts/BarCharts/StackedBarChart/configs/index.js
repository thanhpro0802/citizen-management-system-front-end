function configs(labels, datasets) {
  return {
    data: {
      labels,
      datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "#fff",
          },
        },
      },
      scales: {
        x: {
          stacked: true, // ⭐ BẮT BUỘC
          grid: {
            display: false,
          },
          ticks: {
            color: "#fff",
          },
        },
        y: {
          stacked: true, // ⭐ BẮT BUỘC
          beginAtZero: true,
          ticks: {
            color: "#fff",
          },
          grid: {
            color: "rgba(255,255,255,0.2)",
          },
        },
      },
    },
  };
}

export default configs;
