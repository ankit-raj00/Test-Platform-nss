import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getResponse, toggleBookmark, getUserBookmarks } from "../Backend/config";

const AnalysisPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [insights, setInsights] = useState({
    subjectWise: {},
  });
  const [expanded, setExpanded] = useState({});
  const [bookmarks, setBookmarks] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch analysis data
         const result = await getResponse({ id });
        // const updatedResult = {
        //   ...result, // Spread the rest of the data from `result`
        //   data: {
        //     ...result.data, // Spread `result.data`
        //     responses: result.data.responses.filter((resp) => resp.status === 1 || resp.status === 2), // Filter responses based on the status
        //   },
        // };
        console.log(result)
        if (result?.success) {
          setData(result.data);
          
          processInsights(result.data);
        } else {
          console.error("Error fetching response data:", result.message);
        }

        // Fetch user bookmarks
        const userBookmarks = await getUserBookmarks();
        console.log(userBookmarks)
        if (userBookmarks?.success) {
          setBookmarks(new Set(userBookmarks.data.map((bm) => bm.questionId._id)));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const processInsights = (responseData) => {
    const subjectWise = {};

    responseData.responses.forEach((resp) => {
      const subject = resp.subject;
      if (!subjectWise[subject]) {
        subjectWise[subject] = { totalMarks: 0, totalTime: 0, topics: {} };
      }
      subjectWise[subject].totalMarks += resp.mark;
      subjectWise[subject].totalTime += resp.time;

      const topic = resp.questionId.topic;
      if (!subjectWise[subject].topics[topic]) {
        subjectWise[subject].topics[topic] = { totalMarks: 0, totalTime: 0, subTopics: {} };
      }
      subjectWise[subject].topics[topic].totalMarks += resp.mark;
      subjectWise[subject].topics[topic].totalTime += resp.time;

      const subTopic = resp.questionId.subTopic;
      if (!subjectWise[subject].topics[topic].subTopics[subTopic]) {
        subjectWise[subject].topics[topic].subTopics[subTopic] = { questions: [] };
      }
      subjectWise[subject].topics[topic].subTopics[subTopic].questions.push(resp);
    });

    setInsights({ subjectWise });
  };

  const toggleExpanded = (level, key) => {
    setExpanded((prev) => ({
      ...prev,
      [level]: { ...(prev[level] || {}), [key]: !(prev[level]?.[key] || false) },
    }));
  };

  const handleBookmarkToggle = async (questionId) => {
    try {
      const response = await toggleBookmark({ questionId });
      console.log(response)
      if (response?.success) {
        setBookmarks((prev) => {
          const updated = new Set(prev);
          if (updated.has(questionId)) {
            updated.delete(questionId);
          } else {
            updated.add(questionId);
          }
          return updated;
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const getColorClass = (response) => {
    if (response.status === 0) return "bg-red-400";
    if (response.status === 1) return "bg-green-400";
    if (response.status === 2) return "bg-yellow-400";
    if (response.status === 3) return "bg-purple-400";
    return "bg-gray-200";
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
    <h1>Analysis Dashboard</h1>
    
    {/* Summary Card */}
    {data && (
  <div className="flex justify-between items-center p-5 bg-gray-100 border border-gray-300 rounded-lg mb-5 shadow-md">
    <div className="text-center">
      <h2 className="text-lg font-semibold text-gray-700">Total Marks</h2>
      <p className="text-2xl font-bold text-blue-600">
        {Object.values(insights.subjectWise).reduce(
          (acc, subject) => acc + subject.totalMarks,
          0
        )}
      </p>
    </div>
    <div className="text-center">
      <h2 className="text-lg font-semibold text-gray-700">Total Time</h2>
      <p className="text-2xl font-bold text-green-600">
        {Object.values(insights.subjectWise).reduce(
          (acc, subject) => acc + subject.totalTime,
          0
        )}
        s
      </p>
    </div>
  </div>
)}


<div className="mb-4 flex space-x-4">
  <button
    onClick={() => navigate(`/test-analysis/${id}/all-question/${data.testId}`)}
    className="bg-blue-500 text-white p-2 rounded"
  >
    All Test Questions
  </button>
  <button
    onClick={() => navigate(`/graph-analysis/${id}`)}
    className="bg-green-500 text-white p-2 rounded"
  >
    Graph Analysis
  </button>
</div>

      {data ? (
        <>
          {Object.entries(insights.subjectWise).map(([subject, subjectData]) => (
            <div key={subject} style={{ marginBottom: "20px" }}>
              <button
                className="bg-gray-300 p-3 w-full text-left font-bold"
                onClick={() => toggleExpanded("subjects", subject)}
              >
                {subject} (Marks: {subjectData.totalMarks}, Time: {subjectData.totalTime}s)
              </button>
              {expanded.subjects?.[subject] &&
                Object.entries(subjectData.topics).map(([topic, topicData]) => (
                  <div key={topic} style={{ marginLeft: "20px" }}>
                    <button
                      className="bg-gray-200 p-3 w-full text-left font-semibold"
                      onClick={() => toggleExpanded("topics", topic)}
                    >
                      {topic} (Marks: {topicData.totalMarks}, Time: {topicData.totalTime}s)
                    </button>
                    {expanded.topics?.[topic] &&
                      Object.entries(topicData.subTopics).map(([subTopic, subTopicData]) => (
                        <div key={subTopic} style={{ marginLeft: "40px" }}>
                          <button
                            className="bg-gray-100 p-3 w-full text-left font-medium"
                            onClick={() => toggleExpanded("subTopics", subTopic)}
                          >
                            {subTopic}
                          </button>
                          {expanded.subTopics?.[subTopic] &&
                            subTopicData.questions.map((question, questionIndex) => (
                              <div key={questionIndex} style={{ marginLeft: "60px" }}>
                                <button
                                  className={`text-white p-3 w-full text-left ${getColorClass(
                                    question
                                  )}`}
                                  onClick={() =>
                                    toggleExpanded("questions", question.questionId._id)
                                  }
                                >
                                  {question.questionId.questionText} (Marks: {question.mark}, Time:{" "}
                                  {question.time}s)
                                </button>
                                {expanded.questions?.[question.questionId._id] && (
                                  <div
                                    style={{
                                      padding: "10px",
                                      background: "#f2f2f2",
                                      border: "1px solid #ccc",
                                      marginTop: "5px",
                                      borderRadius: "5px",
                                    }}
                                  >
                                    <p>
                                      <strong>Question:</strong> {question.questionId.questionText}
                                    </p>
                                    {question.questionId.questionImg && (
    <div className="mt-2 flex justify-center">
        <img
            src={question.questionId.questionImg}
            alt="Question Illustration"
            className="max-w-[400px] max-h-[300px] w-auto h-auto border rounded-md"
        />
    </div>
)}
                                    <p>
                                      <strong>Options:</strong> {question.questionId.option ? question.questionId.option.join(", ") : "No options available"}
                                    </p>

                                    <p>
                                      <strong>Correct Answer:</strong>{" "}
                                      {question.questionId.correctAnswer}
                                    </p>
                                    <p>
                                      <strong>Your Answer:</strong> 
                                                                    { 
                                    (question.selectedOptions && question.selectedOptions.length > 0)  // If multiple options are selected
                                      ? question.selectedOptions.join(", ")
                                      : (question.selectedOption || question.inputAnswer || "Not Attempted")  // If a single option is selected or typed answer
                                  }
                                      </p>
                                    <p>
                                      <strong>Marks:</strong> {question.mark}
                                    </p>
                                    <p>
                                      <strong>Time:</strong> {question.time}s
                                    </p>
                                    <button
                                      onClick={() =>
                                        handleBookmarkToggle(question.questionId._id)
                                      }
                                      className={`mt-2 p-2 rounded ${
                                        bookmarks.has(question.questionId._id)
                                          ? "bg-red-500"
                                          : "bg-blue-500"
                                      } text-white`}
                                    >
                                      {bookmarks.has(question.questionId._id)
                                        ? "Remove Bookmark"
                                        : "Add Bookmark"}
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          ))}
        </>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default AnalysisPage;
