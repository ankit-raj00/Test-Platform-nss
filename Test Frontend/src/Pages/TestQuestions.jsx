import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toggleBookmark , getUserBookmarks } from "../Backend/config";// Import the necessary API functions
import { getTestDetail } from "../Backend/config";
function TestQuestions() {
  const { testId } = useParams();
  const [testDetails, setTestDetails] = useState(null);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Set());
  const [loading, setLoading] = useState(true);
  
  
  

  // Fetch test details and user bookmarks
  const fetchData = async () => {
    try {
      const response = await getTestDetail({ id: testId }); // API call to fetch test details
      setTestDetails(response.data);

      const bookmarks = await getUserBookmarks(); // API call to fetch user's bookmarked questions
      const bookmarkSet = new Set(bookmarks.data.map((b) => b.questionId._id)); // Convert to a Set for efficient lookups
      setBookmarkedQuestions(bookmarkSet);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [testId]);

  // Toggle bookmark for a question
  const handleToggleBookmark = async (questionId) => {
    try {
      await toggleBookmark({ questionId }); // API call to toggle bookmark
      setBookmarkedQuestions((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(questionId)) {
          newSet.delete(questionId);
        } else {
          newSet.add(questionId);
        }
        return newSet;
      });
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-bold text-blue-500">
        Loading...
      </div>
    );
  }

  if (!testDetails) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-bold text-red-500">
        Unable to load test details. Please try again later.
      </div>
    );
  }

  const hierarchy = testDetails.testQuestions.reduce((acc, question) => {
    const { subject, topic, subTopic } = question;

    if (!acc[subject]) acc[subject] = {};
    if (!acc[subject][topic]) acc[subject][topic] = {};
    if (!acc[subject][topic][subTopic]) acc[subject][topic][subTopic] = [];
    acc[subject][topic][subTopic].push(question);

    return acc;
  }, {});

  return (
    <div className="p-4 md:p-6 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
        {testDetails.title}
      </h1>
      <div className="text-base md:text-lg text-gray-600 mb-6 text-center">
        <p>Pattern: {testDetails.pattern}</p>
        <p>Total Marks: {testDetails.totalMarks}</p>
        <p>Duration: {testDetails.duration} minutes</p>
      </div>

      <div>
        {Object.keys(hierarchy).map((subject) => (
          <SubjectNode
            key={subject}
            subject={subject}
            topics={hierarchy[subject]}
            bookmarkedQuestions={bookmarkedQuestions}
            onToggleBookmark={handleToggleBookmark}
          />
        ))}
      </div>
    </div>
  );
}

function SubjectNode({ subject, topics, bookmarkedQuestions, onToggleBookmark }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4">
      <div
        className="flex items-center cursor-pointer bg-blue-100 p-2 md:p-3 rounded-md"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-blue-600 font-semibold">{isExpanded ? "▼" : "►"}</span>
        <span className="ml-2 text-base md:text-lg font-bold text-blue-700">{subject}</span>
      </div>
      {isExpanded && (
        <div className="pl-4 md:pl-6 mt-2">
          {Object.keys(topics).map((topic) => (
            <TopicNode
              key={topic}
              topic={topic}
              subTopics={topics[topic]}
              bookmarkedQuestions={bookmarkedQuestions}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TopicNode({ topic, subTopics, bookmarkedQuestions, onToggleBookmark }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-2">
      <div
        className="flex items-center cursor-pointer bg-green-100 p-2 rounded-md"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-green-600 font-semibold">{isExpanded ? "▼" : "►"}</span>
        <span className="ml-2 text-base md:text-lg font-medium text-green-700">{topic}</span>
      </div>
      {isExpanded && (
        <div className="pl-4 md:pl-6 mt-2">
          {Object.keys(subTopics).map((subTopic) => (
            <SubTopicNode
              key={subTopic}
              subTopic={subTopic}
              questions={subTopics[subTopic]}
              bookmarkedQuestions={bookmarkedQuestions}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SubTopicNode({ subTopic, questions, bookmarkedQuestions, onToggleBookmark }) {
    
  
    const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const openModal = (src) => {
    setModalImageSrc(src);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImageSrc("");
  };
  
  
    return (
      <div className="mb-2">
        <div
          className="flex items-center cursor-pointer bg-yellow-100 p-2 rounded-md"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="text-yellow-600 font-semibold">{isExpanded ? "▼" : "►"}</span>
          <span className="ml-2 text-base md:text-lg text-yellow-700 font-medium">{subTopic}</span>
        </div>
        {isExpanded && (
          <div className="pl-4 md:pl-6 mt-2">
            {questions.map((question) => (
              <div
                key={question._id}
                className="bg-white shadow-md rounded-md p-4 mb-2 border-l-4 border-yellow-500 relative"
              >
                <p className="text-sm md:text-base text-gray-800 font-semibold mb-2">
                  <strong>Question:</strong> {question.questionText}
                </p>
                {question.questionImg && (
          <div className="mt-2 flex justify-center">
            <img
              src={question.questionImg}
              alt="Question Illustration"
              className="max-w-[400px] max-h-[300px] w-auto h-auto border rounded-md"
              onClick={() => openModal(question.questionImg)}
            />
          </div>
        )}
                <ul className="list-disc list-inside text-sm md:text-base text-gray-700 mb-2">
                  <li className="text-gray-700"><strong>Options:</strong></li>
                  {question.option.map((opt, index) => (
                    <li key={index} className="ml-4 text-gray-600">{opt}</li>
                  ))}
                </ul>
                <p className="text-sm md:text-base text-gray-700">
                  <strong>Correct Answer:</strong> {question.correctAnswer || "N/A"}
                </p>
                <p className="text-sm md:text-base text-gray-700">
                  <strong>Type:</strong> {question.questionType}
                </p>
                <button
                  className={`absolute top-2 right-2 text-xs md:text-sm px-2 md:px-3 py-1 rounded ${
                    bookmarkedQuestions.has(question._id)
                      ? "bg-red-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                  onClick={() => onToggleBookmark(question._id)}
                >
                  {bookmarkedQuestions.has(question._id) ? "Unbookmark" : "Bookmark"}
                </button>
              </div>
            ))}
          </div>
        )}
        {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md max-w-[90%] max-h-[90%] overflow-auto">
            <button
              className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-2"
              onClick={closeModal}
            >
              X
            </button>
            <img
              src={modalImageSrc}
              alt="Enlarged Question Illustration"
              className="max-w-full max-h-[80vh] object-contain mx-auto"
            />
          </div>
        </div>
      )}
      </div>
    );
  }
  

export default TestQuestions;
