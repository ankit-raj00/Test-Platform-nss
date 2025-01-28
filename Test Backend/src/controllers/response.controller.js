import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Response } from "../models/response.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
// CREATE: Add new response
const addResponse = asyncHandler(async (req, res, next) => {
  const { enroll, testId, responses } = req.body;

  if (!enroll || !testId || !responses || responses.length === 0) {
    throw new ApiError(400, "Missing required fields: enroll, testId, or responses.");
  }
  
  
   // Replace with the actual id

 
  try {
    const response = await Response.create({
        enroll,
        testId,
        responses
    })

    const newtestId = new mongoose.Types.ObjectId(response._id);
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      { $push: { testHistory: newtestId } }, 
      { new: true } // Return the updated document
  );
  const history = updatedUser.testHistory

 
    res.status(200).json(new ApiResponse(200, {response, history }, "Response added successfully"));
  } catch (error) {
    throw new ApiError(500, "Error occurred while adding responses.");
  }
});

// READ: Get all responses or a specific response by ID
const getResponses = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (id) {
    // Get specific response by ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid response ID");
    }

    const response = await Response.findById(id).populate("responses.questionId");
    if (!response) {
      throw new ApiError(404, "Response not found");
    }

    res.status(200).json(new ApiResponse(200, response, "Response fetched successfully"));
  } else {
    // Get all responses
    const responses = await Response.find().populate("responses.questionId");
    res.status(200).json(new ApiResponse(200, responses, "Responses fetched successfully"));
  }
});

// UPDATE: Update a specific response's fields
const updateResponse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { enroll, testId, responses } = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid or missing response ID in the request body");
  }

  const updateData = {};
  if (enroll) updateData.enroll = enroll;
  if (testId) updateData.testId = testId;
  if (responses) updateData.responses = responses;

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "No valid fields provided for update.");
  }

  const updatedResponse = await Response.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedResponse) {
    throw new ApiError(404, "Response not found");
  }

  res.status(200).json(new ApiResponse(200, updatedResponse, "Response updated successfully"));
});

// DELETE: Delete a specific response by ID
const deleteResponse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid response ID");
  }

  const deletedResponse = await Response.findByIdAndDelete(id);
  if (!deletedResponse) {
    throw new ApiError(404, "Response not found");
  }

  res.status(200).json(new ApiResponse(200, deletedResponse, "Response deleted successfully"));
});

export { addResponse, getResponses, updateResponse, deleteResponse };
