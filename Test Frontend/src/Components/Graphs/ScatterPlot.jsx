import React, { useState } from "react";
import { Scatter } from "react-chartjs-2";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

const ScatterPlotWithDialog = ({ data, options }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState([]);

  const handlePointClick = (event, chartElement) => {
    if (chartElement.length > 0) {
      const index = chartElement[0].index;
      const dataPoint = data.datasets[0].data[index];

      const sameCoordinates = data.datasets[0].data.filter(
        (point) => point.x === dataPoint.x && point.y === dataPoint.y
      );

      const questions = sameCoordinates.map((point) => (
        <div key={point.label} style={{ marginBottom: "10px" }}>
          <strong>{point.label}</strong><br />
          Marks: {point.y}, Time: {point.x}s<br />
          Topic: {point.questionId.topic}<br />
          Subtopic: {point.questionId.subTopic}<br />
          Your Answer: {(point.selectedOptions && point.selectedOptions.length > 0)
            ? point.selectedOptions.join(", ")
            : (point.selectedOption || point.inputAnswer || "Not Attempted")}
          <br />
          Correct Answer: {point.correctAnswer}<br />
        </div>
      ));

      setDialogContent(questions);
      setDialogOpen(true);
    }
  };

  const closeDialog = () => setDialogOpen(false);

  return (
    <div>
      <h3>Time Spent vs Marks</h3>
      <Scatter data={data} options={{ ...options, onClick: handlePointClick }} />
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>Questions at the Same Point</DialogTitle>
        <DialogContent style={{ maxHeight: "400px", overflowY: "auto" }}>
          {dialogContent}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ScatterPlotWithDialog;
