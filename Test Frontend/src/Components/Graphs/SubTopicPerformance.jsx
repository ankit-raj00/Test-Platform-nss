import React from "react";
import { Bar } from "react-chartjs-2";

const SubtopicPerformanceGraph = ({ data }) => {
  const subTopicData = {};

  data.responses.forEach(({ questionId: { subTopic }, mark }) => {
    subTopicData[subTopic] = subTopicData[subTopic] || { totalMarks: 0, totalQuestions: 0 };
    subTopicData[subTopic].totalMarks += mark;
    subTopicData[subTopic].totalQuestions++;
  });

  const chartData = {
    labels: Object.keys(subTopicData),
    datasets: [
      {
        label: "Marks",
        data: Object.values(subTopicData).map((entry) => entry.totalMarks),
        backgroundColor: "#FFC107",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: "100%", height: "300px", marginBottom: "20px" }}>
      <h3>Subtopic-Wise Performance</h3>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default SubtopicPerformanceGraph;
