import React from "react";
import { Bar } from "react-chartjs-2";

const TopicPerformanceGraph = ({ data }) => {
  const topicData = {};

  data.responses.forEach(({ questionId: { topic }, mark }) => {
    topicData[topic] = topicData[topic] || { totalMarks: 0, totalQuestions: 0 };
    topicData[topic].totalMarks += mark;
    topicData[topic].totalQuestions++;
  });

  const chartData = {
    labels: Object.keys(topicData),
    datasets: [
      {
        label: "Marks",
        data: Object.values(topicData).map((entry) => entry.totalMarks),
        backgroundColor: "#03A9F4",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: "100%", height: "300px", marginBottom: "20px" }}>
      <h3>Topic-Wise Performance</h3>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default TopicPerformanceGraph;
