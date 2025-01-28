import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStudentInput } from "../Store/authslice";

const QuestionViewer = () => {
  const dispatch = useDispatch();

  // Question Data
  const questions = [
    {
      id: "Q1",
      subject: "Physics",
      text: "What is the acceleration due to gravity on Earth?",
      options: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "11 m/s²"],
    },
    {
      id: "Q2",
      subject: "Chemistry",
      text: "What is the chemical formula for water?",
      options: ["H2O", "CO2", "O2", "NaCl"],
    },
    {
      id: "Q3",
      subject: "Mathematics",
      text: "What is the derivative of x²?",
      options: ["x", "2x", "x²", "2x²"],
    },
  ];

  // Redux State
  const studentInput = useSelector((state) => state.auth.studentInput);

  // Local State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  // Get the current question
  const question = questions[currentQuestionIndex];

  // Sync the selected option and timer with the previously saved response (if any)
  useEffect(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }

    const previousResponse = studentInput.find(
      (input) => input.questionId === question.id
    );

    setSelectedOption(previousResponse?.selectedOption[0] || null);
    setTimer(previousResponse?.time || 0);

    const newIntervalId = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    setIntervalId(newIntervalId);

    return () => {
      clearInterval(newIntervalId);
    };
  }, [currentQuestionIndex, studentInput, question.id]);

  // Save or update the response in Redux store
  const saveResponse = (status) => {
    const response = {
      questionId: question.id,
      subject: question.subject,
      selectedOption: [selectedOption] || null,
      status,
      time: timer,
    };

    const updatedStudentInput = [...studentInput];
    const existingResponseIndex = updatedStudentInput.findIndex(
      (input) => input.questionId === question.id
    );

    if (existingResponseIndex !== -1) {
      updatedStudentInput[existingResponseIndex] = response;
    } else {
      updatedStudentInput.push(response);
    }

    dispatch(setStudentInput(updatedStudentInput));
  };

  const handleSaveAndNext = () => {
    if (!selectedOption) {
      alert("Please choose an option");
      return;
    }
    saveResponse(1);
    setCurrentQuestionIndex((prev) => (prev === questions.length - 1 ? 0 : prev + 1));
  };

  const handleSaveAndMarkForReview = () => {
    if (!selectedOption) {
      alert("Please choose an option");
      return;
    }
    saveResponse(2);
    setCurrentQuestionIndex((prev) => (prev === questions.length - 1 ? 0 : prev + 1));
  };

  const handleMarkForReviewAndNext = () => {
    saveResponse(3);
    setCurrentQuestionIndex((prev) => (prev === questions.length - 1 ? 0 : prev + 1));
  };

  const handleNext = () => {
    const existingResponse = studentInput.find(
      (input) => input.questionId === question.id
    );

    if (!existingResponse ||  existingResponse.status == 0) {
      // Save as not answered (status 0)
      saveResponse(0);
    } else if (existingResponse && selectedOption && existingResponse.status == 1||2||3) {
      // Do not save
      setCurrentQuestionIndex((prev) => (prev === questions.length - 1 ? 0 : prev + 1));
      return;
    } else if (existingResponse.status != 0) {
      // Save as not answered (status 0)
      saveResponse(existingResponse.status);
    }
    setCurrentQuestionIndex((prev) => (prev === questions.length - 1 ? 0 : prev + 1));
  };
  const handleBack = () => {
    const existingResponse = studentInput.find(
      (input) => input.questionId === question.id
    );

    if (!existingResponse || !selectedOption || existingResponse.status == 0) {
      // Save as not answered (status 0)
      saveResponse(0);
    } else if (existingResponse && selectedOption && existingResponse.status == 1) {
      // Do not save
      setCurrentQuestionIndex((prev) => (prev === 0 ? questions.length - 1 : prev - 1));
      return;
    } else if (existingResponse.status != 0) {
      // Save as not answered (status 0)
      saveResponse(existingResponse.status);
    }
    setCurrentQuestionIndex((prev) => (prev === 0 ? questions.length - 1 : prev - 1));
  };

  const handleClear = () => {
    setSelectedOption(null);
    const updatedStudentInput = studentInput.filter(
      (input) => input.questionId !== question.id
    );
    dispatch(setStudentInput(updatedStudentInput));
  };

  const handleQuestionNavigation = (index) => {
    saveResponse(0);
    setCurrentQuestionIndex(index);
  };

  const countStatus = () => {
    const counts = {
      notVisited: questions.length,
      notAnswered: 0,
      answered: 0,
      markedForReview: 0,
      answeredAndMarkedForReview: 0,
    };

    studentInput.forEach((input) => {
      counts.notVisited--;
      if (input.status === 0) {
        counts.notAnswered++;
      } else if (input.status === 2) {
        counts.markedForReview++;
      } else if (input.status === 3) {
        counts.answeredAndMarkedForReview++;
      } else if (input.status === 1) {
        counts.answered++;
      }
    });

    return counts;
  };

  const statusCounts = countStatus();

  const getButtonColor = (index) => {
    const response = studentInput.find((input) => input.questionId === questions[index].id);
    if (!response) return "bg-gray-200";
    if (response.status === 0) return "bg-red-400";
    if (response.selectedOption[0] && response.status === 1) return "bg-green-400";
    if (response.selectedOption[0] && response.status === 2) return "bg-purple-400";
    if (response.status === 3) return "bg-yellow-400";
    return "bg-gray-200";
  };

  return (
    <div className="flex">
      {/* Question Viewer */}
      <div className="flex-1 p-6 font-sans">
        <h2 className="text-2xl font-bold">Question {currentQuestionIndex + 1}</h2>
        <p className="text-lg font-semibold">
          <span className="text-gray-600">Subject:</span> {question.subject}
        </p>
        <p className="mt-2 text-lg">{question.text}</p>
        <p className="mt-2 text-sm text-gray-500">Time Spent: {timer} seconds</p>

        {/* Options */}
        <div className="mt-4 space-y-2">
          {question.options.map((option, index) => (
            <label key={index} className="flex items-center">
              <input
                type="radio"
                className="mr-2 w-4 h-4"
                name="option"
                value={option}
                checked={selectedOption === option}
                onChange={() => setSelectedOption(option)}
              />
              <span className="text-md">{option}</span>
            </label>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleSaveAndNext}
          >
            Save & Next
          </button>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={handleClear}
          >
            Clear
          </button>
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            onClick={handleSaveAndMarkForReview}
          >
            Save & Mark for Review
          </button>
          <button
            className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
            onClick={handleMarkForReviewAndNext}
          >
            Mark for Review & Next
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleBack}
          >
            Back
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>

      {/* Question Navigation */}
      <div className="w-64 border-l p-4 font-sans">
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded shadow">
            <h3 className="text-lg font-bold">Status Count</h3>
            <div className="text-sm mt-2">
              <p>Not Visited: {statusCounts.notVisited}</p>
              <p>Not Answered: {statusCounts.notAnswered}</p>
              <p>Answered: {statusCounts.answered}</p>
              <p>Marked for Review: {statusCounts.markedForReview}</p>
              <p>Answered & Marked for Review: {statusCounts.answeredAndMarkedForReview}</p>
            </div>
          </div>
          <h3 className="text-lg font-bold">Questions</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                className={`w-8 h-8 text-sm font-bold text-white rounded ${getButtonColor(index)}`}
                onClick={() => handleQuestionNavigation(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionViewer;
