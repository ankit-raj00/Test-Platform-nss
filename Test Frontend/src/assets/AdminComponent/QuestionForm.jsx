import React, { useState } from "react";

const QuestionForm = ({ onSubmitQuestionIds }) => {
  const [questions, setQuestions] = useState([
    {
      subject: "",
      questionText: "",
      option: [""],
      correctAnswer: "",
      questionType: "SCQ",
      topic: "",
      subTopic: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].option[optIndex] = value;
    setQuestions(updatedQuestions);
  };

  const addOption = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].option.push("");
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        subject: "",
        questionText: "",
        option: [""],
        correctAnswer: "",
        questionType: "SCQ",
        topic: "",
        subTopic: "",
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/v1/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questions }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      const questionIds = data.data.map((question) => question._id);
      onSubmitQuestionIds(questionIds);

      alert("Questions added successfully!");
      setQuestions([
        {
          subject: "",
          questionText: "",
          option: [""],
          correctAnswer: "",
          questionType: "SCQ",
          topic: "",
          subTopic: "",
        },
      ]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {questions.map((question, qIndex) => (
          <div key={qIndex}>
            <h3>Question {qIndex + 1}</h3>
            <input
              type="text"
              placeholder="Subject"
              value={question.subject}
              onChange={(e) =>
                handleChange(qIndex, "subject", e.target.value)
              }
            />
            <textarea
              placeholder="Question Text"
              value={question.questionText}
              onChange={(e) =>
                handleChange(qIndex, "questionText", e.target.value)
              }
            />
            {question.questionType !== "INT" && (
              <div>
                <h4>Options</h4>
                {question.option.map((opt, optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    placeholder={`Option ${optIndex + 1}`}
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(qIndex, optIndex, e.target.value)
                    }
                  />
                ))}
                <button type="button" onClick={() => addOption(qIndex)}>
                  Add Option
                </button>
              </div>
            )}
            <input
              type="text"
              placeholder="Correct Answer"
              value={question.correctAnswer}
              onChange={(e) =>
                handleChange(qIndex, "correctAnswer", e.target.value)
              }
            />
            <select
              value={question.questionType}
              onChange={(e) =>
                handleChange(qIndex, "questionType", e.target.value)
              }
            >
              <option value="SCQ">SCQ</option>
              <option value="MCQ">MCQ</option>
              <option value="INT">INT</option>
            </select>
          </div>
        ))}
        <button type="button" onClick={addQuestion}>
          Add Another Question
        </button>
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Questions"}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default QuestionForm;
