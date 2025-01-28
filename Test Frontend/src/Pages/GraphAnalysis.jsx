import React, { useEffect, useState } from "react";
import { Bar, Pie, Scatter } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { useParams } from "react-router-dom";
import { getResponse } from "../Backend/config";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";  // Import Dialog components

ChartJS.register(...registerables);

const GraphAnalysisPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [charts, setCharts] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);  // State for Dialog visibility
  const [dialogContent, setDialogContent] = useState([]);  // State to store the content for the dialog

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getResponse({ id });
        console.log(result)
        if (result?.success) {
          setData(result.data);
          generateCharts(result.data.responses);
        } else {
          console.error("Error fetching response data:", result.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    const generateCharts = (responses) => {
        const subjectData = {};
        const topicData = {};
        const subTopicData = {};
        const questionTypeData = { positive: 0, negative: 0, notAttempted: 0 };
        const timeVsMarksData = [];
        const subjectAccuracyData = {};
        const topicAccuracyData = {};
        const subTopicAccuracyData = {};
        const subjectAttemptDistribution = {};
        const topicAttemptDistribution = {};
        const subTopicAttemptDistribution = {};
      
        responses.forEach((resp) => {
          const { subject, mark, time, questionId, type, selectedOption, selectedOptions, inputAnswer, status } = resp;
          const { topic, subTopic, correctAnswer } = questionId;
      
          // Subject-level data
          subjectData[subject] = subjectData[subject] || { totalMarks: 0, totalQuestions: 0, timeSpent: 0, correct: 0, attempted: 0 };
          subjectData[subject].totalMarks += mark;
          subjectData[subject].timeSpent += time;
          subjectData[subject].totalQuestions++;
          if (mark > 0) subjectData[subject].correct++;
          if (status === 1 || status === 2) subjectData[subject].attempted++;
      
          // Topic-level data
          topicData[topic] = topicData[topic] || { totalMarks: 0, totalQuestions: 0, correct: 0, attempted: 0 };
          topicData[topic].totalMarks += mark;
          topicData[topic].totalQuestions++;
          if (mark > 0) topicData[topic].correct++;
          if (status === 1 || status === 2) topicData[topic].attempted++;
      
          // Subtopic-level data
          subTopicData[subTopic] = subTopicData[subTopic] || { totalMarks: 0, totalQuestions: 0, correct: 0, attempted: 0 };
          subTopicData[subTopic].totalMarks += mark;
          subTopicData[subTopic].totalQuestions++;
          if (mark > 0) subTopicData[subTopic].correct++;
          if (status === 1 || status === 2) subTopicData[subTopic].attempted++;
      
          // Question Type
          if (mark === 4) questionTypeData.positive++;
          else if (mark === -1) questionTypeData.negative++;
          else questionTypeData.notAttempted++;
      
          // Time vs Marks (each question)
          timeVsMarksData.push({
            x: time,
            y: mark,
            label: questionId.questionText,
            questionId: questionId,
            type,
            selectedOption,
            selectedOptions,
            inputAnswer,
            correctAnswer,
            mark,
            time,
          });
        });
        Object.keys(subjectData).forEach((subject) => {
            const { correct, attempted } = subjectData[subject];
            subjectAccuracyData[subject] = (attempted > 0) ? (correct / attempted) * 100 : 0;
          });
        
          Object.keys(topicData).forEach((topic) => {
            const { correct, attempted } = topicData[topic];
            topicAccuracyData[topic] = (attempted > 0) ? (correct / attempted) * 100 : 0;
          });
        
          Object.keys(subTopicData).forEach((subTopic) => {
            const { correct, attempted } = subTopicData[subTopic];
            subTopicAccuracyData[subTopic] = (attempted > 0) ? (correct / attempted) * 100 : 0;
          });
          Object.keys(subjectData).forEach((subject) => {
            const { totalQuestions, correct, attempted } = subjectData[subject];
            const notAttempted = totalQuestions - attempted;
            subjectAttemptDistribution[subject] = {
              positive: (correct / totalQuestions) * 100,
              negative: ((attempted - correct) / totalQuestions) * 100,
              notAttempted: (notAttempted / totalQuestions) * 100,
            };
          });
          
          // Topic-wise
          Object.keys(topicData).forEach((topic) => {
            const { totalQuestions, correct, attempted } = topicData[topic];
            const notAttempted = totalQuestions - attempted;
            topicAttemptDistribution[topic] = {
              positive: (correct / totalQuestions) * 100,
              negative: ((attempted - correct) / totalQuestions) * 100,
              notAttempted: (notAttempted / totalQuestions) * 100,
            };
          });
          
          // Subtopic-wise
          Object.keys(subTopicData).forEach((subTopic) => {
            const { totalQuestions, correct, attempted } = subTopicData[subTopic];
            const notAttempted = totalQuestions - attempted;
            subTopicAttemptDistribution[subTopic] = {
              positive: (correct / totalQuestions) * 100,
              negative: ((attempted - correct) / totalQuestions) * 100,
              notAttempted: (notAttempted / totalQuestions) * 100,
            };
          });

      // Generate chart configurations
      setCharts({
        marksDistribution: {
          labels: Object.keys(subjectData),
          datasets: [
            {
              label: "Marks",
              data: Object.values(subjectData).map((entry) => entry.totalMarks),
              backgroundColor: "#4CAF50",
              
            },
          ],
        },
        topicPerformance: {
          labels: Object.keys(topicData),
          datasets: [
            {
              label: "Marks",
              data: Object.values(topicData).map((entry) => entry.totalMarks),
              backgroundColor: "#03A9F4",
            },
          ],
        },
        subTopicPerformance: {
          labels: Object.keys(subTopicData),
          datasets: [
            {
              label: "Marks",
              data: Object.values(subTopicData).map((entry) => entry.totalMarks),
              backgroundColor: "#FFC107",
            },
          ],
        },
        questionType: {
          labels: ["Positive Marks", "Negative Marks", "Not Attempted"],
          datasets: [
            {
              data: [questionTypeData.positive, questionTypeData.negative, questionTypeData.notAttempted],
              backgroundColor: ["#4CAF50", "#FF5722", "#FFC107"],
            },
          ],
        },
        timeVsMarks: {
          datasets: [
            {
              label: "Time vs Marks (per question)",
              data: timeVsMarksData,
              backgroundColor: "#FF9800",
              pointRadius: 5,
            },
          ],
        },
        subjectAccuracy: {
            labels: Object.keys(subjectAccuracyData),
            datasets: [
              {
                label: "Accuracy (%)",
                data: Object.values(subjectAccuracyData),
                backgroundColor: "#3f51b5",
              },
            ],
          },
          topicAccuracy: {
            labels: Object.keys(topicAccuracyData),
            datasets: [
              {
                label: "Accuracy (%)",
                data: Object.values(topicAccuracyData),
                backgroundColor: "#673ab7",
              },
            ],
          },
          subTopicAccuracy: {
            labels: Object.keys(subTopicAccuracyData),
            datasets: [
              {
                label: "Accuracy (%)",
                data: Object.values(subTopicAccuracyData),
                backgroundColor: "#00bcd4",
              },
            ],
          },
          subjectAttemptDistribution: {
            labels: Object.keys(subjectAttemptDistribution),
            datasets: [
              {
                label: "Positive Marks (%)",
                data: Object.values(subjectAttemptDistribution).map((entry) => entry.positive),
                backgroundColor: "#4CAF50",
              },
              {
                label: "Negative Marks (%)",
                data: Object.values(subjectAttemptDistribution).map((entry) => entry.negative),
                backgroundColor: "#F44336",
              },
              {
                label: "Not Attempted (%)",
                data: Object.values(subjectAttemptDistribution).map((entry) => entry.notAttempted),
                backgroundColor: "#FFC107",
              },
            ],
          },
          topicAttemptDistribution: {
            labels: Object.keys(topicAttemptDistribution),
            datasets: [
              {
                label: "Positive Marks (%)",
                data: Object.values(topicAttemptDistribution).map((entry) => entry.positive),
                backgroundColor: "#4CAF50",
              },
              {
                label: "Negative Marks (%)",
                data: Object.values(topicAttemptDistribution).map((entry) => entry.negative),
                backgroundColor: "#F44336",
              },
              {
                label: "Not Attempted (%)",
                data: Object.values(topicAttemptDistribution).map((entry) => entry.notAttempted),
                backgroundColor: "#FFC107",
              },
            ],
          },
          subTopicAttemptDistribution: {
            labels: Object.keys(subTopicAttemptDistribution),
            datasets: [
              {
                label: "Positive Marks (%)",
                data: Object.values(subTopicAttemptDistribution).map((entry) => entry.positive),
                backgroundColor: "#4CAF50",
              },
              {
                label: "Negative Marks (%)",
                data: Object.values(subTopicAttemptDistribution).map((entry) => entry.negative),
                backgroundColor: "#F44336",
              },
              {
                label: "Not Attempted (%)",
                data: Object.values(subTopicAttemptDistribution).map((entry) => entry.notAttempted),
                backgroundColor: "#FFC107",
              },
            ],
          },
      });
    };

    fetchData();
  }, [id]);
  

  if (loading) return <p>Loading...</p>;

  
  
  const headingStyle = {
    color: "#444", 
    fontFamily: "'Roboto', sans-serif",
    fontSize: "1.5rem",
  };
  const animationOptions = {
    animation: {
      duration: 1000,
      easing: "easeInOutQuad",
    },
  };
  const hoverOptions = {
    hover: {
      mode: "index",
      intersect: false,
      animationDuration: 300,
    },
  };
  
  const chartOptions = {
    hoverOptions,
    animationOptions,
    responsive: true,
    maintainAspectRatio: true, // Preserve aspect ratio
    aspectRatio: 2, // Adjust to maintain proportions
    scales: {
      x: {
        ticks: {
          autoSkip: true, // Automatically skip labels if they overlap
          maxRotation: 45, // Rotate labels for better visibility (you can adjust this)
          minRotation: 0,  // Prevent label rotation if necessary
          padding: 10,      // Add padding between labels and axis for readability
        },
      },
      y: {
        ticks: {
          padding: 1,  // Add space between y-axis labels and the char
        },
      },
    },
  };
  
  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const dataPoint = charts.timeVsMarks.datasets[0].data[tooltipItem.dataIndex];
            return `Question: ${dataPoint.label}, Marks: ${tooltipItem.raw.y}, Time: ${tooltipItem.raw.x}s`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time Spent (seconds)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Marks",
        },
      },
    },
  };

  
  const chartContainerStyle = {
    width: "100%",
    height: "350px",  // Height of the container
    marginBottom: "10px",  // Spacing between charts
    background: "#fff",  // Bright background for contrast
    borderRadius: "8px",  // Rounded edges
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",  // Soft shadows
    padding: "20px",  // Add padding around the container
    paddingBottom: "40px",  // Increase padding at the bottom for more space between the chart and the bottom of the container
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",  // Adjust spacing for title and chart positioning
  };
  
  // Function to handle scatter plot point click
  const handlePointClick = (event, chartElement) => {
    if (chartElement.length > 0) {
      const index = chartElement[0].index;
      const dataPoint = charts.timeVsMarks.datasets[0].data[index];

      // Find all questions with the same (x, y) coordinates
      const sameCoordinates = charts.timeVsMarks.datasets[0].data.filter(
        (point) => point.x === dataPoint.x && point.y === dataPoint.y
      );

      // Prepare dialog content with all the question details
      const questions = sameCoordinates.map((point) => (
        <div key={point.label} style={{ marginBottom: "10px" }}>
          <strong>{point.label}</strong><br />
          Marks: {point.y}, Time: {point.x}s<br />
          SubTopic: {point.questionId.subTopic}, <br />
          Topic: {point.questionId.topic}<br />
          Options : {point.questionId.option.join(", ")}<br />
          Type : {point.type}<br />
          Your Answer: {(point.selectedOptions && point.selectedOptions.length > 0)  // If multiple options are selected
            ? point.selectedOptions.join(", ")
            : (point.selectedOption || point.inputAnswer || "Not Attempted")  // If a single option is selected or typed answer
            }<br />
         Correct Answer : {point.correctAnswer}< br />
         Marks : {point.mark} <br />
         Time : {point.time}

        </div>
      ));

      setDialogContent(questions);
      setDialogOpen(true);
    }
  };

  const closeDialog = () => setDialogOpen(false);

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(to right, #ece9e6, #ffffff)",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#333", textAlign: "center", marginBottom: "30px" }}>Graphical Analysis</h1>

      <div style={chartContainerStyle}>
        <h3 style={headingStyle}>Marks Distribution by Subject</h3>
        <Bar data={charts.marksDistribution} options={chartOptions} />
      </div>

      <div style={chartContainerStyle}>
        <h3 style={headingStyle}>Topic-Wise Performance</h3>
        <Bar data={charts.topicPerformance} options={chartOptions} />
      </div>
      

      <div style={chartContainerStyle}>
        <h3 style={headingStyle}>Subtopic-Wise Performance</h3>
        <Bar data={charts.subTopicPerformance} options={chartOptions} />
      </div>

      <div style={chartContainerStyle}>
        <h3 style={headingStyle}>Question Type Distribution</h3>
        <Pie data={charts.questionType} options={chartOptions} />
      </div>
      <div style={chartContainerStyle}>
    <h3 style={headingStyle}>Subject-Wise Accuracy</h3>
    <Bar data={charts.subjectAccuracy} options={chartOptions} />
    </div>

    <div style={chartContainerStyle}>
    <h3 style={headingStyle}>Topic-Wise Accuracy</h3>
    <Bar data={charts.topicAccuracy} options={chartOptions} />
    </div>

    <div style={chartContainerStyle}>
    <h3 style={headingStyle}>Subtopic-Wise Accuracy</h3>
    <Bar data={charts.subTopicAccuracy} options={chartOptions} />
    </div>
    <div style={chartContainerStyle}>
        <h3 style={headingStyle}>Subject-wise Attempt Distribution</h3>
        <Bar data={charts.subjectAttemptDistribution} options={chartOptions} />
        </div>

        {/* Attempt Distribution for Topics */}
        <div style={chartContainerStyle}>
        <h3 style={headingStyle}>Topic-wise Attempt Distribution</h3>
        <Bar data={charts.topicAttemptDistribution} options={chartOptions} />
        </div>

        {/* Attempt Distribution for Subtopics */}
        <div style={chartContainerStyle}> 
        <h3 style={headingStyle}>Subtopic-wise Attempt Distribution</h3>
        <Bar data={charts.subTopicAttemptDistribution} options={chartOptions} />
        </div>

      <div style={chartContainerStyle}>
        <h3 style={headingStyle}>Time Spent vs Marks</h3>
        <Scatter
          data={charts.timeVsMarks}
          options={{ ...scatterOptions, onClick: handlePointClick }}
        />
      </div>

      {/* Dialog Box to show question details */}
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>Questions at the Same Point</DialogTitle>
        <DialogContent
          style={{
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {dialogContent}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GraphAnalysisPage;
