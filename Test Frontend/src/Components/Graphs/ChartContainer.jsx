import React from "react";
import { Bar, Pie, Scatter } from "react-chartjs-2";

const ChartContainer = ({ title, chartType, data, options, onClick }) => {
  const ChartComponent = chartType === "bar" ? Bar : chartType === "pie" ? Pie : Scatter;

  return (
    <div style={{ width: "100%", height: "300px", marginBottom: "20px" }}>
      <h3>{title}</h3>
      <ChartComponent data={data} options={options} onClick={onClick} />
    </div>
  );
};

export default ChartContainer;
