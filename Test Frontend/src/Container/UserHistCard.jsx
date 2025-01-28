import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTestDetail } from "../Backend/config";

const HistCard = ({ id, testId }) => {
  const [remainingTime, setRemainingTime] = useState("");
  const [status, setStatus] = useState("Upcoming");
  const [testDetails, setTestDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isSyllabusExpanded, setIsSyllabusExpanded] = useState(false); // State for syllabus toggle
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const testDetail = await getTestDetail({ id: testId });
        setTestDetails(testDetail.data);
      } catch (error) {
        console.error("Error fetching test details:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchUser();
  }, [testId]);

  useEffect(() => {
    if (!testDetails) return;

    const interval = setInterval(() => {
      const currentDate = new Date();
      const testDateObj = new Date(testDetails.testDateAndTime);
      const difference = testDateObj - currentDate;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        setStatus("Upcoming");
      } else {
        const testEndTime = new Date(testDateObj.getTime() + testDetails.validity * 60 * 60 * 1000);

        if (currentDate < testEndTime) {
          setRemainingTime("Test is Active");
          setStatus("Ongoing");
        } else {
          setRemainingTime("Test Completed");
          setStatus("Completed");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [testDetails]);

  const handleAnalyze = () => {
    navigate(`/test-analysis/${id}`);
  };

  const toggleSyllabus = () => {
    setIsSyllabusExpanded(!isSyllabusExpanded);
  };

  if (isLoading) {
    return (
      <div
        id={id}
        className="w-80 p-6 bg-gray-100 rounded-xl shadow-lg flex items-center justify-center"
      >
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div
      id={id}
      className="w-80 p-6 bg-gradient-to-br from-red-400 to-yellow-400 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
    >
      <div className="mb-4 text-center">
        <h3 className="text-2xl font-bold text-gray-900">{testDetails?.title}</h3>
      </div>
      <div className="text-left text-lg text-gray-900">
        <p className="mb-3">
          <strong>Pattern:</strong> 📝 {testDetails?.pattern}
        </p>
        <p className="mb-3">
          <strong>Time:</strong> ⏰ {testDetails?.duration} minutes
        </p>
        <p className="mb-3">
          <strong>Total Marks:</strong> 🎯 {testDetails?.totalMarks}
        </p>
        <p className="mb-3">
          <strong>Test Date & Time:</strong> 📅 {new Date(testDetails.testDateAndTime).toLocaleString()}
        </p>
        <p className="mt-4 text-sm text-gray-700">
          <strong>Remaining Time:</strong> ⏳ {remainingTime}
        </p>
        <p className="mt-2 text-sm text-gray-700">
          <strong>Status:</strong> {status}
        </p>
        <div className="mt-3">
          <button
            onClick={toggleSyllabus}
            className="text-blue-500 underline"
          >
            {isSyllabusExpanded ? "Hide Syllabus" : "Show Syllabus"}
          </button>
          {isSyllabusExpanded && (
            <div className="mt-3 bg-gray-100 p-3 rounded-lg text-sm text-gray-800">
              <strong>Syllabus:</strong> {testDetails?.syllabus || "No syllabus provided."}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={handleAnalyze}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Analyze
        </button>
      </div>
    </div>
  );
};

export default HistCard;
