import React from "react";
import { Bar } from "react-chartjs-2";

const MarksDistributionGraph = ({ data }) => {
  const subjectData = {};

  data.responses.forEach(({ subject, mark, time }) => {
    subjectData[subject] = subjectData[subject] || { totalMarks: 0, timeSpent: 0, totalQuestions: 0 };
    subjectData[subject].totalMarks += mark;
    subjectData[subject].timeSpent += time;
    subjectData[subject].totalQuestions++;
  });

  const chartData = {
    labels: Object.keys(subjectData),
    datasets: [
      {
        label: "Marks",
        data: Object.values(subjectData).map((entry) => entry.totalMarks),
        backgroundColor: "#4CAF50",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: "100%", height: "300px", marginBottom: "20px" }}>
      <h3>Marks Distribution by Subject</h3>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default MarksDistributionGraph;
