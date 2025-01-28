import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Response } from "../models/response.model.js";
import { Question } from "../models/question.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// COMPUTE: Compute the result based on responses and update marks
const computeResult = asyncHandler(async (req, res, next) => {
  const { testId } = req.params;

  if (!testId) {
    throw new ApiError(400, "Test ID is required to compute results");
  }

  try {
    // Fetch all responses with the matching testId
    const responses = await Response.find({ testId });

    if (!responses || responses.length === 0) {
      throw new ApiError(404, "No responses found for the provided test ID");
    }

    // Iterate over each response and compute the marks
    for (const response of responses) {
      // Filter responses to only those with status 1 or 2
      const validResponses = response.responses.filter(
        (answer) => answer.status === 1 || answer.status === 2
      );

      // Loop through valid responses
      for (const answer of validResponses) {
        // Fetch the question details for the given questionId
        const question = await Question.findById(answer.questionId);

        if (!question) {
          console.warn(`Question with ID ${answer.questionId} not found.`);
          continue;
        }

        let marks = 0; // Default marks

        // Logic to compute marks based on question type
        if (question.questionType === "INT") {
          // For INT questions, match inputAnswer with correctAnswer
          if (answer.inputAnswer === question.correctAnswer) {
            marks = 4; // Assign marks (can customize this value)
          }else {
            marks = -1
          }
        } else if (question.questionType === "SCQ") {
          // For SCQ questions, match selectedOption with correctAnswer
          if (answer.selectedOption === question.correctAnswer) {
            marks = 4; // Assign marks
          }else{
            marks = -1;
          }
        } else if (question.questionType === "MCQ") {
          // For MCQ questions, check if selectedOptions match the correctAnswer
          const correctAnswers = question.correctAnswer.split(","); // Assuming correctAnswer is a comma-separated string
          const selectedOptionsSet = new Set(answer.selectedOptions.map(opt => opt.trim()));
          const correctAnswersSet = new Set(correctAnswers.map(opt => opt.trim()));
          console.log(selectedOptionsSet.size === correctAnswersSet.size &&
            [...selectedOptionsSet].every((opt) => correctAnswersSet.has(opt))
          )
          
          if (
            selectedOptionsSet.size === correctAnswersSet.size &&
            [...selectedOptionsSet].every((opt) => correctAnswersSet.has(opt))
          ) {
            marks = 4; // Assign marks
          }else{
            marks = -1
          }
        }

        // Update the marks field for this response
        answer.mark = marks;
      }

      // Save the updated response document
      await response.save();
    }

    res.status(200).json(new ApiResponse(200, null, "Marks computed and updated successfully"));
  } catch (error) {
    throw new ApiError(500, "Error occurred while computing results");
  }
});

export { computeResult };
