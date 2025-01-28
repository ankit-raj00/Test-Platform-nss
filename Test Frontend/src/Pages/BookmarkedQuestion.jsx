import React, { useState, useEffect } from "react";
import { getUserBookmarks } from "../Backend/config";

const BookmarkHierarchy = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [hierarchy, setHierarchy] = useState({});
  const [expandedSections, setExpandedSections] = useState({}); // To track expanded sections

  useEffect(() => {
    const fetchBookmarks = async () => {
      const data = await getUserBookmarks();
      setBookmarks(data.data);

      // Group data into hierarchy
      const groupedData = data.data.reduce((acc, item) => {
        const { subject, topic, subTopic } = item.questionId;
        if (!acc[subject]) acc[subject] = {};
        if (!acc[subject][topic]) acc[subject][topic] = {};
        if (!acc[subject][topic][subTopic]) acc[subject][topic][subTopic] = [];
        acc[subject][topic][subTopic].push(item.questionId);
        return acc;
      }, {});

      setHierarchy(groupedData);
    };

    fetchBookmarks();
  }, []);

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isExpanded = (key) => !!expandedSections[key];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bookmarks</h1>
      {Object.keys(hierarchy).map((subject) => (
        <div key={subject} className="mb-6 border rounded-lg bg-white shadow">
          {/* Subject */}
          <div
            className="bg-blue-500 text-white px-4 py-2 text-lg font-semibold cursor-pointer flex justify-between"
            onClick={() => toggleSection(subject)}
          >
            <span>{subject}</span>
            <span>{isExpanded(subject) ? "−" : "+"}</span>
          </div>
          {isExpanded(subject) && (
            <div className="pl-4">
              {Object.keys(hierarchy[subject]).map((topic) => (
                <div key={topic} className="mb-4">
                  {/* Topic */}
                  <div
                    className="bg-green-500 text-white px-4 py-2 text-md font-medium cursor-pointer flex justify-between"
                    onClick={() => toggleSection(`${subject}-${topic}`)}
                  >
                    <span>{topic}</span>
                    <span>
                      {isExpanded(`${subject}-${topic}`) ? "−" : "+"}
                    </span>
                  </div>
                  {isExpanded(`${subject}-${topic}`) && (
                    <div className="pl-4">
                      {Object.keys(hierarchy[subject][topic]).map(
                        (subTopic) => (
                          <div key={subTopic} className="mb-4">
                            {/* SubTopic */}
                            <div
                              className="bg-purple-500 text-white px-4 py-2 text-sm font-medium cursor-pointer flex justify-between"
                              onClick={() =>
                                toggleSection(
                                  `${subject}-${topic}-${subTopic}`
                                )
                              }
                            >
                              <span>{subTopic}</span>
                              <span>
                                {isExpanded(
                                  `${subject}-${topic}-${subTopic}`
                                )
                                  ? "−"
                                  : "+"}
                              </span>
                            </div>
                            {isExpanded(`${subject}-${topic}-${subTopic}`) && (
                              <div className="pl-4">
                                {hierarchy[subject][topic][subTopic].map(
                                  (question) => (
                                    <div
                                      key={question._id}
                                      className="bg-gray-100 border rounded p-4 mt-2"
                                    >
                                      <p className="text-gray-800 text-sm font-semibold">
                                        {question.questionText}
                                      </p>
                                      <p className="text-gray-600 text-xs">
                                        <strong>Type:</strong>{" "}
                                        {question.questionType}
                                      </p>
                                      <p className="text-gray-600 text-xs">
                                        <strong>Correct Answer:</strong>{" "}
                                        {question.correctAnswer}
                                      </p>
                                      {question.option.length > 0 && (
                                        <ul className="mt-2 pl-5 list-disc text-gray-700 text-sm">
                                          {question.option.map(
                                            (opt, index) => (
                                              <li key={index}>{opt}</li>
                                            )
                                          )}
                                        </ul>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BookmarkHierarchy;
