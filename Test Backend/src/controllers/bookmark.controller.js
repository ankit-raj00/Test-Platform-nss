import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Bookmark } from "../models/Bookmark.model.js";
import { Question } from "../models/question.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// TOGGLE: Add or remove a bookmark
const toggleBookmark = asyncHandler(async (req, res, next) => {
  const { questionId } = req.params;
  const userId = req.user._id;

  // Validate inputs
  if (!userId || !questionId) {
    throw new ApiError(400, "User ID and Question ID are required");
  }
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(questionId)) {
    throw new ApiError(400, "Invalid User ID or Question ID");
  }

  // Check if the bookmark already exists
  const existingBookmark = await Bookmark.findOne({ userId, questionId });
  if (existingBookmark) {
    // Remove the bookmark
    await Bookmark.findByIdAndDelete(existingBookmark._id);
    res.status(200).json(new ApiResponse(200, null, "Bookmark removed successfully"));
  } else {
    // Add the bookmark
    const newBookmark = await Bookmark.create({ userId, questionId });
    res.status(200).json(new ApiResponse(200, newBookmark, "Bookmark added successfully"));
  }
});

// GET: Get all bookmarked questions for a particular user
const getUserBookmarks = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

  // Validate User ID
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid User ID");
  }

  // Fetch all bookmarks for the user
  const bookmarks = await Bookmark.find({ userId }).populate("questionId");
  res.status(200).json(new ApiResponse(200, bookmarks, "Bookmarked questions fetched successfully"));
});

// GET: Get all users who bookmarked a particular question
const getQuestionBookmarkUsers = asyncHandler(async (req, res, next) => {
  const { questionId } = req.params;

  // Validate Question ID
  if (!questionId || !mongoose.Types.ObjectId.isValid(questionId)) {
    throw new ApiError(400, "Invalid Question ID");
  }

  // Fetch all users who bookmarked the question
  const bookmarks = await Bookmark.find({ questionId }).populate("userId", "name email");
  res.status(200).json(new ApiResponse(200, bookmarks, "Users who bookmarked the question fetched successfully"));
});

export { toggleBookmark, getUserBookmarks, getQuestionBookmarkUsers };
