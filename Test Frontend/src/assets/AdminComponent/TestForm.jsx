import React, { useState } from "react";

const TestForm = ({ questionIds }) => {
  const [testData, setTestData] = useState({
    title: "",
    pattern: "",
    totalMarks: "",
    duration: "",
    testQuestions: questionIds,
    testDateAndTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTestData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/v1/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert("Test created successfully!");
      setTestData({
        title: "",
        pattern: "",
        totalMarks: "",
        duration: "",
        testQuestions: [],
        testDateAndTime: "",
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Test Title"
        name="title"
        value={testData.title}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Test Pattern"
        name="pattern"
        value={testData.pattern}
        onChange={handleChange}
      />
      <input
        type="number"
        placeholder="Total Marks"
        name="totalMarks"
        value={testData.totalMarks}
        onChange={handleChange}
      />
      <input
        type="number"
        placeholder="Duration (minutes)"
        name="duration"
        value={testData.duration}
        onChange={handleChange}
      />
      <input
        type="datetime-local"
        name="testDateAndTime"
        value={testData.testDateAndTime}
        onChange={handleChange}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Creating Test..." : "Submit Test"}
      </button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default TestForm;
