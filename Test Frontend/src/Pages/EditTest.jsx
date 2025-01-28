import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTestDetail , updateQuestion , updateTest , createQuestion } from "../Backend/config";

const EditTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState({
    title: "",
    pattern: "",
    totalMarks: "",
    duration: "",
    testDateAndTime: "",
    validity : "",
    syllabus : "",
    questionImg : "",
  });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTestDetails = async () => {
    try {

      const testData = await getTestDetail({id})
      console.log(testData)
  
      if (!testData) throw new Error(testData.message || "Failed to fetch test details");
  
      const questionData = testData.data.testQuestions;
      console.log(questionData)
      
      // Convert the UTC time to the local time of the user's browser
      const utcDate = new Date(testData.data.testDateAndTime);
      const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000); // Convert to local time
  
      // Format the date to match the input field format: 'YYYY-MM-DDTHH:mm'
      const formattedTestDateAndTime = localDate.toISOString().slice(0, 16); 
  
      setTest({
        title: testData.data.title,
        pattern: testData.data.pattern,
        totalMarks: testData.data.totalMarks,
        duration: testData.data.duration,
        testDateAndTime: formattedTestDateAndTime,
        validity : testData.data.validity, // Set formatted local date
        syllabus : testData.data.syllabus,
        questionImg : testData.data.questionImg

      });
      setQuestions(questionData);
      console.log(questionData)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      alert("Failed to fetch test details");
    }
  };
  
  useEffect(() => {
    fetchTestDetails();
  }, [id]);

  const handleTestChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name}:`, value);
    setTest({
      ...test,
      [name]: name === "duration" || name === "totalMarks" || name === "validity" ? Number(value) : value,
    });
  };
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].option.push(""); // Add a new empty option
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
        imageFile: null,
      },
    ]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1); // Remove the question at the specified index
    setQuestions(updatedQuestions);
  };


  const handleUpdateTest = async ({ id, test, navigate }) => {
    try {
      console.log("tt" , test)
      const testing= await updateTest({ id, test });
      console.log(testing)
      alert("Test updated successfully!");
      navigate("/admin-dash");
    } catch (error) {
      console.error("Error updating test:", error.message);
      alert("Error updating test");
    }
  };
  
  const handleUpdateQuestion = async (question) => {
    try {
      const formData = new FormData();
      formData.append("id", question._id); // Assuming question has an `id` field
      formData.append("questionText", question.questionText);
      formData.append("subject", question.subject);
      formData.append("topic", question.topic);
      formData.append("subTopic", question.subTopic);
      formData.append("questionType", question.questionType);
      formData.append("correctAnswer", question.correctAnswer);
  
      // Add options for non-integer question types
      if (question.questionType !== "INT") {
        question.option.forEach((opt, index) => {
          formData.append(`option[${index}]`, opt);
        });
      }
  
      // Add the image file if available
      if (question.imageFile) {
        formData.append("questionImage", question.imageFile);
      }
      
      
      await updateQuestion({question : formData , id : question._id}); // Make the API call with FormData
    } catch (error) {
      console.error("Error updating question:", error.message);
      alert("Error updating question");
    }
  };
  
  

  const handleUpdate = async (e) => {
  e.preventDefault();

  try {
    // Identify new questions (those without an _id)
    const newQuestions = questions.filter((q) => !q._id);

    // Create new questions and retrieve their IDs
    const newQuestionIds = await Promise.all(
      newQuestions.map(async (question) => {
        const formData = new FormData();
        formData.append("questionText", question.questionText);
        formData.append("subject", question.subject);
        formData.append("topic", question.topic);
        formData.append("subTopic", question.subTopic);
        formData.append("questionType", question.questionType);
        formData.append("correctAnswer", question.correctAnswer);

        // Add options if applicable
        if (question.questionType !== "INT") {
          question.option.forEach((opt, index) => {
            formData.append(`option[${index}]`, opt);
          });
        }

        // Add the image file if available
        if (question.imageFile) {
          formData.append("questionImage", question.imageFile);
        }

        // Create the question and return its ID
        const response = await createQuestion({ formData });
        return response.data._id; // Assuming the backend returns the ID in response.data._id
      })
    );

    // Combine new question IDs with existing ones
    const allQuestionIds = [
      ...questions.filter((q) => q._id).map((q) => q._id), // Existing question IDs
      ...newQuestionIds, // Newly created question IDs
    ];

    // Prepare the updated test object
    const updatedTest = {
      ...test,
      testQuestions: allQuestionIds, // Include all question IDs in the test object
    };

    // Update the test on the backend
    await handleUpdateTest({ id, test: updatedTest, navigate });

    // Update the state to include the new questions with their IDs
    const updatedQuestions = [
      ...questions.filter((q) => q._id), // Existing questions
      ...newQuestions.map((q, index) => ({ ...q, _id: newQuestionIds[index] })), // Add new questions with their IDs
    ];
    setQuestions(updatedQuestions);

    alert("Test and questions updated successfully!");
  } catch (error) {
    console.error("Error during update:", error.message);
    alert("Error updating test or questions");
  }
};


  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Edit Test</h1>
      <form onSubmit={handleUpdate} className="space-y-4 bg-white p-6 rounded shadow">
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
          placeholder="syllabus"
          value={test.syllabus}
          onChange={handleTestChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          onWheel={(e) => e.target.blur()}
          name="totalMarks"
          placeholder="Total Marks"
          value={test.totalMarks}
          onChange={handleTestChange}
          className="w-full p-2 border rounded"
        />
        <input
  type="number"
  name="duration"
  onWheel={(e) => e.target.blur()}
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
          onWheel={(e) => e.target.blur()}
          name="validity"
          placeholder="Validity (in days)"
          value={test.validity}
          onChange={handleTestChange}
          className="w-full p-2 border rounded"
        />

        <h2 className="text-xl font-bold mt-4">Questions</h2>
        {questions.map((q, index) => (
          <div key={index} className="space-y-2 bg-gray-50 p-4 rounded border">
            <h3 className="text-lg font-semibold">Question {index + 1}</h3>
            <button
              type="button"
              onClick={() => removeQuestion(index)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove Question
            </button>
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

            {q.questionType !== "INT" && (
              <>
                {q.option.map((opt, optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    placeholder={`Option ${optIndex + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const updatedOptions = [...q.option];
                      updatedOptions[optIndex] = e.target.value;
                      handleQuestionChange(index, "option", updatedOptions);
                    }}
                    className="w-full p-2 border rounded"
                  />
                ))}
                <button 
                  type="button" 
                  onClick={() => addOption(index)} 
                  className="mt-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Option
                </button>
              </>
            )}
            {q.questionImg && (
              
  <img
    src={q.questionImg}
    alt={`Question ${index + 1} Image`}
    className="w-32 h-32 object-cover mb-2"
  />
)}
{/* Input for uploading a new image */}
<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedQuestions = [...questions];
      updatedQuestions[index].imageFile = file; // Store the file for later processing
      setQuestions(updatedQuestions);
    }
  }}
  className="w-full p-2 border rounded"
/>
            <input
              type="text"
              placeholder="Correct Answer"
              value={q.correctAnswer}
              onChange={(e) => handleQuestionChange(index, "correctAnswer", e.target.value)}
              className="w-full p-2 border rounded"
            />
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
          Update Test
        </button>
      </form>
    </div>
  );
};

export default EditTest;
