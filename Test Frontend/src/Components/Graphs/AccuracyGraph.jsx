import React from "react";
import ChartWrapper from "./ChartWrapper";

const AccuracyGraph = ({ data }) => {
  const chartData = {
    labels: ["January", "February", "March", "April"],
    datasets: [
      {
        label: "Accuracy",
        data: [85, 90, 88, 92], // Replace with dynamic data
        backgroundColor: "#36A2EB",
        borderColor: "#36A2EB",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div>
      <h3>Accuracy Over Time</h3>
      <ChartWrapper type="bar" data={chartData} options={chartOptions} />
    </div>
  );
};

export default AccuracyGraph;
