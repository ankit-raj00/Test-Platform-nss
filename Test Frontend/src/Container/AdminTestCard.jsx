import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { computeResult } from "../Backend/config";

const AdminTestCard = ({
  id,
  title,
  pattern,
  time,
  totalMarks,
  testDate,
  duration,
  onDelete,
  validity,
  syllabus,
}) => {
  const [remainingTime, setRemainingTime] = useState("");
  const [status, setStatus] = useState("Upcoming");
  const [expiry, setExpiry] = useState("");
  const [showSyllabus, setShowSyllabus] = useState(false); // Toggle state for syllabus
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = new Date();
      const testDateObj = new Date(testDate);

      const difference = testDateObj - currentDate;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        setStatus("Upcoming");
      } else {
        const testEndTime = new Date(
          testDateObj.getTime() + (validity ? validity * 60 * 60 * 1000 : duration * 60 * 1000)
        );

        setExpiry(testEndTime.toLocaleString());
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
  }, [testDate, duration]);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the test "${title}"?`)) {
      onDelete(id);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-test/${id}`); // Navigate to the edit page with the test ID
  };

  const handleDeclareResult = async () => {
    try {
      const response = await computeResult({ id });
      console.log(response);

      if (response) {
        alert(`Result for test "${title}" has been successfully declared.`);
      } else {
        const errorData = await response.json();
        alert(`Error declaring result: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Failed to declare result: ${error.message}`);
    }
  };

  const toggleSyllabus = () => {
    setShowSyllabus(!showSyllabus); // Toggle syllabus visibility
  };

  return (
    <div
      id={id}
      className="w-80 p-6 bg-gradient-to-br from-red-400 to-yellow-400 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
    >
      <div className="mb-4 text-center">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      </div>
      <div className="text-left text-lg text-gray-900">
        <p className="mb-3">
          <strong>Pattern:</strong> 📝 {pattern}
        </p>
        <p className="mb-3">
          <strong>Time:</strong> ⏰ {time} minutes
        </p>
        <p className="mb-3">
          <strong>Total Marks:</strong> 🎯 {totalMarks}
        </p>
        <p className="mb-3">
          <strong>Test Date & Time:</strong> 📅 {new Date(testDate).toLocaleString()}
        </p>
        <p className="mt-4 text-sm text-gray-700">
          <strong>Remaining Time:</strong> ⏳ {remainingTime}
        </p>
        <p className="mt-4 text-sm text-gray-700">
          <strong>Expire at:</strong> ⏳ {expiry}
        </p>
        <p className="mt-2 text-sm text-gray-700">
          <strong>Status:</strong> {status}
        </p>
        <div className="mt-4">
          <button
            onClick={toggleSyllabus}
            className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            {showSyllabus ? "Hide Syllabus" : "Show Syllabus"}
          </button>
          {showSyllabus && (
            <div className="mt-3 bg-gray-100 p-4 rounded">
              <strong>Syllabus:</strong>
              <p className="text-sm text-gray-700">{syllabus}</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
        <button
          onClick={handleDeclareResult}
          disabled={status !== "Completed"} // Disable if test is not completed
          className={`px-4 py-2 rounded text-white ${
            status === "Completed"
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Declare Result
        </button>
      </div>
    </div>
  );
};

export default AdminTestCard;
