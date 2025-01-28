import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Question } from "../models/question.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// CREATE: Add new questions
const addQuestion = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const { 
    questionText, 
    subject, 
    topic, 
    subTopic, 
    option, 
    correctAnswer, 
    questionType 
  } = req.body;

  // Check if required fields are present
  if (!questionText || !subject  || !questionType) {
    return next(new ApiError(400, "Missing required fields"));
  }

  try {
    // Extract the file path if a file is uploaded
    const filePath = req.file ? req.file.path : null;

    // Attempt to upload the file to Cloudinary if a file is provided
    let questionImg = null;
    if (filePath) {
      try {
        const uploadedImg = await uploadOnCloudinary(filePath);
        questionImg = uploadedImg.url; // Save the uploaded image URL
        console.log("Uploaded image URL:", questionImg);
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return next(new ApiError(500, "Error occurred while uploading image to Cloudinary"));
      }
    }

    // Prepare question data
    const newQuestion = {
      questionText,
      subject,
      topic,
      subTopic,
      option,
      correctAnswer,
      questionType,
      questionImg, // This will be the uploaded URL or null if no file was uploaded
    };

    console.log("New Question Data:", newQuestion);

    // Save the question to the database
    const addedQuestion = await Question.create(newQuestion);

    // Send success response
    res.status(200).json(
      new ApiResponse(200, addedQuestion, "Question added successfully")
    );
  } catch (error) {
    // Handle potential errors in the process
    console.error("Error adding question:", error);
    return next(new ApiError(500, "Error occurred while adding the question"));
  }
});


export default addQuestion;
// READ: Get all questions or a single question by ID
const getQuestions = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (id) {
    // Get a specific question by ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid question ID");
    }

    const question = await Question.findById(id);
    if (!question) {
      throw new ApiError(404, "Question not found");
    }

    res.status(200).json(new ApiResponse(200, question, "Question fetched successfully"));
  } else {
    // Get all questions
    const questions = await Question.find();
    res.status(200).json(new ApiResponse(200, questions, "Questions fetched successfully"));
  }
});


// UPDATE: Update a question by ID
const updateQuestion = asyncHandler(async (req, res, next) => {
  const {
    questionText,
    subject,
    topic,
    subTopic,
    option,
    correctAnswer,
    questionType,
  } = req.body;
  const { id } = req.params;

  // Validate ID from the params
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, "Invalid or missing question ID in the request parameters"));
  }

  try {
    // Step 1: Extract the file path
    console.log(req.file)
    const filePath = req.file ? req.file.path : null;

    // Step 2: Upload to Cloudinary if a file path is available
    let questionImg = null;
    if (filePath) {
      try {
        questionImg = await uploadOnCloudinary(filePath);
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return next(new ApiError(500, "Error occurred while uploading image to Cloudinary"));
      }
    }

    // Step 3: Prepare update data
    const updateData = {};
    if (questionText) updateData.questionText = questionText;
    if (subject) updateData.subject = subject;
    if (topic) updateData.topic = topic;
    if (subTopic) updateData.subTopic = subTopic;
    if (option) updateData.option = option;
    if (correctAnswer) updateData.correctAnswer = correctAnswer;
    if (questionType) updateData.questionType = questionType;
    if (questionImg) updateData.questionImg = questionImg.url; // Set the uploaded image URL

    // Step 4: Validate if there are fields to update
    if (Object.keys(updateData).length === 0) {
      return next(new ApiError(400, "No valid fields provided for update"));
    }

    // Step 5: Update the question in the database
    const updatedQuestion = await Question.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedQuestion) {
      return next(new ApiError(404, "Question not found"));
    }

    // Step 6: Send the response
    res.status(200).json(
      new ApiResponse(200, updatedQuestion, "Question updated successfully")
    );
  } catch (error) {
    // Handle potential errors in the process
    console.error("Error updating question:", error);
    return next(new ApiError(500, "Error occurred while updating the question"));
  }
});

// DELETE: Delete a question by ID
const deleteQuestion = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid question ID");
  }

  const deletedQuestion = await Question.findByIdAndDelete(id);
  if (!deletedQuestion) {
    throw new ApiError(404, "Question not found");
  }

  res.status(200).json(new ApiResponse(200, deletedQuestion, "Question deleted successfully"));
});

export { addQuestion, getQuestions, updateQuestion, deleteQuestion };
