import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const ChartWrapper = ({ type, data, options, width = "100%", height = "300px" }) => {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartContainer.current) {
      // Create a new Chart instance
      chartInstance.current = new Chart(chartContainer.current, {
        type,
        data,
        options,
      });
    }

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type, data, options]);

  return <canvas ref={chartContainer} style={{ width, height }} />;
};

export default ChartWrapper;
