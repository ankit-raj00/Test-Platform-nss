import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStudentInput } from "../Store/authslice";
import { getTestDetail , uploadResponse } from "../Backend/config";
const TestComp = ({ testId }) => {

  

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Are you sure you want to leave? Changes may not be saved.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const dispatch = useDispatch();

  // Redux State
  const studentInput = useSelector((state) => state.auth.studentInput);
  const userdetail = useSelector((state)=>state.auth.userData)
  
  

  // Local State
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
  const [selectedOptions, setSelectedOptions] = useState([]); // For MCQ and INT
  const [selectedOption, setSelectedOption] = useState(null); // For SCQ
  const [inputAnswer, setInputAnswer] = useState(""); // For INT
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [testActive, setTestActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Tracks if test is submitted
  const [showInstructions, setShowInstructions] = useState(true);



  const question = questions[currentQuestionIndex];
  
 
    const fetchQuestions = async () => {
      try {
    
        const data = await getTestDetail({id : testId})
        const selectedTest = data.data
        console.log(selectedTest)

        if (selectedTest) {
          const { testQuestions, testDateAndTime, duration } = selectedTest;
          const mappedQuestions = testQuestions.map(({_id , subject , questionText , questionType , option , questionImg }) => {
            const type = questionType // Extract question type (SCQ, MCQ, INT)
            const options =option;
            const text = questionText;
            const id = _id
            return { id, subject, text, type, options , questionImg };
          });

          setQuestions(mappedQuestions);
          setRemainingTime(duration*60);
          setTestActive(true);
        
          
          console.log(testDateAndTime);
        } else {
          console.log(`Test with ID ${testId} not found.`);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    
 
  useEffect(() => {
    
    if (remainingTime < 0 && testActive) {
      setTestActive(false);
      clearInterval(intervalId);
      alert("Time is up! The test has endedhhh.");
      return;
    }
    if(!testActive){
      clearInterval(intervalId);
      return;
      
      
    }
    const countdownInterval = setInterval(() => {
      setRemainingTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [remainingTime]);

  useEffect(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }

    const previousResponse = studentInput.find(
      (input) => input.questionId === question?.id
    );

    setSelectedOption(previousResponse?.selectedOption || null);
    setSelectedOptions(previousResponse?.selectedOptions || []);
    setInputAnswer(previousResponse?.inputAnswer || "");
    setTimer(previousResponse?.time || 0);

    const newIntervalId = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    setIntervalId(newIntervalId);

    return () => {
      clearInterval(newIntervalId);
    };
  }, [currentQuestionIndex,  question?.id]);

  const saveResponse = (status) => {
    if (!testActive) return;

    const response = {
      questionId: question.id,
     
      subject: question.subject,
      type: question.type,
      selectedOption: question.type === "SCQ" ? selectedOption : null,
      selectedOptions: question.type === "MCQ" ? selectedOptions : [],
      inputAnswer: question.type === "INT" ? inputAnswer : "",
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
    console.log(updatedStudentInput)
    dispatch(setStudentInput(updatedStudentInput));
  };

  const handleSaveAndNext = () => {
  if (
    question.type === "SCQ" && !selectedOption ||
    question.type === "MCQ" && selectedOptions.length === 0 ||
    question.type === "INT" && inputAnswer.trim() === ""
  ) {
    alert("Please choose an option or provide an answer.");
    return;
  }
  saveResponse(1);
  setCurrentQuestionIndex((prev) => (prev === questions.length - 1 ? 0 : prev + 1));
};

  const handleSaveAndMarkForReview = () => {
  if (
    question.type === "SCQ" && !selectedOption ||
    question.type === "MCQ" && selectedOptions.length === 0 ||
    question.type === "INT" && inputAnswer.trim() === ""
  ) {
    alert("Please choose an option or provide an answer.");
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
    setSelectedOptions([]);
    setInputAnswer("");
    const updatedStudentInput = studentInput.filter(
      (input) => input.questionId !== question.id
    );
    dispatch(setStudentInput(updatedStudentInput));
  };

  const handleQuestionNavigation = (index) => {
    
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
    if (response.selectedOption || response.selectedOptions.length || response.inputAnswer) {
      if (response.status === 1) return "bg-green-400";
      if (response.status === 2) return "bg-yellow-400";
    }
    if (response.status === 3) return "bg-purple-400";
    return "bg-gray-200";
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  const handleAgree = () => {
    setShowInstructions(false); // Hide the instructions
     // Start the test
    fetchQuestions(); // Fetch questions when test starts
  };



  const handleSubmit = async () => {
    if (isSubmitted) {
      alert("You have already submitted the test!");
      return;
    }

    // Confirmation dialog
    const confirmSubmit = window.confirm(
      "Are you sure you want to submit the test? Once submitted, you cannot make changes."
    );

    if (!confirmSubmit) return;

    try {
      // Save all unanswered questions with status 4
      const updatedStudentInput = [...studentInput];
      
      questions.forEach((question) => {
        const existingResponseIndex = updatedStudentInput.findIndex(
          (input) => input.questionId === question.id
        );

        if (existingResponseIndex === -1) {
          // No response exists, save as status 4
          updatedStudentInput.push({
            questionId: question.id,
            subject: question.subject,
            questionImg : question.questionImg,
            type: question.type,
            selectedOption: null,
            selectedOptions: [],
            inputAnswer: "",
            status: 0,
            time: 0,
          });
        } 
      });

      // Dispatch updated responses without affecting the current question
      dispatch(setStudentInput(updatedStudentInput));

      // Prepare payload for submission
      const payload = {
        enroll: userdetail.data.enroll,
        testId,
        responses: updatedStudentInput,
      };

      // Post the response to the server
      const response = await uploadResponse({ payload: payload });
      console.log(response);

      if (response.success) {
        alert("Test submitted successfully!");
        setTestActive(false); // Disable test controls
        setIsSubmitted(true); // Track submit state
      } else {
        const error = await response.json();
        alert("Submission failed: " + error.message);
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("An error occurred while submitting the test. Please try again.");
    }
  };

  const handleSubmit1 = async () => {
    if (isSubmitted) {
      alert("You have already submitted the test!");
      return;
    }
  
    // Confirmation dialog
    const confirmSubmit = window.confirm(
      "Are you sure you want to submit the test? Once submitted, you cannot make changes."
    );
  
    if (!confirmSubmit) return;
    
    try {
      // Post the response to the server

      
        const payload = {
          enroll : userdetail.data.enroll,
          testId,
          responses : studentInput 
        }
      
      const response = await uploadResponse({payload : payload})
      console.log(response)
  
      if (response.success) {
        alert("Test submitted successfully!");
        setTestActive(false); // Disable test controls
        setIsSubmitted(true); // Track submit state
      } else {
        const error = await response.json();
        alert("Submission failed: " + error.message);
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("An error occurred while submitting the test. Please try again.");
    }
  };
  



  return (
    
    <div className="flex flex-col">
      {showInstructions && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-3/4 md:w-1/2">
            <h2 className="text-xl font-bold mb-4">Test Instructions</h2>
            <ul className="list-disc pl-6 text-left">
              <li>Read each question carefully before answering.</li>
              <li>Make sure to save your answers before navigating to the next question.</li>
              <li>You cannot change your answers after submitting the test.</li>
              <li>Do not refresh or close the browser during the test.</li>
            </ul>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleAgree}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}
      
    {!showInstructions &&(
      <>
      <div className="text-center py-2 bg-gray-100 text-lg font-bold">
      Remaining Time: {formatTime(remainingTime)}
    </div>
    

    <div className="flex flex-col md:flex-row">
      <div className="flex-1 p-4 md:p-6 font-sans">
        <h2 className="text-xl md:text-2xl font-bold">Question {currentQuestionIndex + 1}</h2>
        <p className="text-md md:text-lg font-semibold">
          <span className="text-gray-600">Subject:</span> {question?.subject}
        </p>
        <p className="mt-2 text-md md:text-lg">{question?.text}</p>
        <p className="mt-2 text-sm text-gray-500">Time Spent: {timer} seconds</p>
        {question?.questionImg && (
    <div className="mt-2 flex justify-center">
        <img 
            src={question.questionImg} 
            alt="Question Illustration" 
            className="max-w-[400px] max-h-[300px] w-auto h-auto border rounded-md"
            onClick={openModal}
        />
    </div>
)}
{isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={closeModal}
                >
                    <div className="relative">
                        <img
                            src={question.questionImg}
                            alt="Full Size Illustration"
                            className="max-h-[90vh] max-w-[90vw] object-contain"
                        />
                        <button
                            className="absolute top-2 right-2 text-white bg-black rounded-full p-2"
                            onClick={closeModal}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

        <div className="mt-4 space-y-2">
          {question?.type === "SCQ" &&
            question.options.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  className="mr-2 w-4 h-4"
                  name="option"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => setSelectedOption(option)}
                  disabled={!testActive}
                />
                <span className="text-sm md:text-md">{option}</span>
              </label>
            ))}

          {question?.type === "MCQ" &&
            question.options.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 w-4 h-4"
                  value={option}
                  checked={selectedOptions.includes(option)}
                  onChange={() => {
                    setSelectedOptions((prev) =>
                      prev.includes(option)
                        ? prev.filter((opt) => opt !== option)
                        : [...prev, option]
                    );
                  }}
                  disabled={!testActive}
                />
                <span className="text-sm md:text-md">{option}</span>
              </label>
            ))}

          {question?.type === "INT" && (
            <input
              type="text"
              className="mt-2 border border-gray-300 rounded w-full p-2"
              placeholder="Enter your answer"
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value)}
              disabled={!testActive}
            />
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleSaveAndNext}
            disabled={!testActive}
          >
            Save & Next
          </button>
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded"
            onClick={handleSaveAndMarkForReview}
            disabled={!testActive}
          >
            Save & Mark for Review
          </button>
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded"
            onClick={handleMarkForReviewAndNext}
            disabled={!testActive}
          >
            Mark for Review & Next
          </button>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded"
            onClick={handleClear}
            disabled={!testActive}
          >
            Clear
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={handleBack}
            disabled={!testActive}
          >
            Back
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={handleNext}
            disabled={!testActive}
          >
            Next
          </button>
          <button
          className="px-4 py-2 bg-blue-700 text-white rounded"
          onClick={handleSubmit}
          disabled={!testActive || isSubmitted} // Disable after submit
  >
    Submit
  </button>
        </div>
      </div>

      <div className="w-full md:w-1/4 p-4 md:p-6 bg-gray-200">
        <div className="p-4 bg-white rounded shadow-md">
          <h3 className="text-md md:text-lg font-bold">Status</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="p-2 bg-gray-300 rounded text-center">Not Visited: {statusCounts.notVisited}</div>
            <div className="p-2 bg-red-400 rounded text-center">Not Answered: {statusCounts.notAnswered}</div>
            <div className="p-2 bg-green-400 rounded text-center">Answered: {statusCounts.answered}</div>
            <div className="p-2 bg-yellow-400 rounded text-center">Marked for Review: {statusCounts.markedForReview}</div>
            <div className="p-2 bg-purple-400 rounded text-center">Answered & Marked for Review: {statusCounts.answeredAndMarkedForReview}</div>
          </div>
        </div>

        <h3 className="mt-6 text-md md:text-lg font-bold">Question Navigation</h3>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`px-2 py-1 text-black rounded ${getButtonColor(index)}`}
              onClick={() => handleQuestionNavigation(index)}
              disabled={!testActive}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
      </>
    )}
  </div>


  );
};

export default TestComp;
