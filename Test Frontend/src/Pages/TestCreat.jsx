import React, { useState } from "react";
import { createTest, createQuestion } from "../Backend/config";

const TestCreat = () => {
  const [test, setTest] = useState({
    title: "",
    pattern: "",
    totalMarks: "",
    duration: "",
    testDateAndTime: "",
    validity: "",
    syllabus: "",
  });

  const [questions, setQuestions] = useState([
    {
      questionText: "",
      subject: "",
      topic: "",
      subTopic: "",
      option: ["", "", "", ""], // Default 4 options
      correctAnswer: "",
      questionType: "SCQ",
      image: null,
    },
  ]);

  const handleTestChange = (e) => {
    setTest({ ...test, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (index, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].option[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        subject: "",
        topic: "",
        subTopic: "",
        option: ["", "", "", ""],
        correctAnswer: "",
        questionType: "SCQ",
        image: null,
      },
    ]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const questionIds = [];

      for (const question of questions) {
        const formData = new FormData();
        formData.append("questionText", question.questionText);
        formData.append("subject", question.subject);
        formData.append("topic", question.topic);
        formData.append("subTopic", question.subTopic);
        question.option.forEach((opt, index) => {
          formData.append(`option[${index}]`, opt);
        }); // Pass options as a JSON string
        formData.append("correctAnswer", question.correctAnswer);
        formData.append("questionType", question.questionType);

        if (question.image) {
          formData.append("questionImage", question.image);
        }

        const response = await createQuestion({ formData });
        console.log(response)
        if (!response.success) throw new Error(response.message);
        questionIds.push(response.data._id);
      }

      const updatedTest = { ...test, testQuestions: questionIds };
      const Testresponse = await createTest({ test: updatedTest });

      if (Testresponse.success) {
        alert("Test created successfully!");
      } else {
        throw new Error(Testresponse.message);
      }
    } catch (error) {
      console.error("Error creating test:", error);
      alert("Error creating test");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Create Test</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <input
          type="text"
          name="title"
          placeholder="Test Title"
          value={test.title}
          onChange={handleTestChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="pattern"
          placeholder="Pattern (e.g., MCQ)"
          value={test.pattern}
          onChange={handleTestChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="syllabus"
          placeholder="Syllabus"
          value={test.syllabus}
          onChange={handleTestChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="totalMarks"
          placeholder="Total Marks"
          value={test.totalMarks}
          onChange={handleTestChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="duration"
          placeholder="Duration (in minutes)"
          value={test.duration}
          onChange={handleTestChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="datetime-local"
          name="testDateAndTime"
          value={test.testDateAndTime}
          onChange={handleTestChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="validity"
          placeholder="Validity (in hours)"
          value={test.validity}
          onChange={handleTestChange}
          className="w-full p-2 border rounded"
        />

        <h2 className="text-xl font-bold mt-4">Questions</h2>
        {questions.map((q, index) => (
          <div key={index} className="space-y-2 bg-gray-50 p-4 rounded border">
            <h3 className="text-lg font-semibold">Question {index + 1}</h3>
            <input
              type="text"
              placeholder="Question Text"
              value={q.questionText}
              onChange={(e) => handleQuestionChange(index, "questionText", e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Subject"
              value={q.subject}
              onChange={(e) => handleQuestionChange(index, "subject", e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Topic"
              value={q.topic}
              onChange={(e) => handleQuestionChange(index, "topic", e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Sub-Topic"
              value={q.subTopic}
              onChange={(e) => handleQuestionChange(index, "subTopic", e.target.value)}
              className="w-full p-2 border rounded"
            />
            <select
              value={q.questionType}
              onChange={(e) => handleQuestionChange(index, "questionType", e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="SCQ">Single Choice Question</option>
              <option value="MCQ">Multiple Choice Question</option>
              <option value="INT">Integer Answer</option>
            </select>
            {q.questionType !== "INT" &&
  q.option.map((opt, optIndex) => (
    <input
      key={optIndex}
      type="text"
      placeholder={`Option ${optIndex + 1}`}
      value={opt}
      onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
      className="w-full p-2 border rounded"
    />
  ))}

            <button
              type="button"
              onClick={() => {
                const updatedQuestions = [...questions];
                updatedQuestions[index].option.push("");
                setQuestions(updatedQuestions);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded mt-2"
            >
              Add Option
            </button>
            <button
              type="button"
              onClick={() => {
                const updatedQuestions = [...questions];
                updatedQuestions[index].option.pop();
                setQuestions(updatedQuestions);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded mt-2"
            >
              Remove Option
            </button>
            <input
              type="text"
              placeholder="Correct Answer"
              value={q.correctAnswer}
              onChange={(e) => handleQuestionChange(index, "correctAnswer", e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleQuestionChange(index, "image", e.target.files[0])}
              className="w-full p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => removeQuestion(index)}
              className="px-4 py-2 bg-red-500 text-white rounded mt-2"
            >
              Remove Question
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addQuestion}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Question
        </button>
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
          Submit Test
        </button>
      </form>
    </div>
  );
};

export default TestCreat;
