import React, { useState } from "react";
import { Scatter } from "react-chartjs-2";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

const TimeVsMarksGraph = ({ data }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState([]);

  const timeVsMarksData = data.responses.map((resp) => ({
    x: resp.time,
    y: resp.mark,
    label: resp.questionId.questionText,
    ...resp,
  }));

  const handlePointClick = (event, chartElement) => {
    if (chartElement.length > 0) {
      const index = chartElement[0].index;
      const dataPoint = timeVsMarksData[index];
      setDialogContent([
        <div key={dataPoint.label}>
          <strong>{dataPoint.label}</strong><br />
          Marks: {dataPoint.mark}, Time: {dataPoint.time}s<br />
          Your Answer: {dataPoint.selectedOption || dataPoint.inputAnswer || "Not Attempted"}<br />
          Correct Answer: {dataPoint.questionId.correctAnswer}
        </div>,
      ]);
      setDialogOpen(true);
    }
  };

  const chartData = {
    datasets: [
      {
        label: "Time vs Marks (per question)",
        data: timeVsMarksData,
        backgroundColor: "#FF9800",
        pointRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: handlePointClick,
    scales: {
      x: { title: { display: true, text: "Time Spent (seconds)" } },
      y: { title: { display: true, text: "Marks" } },
    },
  };

  return (
    <div style={{ width: "100%", height: "300px", marginBottom: "20px" }}>
      <h3>Time Spent vs Marks</h3>
      <Scatter data={chartData} options={chartOptions} />
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Question Details</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TimeVsMarksGraph;
