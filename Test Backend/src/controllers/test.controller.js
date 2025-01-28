import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Test } from "../models/test.model.js";
import { Question } from "../models/question.model.js";
import mongoose from "mongoose";

// CREATE: Add a new test
const addTest = asyncHandler(async (req, res, next) => {
  const { title, pattern, totalMarks, duration, testQuestions, testDateAndTime , validity ,syllabus} = req.body;
  console.log(req.body)
  const missingFields = [];

// Check for missing fields and add them to the array
if (!title) missingFields.push('title');
if (!pattern) missingFields.push('pattern');
if (!totalMarks) missingFields.push('totalMarks');
if (!duration) missingFields.push('duration');
if (!testDateAndTime) missingFields.push('testDateAndTime');

if (missingFields.length > 0) {
  throw new ApiError(400, `Missing fields: ${missingFields.join(', ')}`);
}

 
  console.log(req.body)
  try {
    const test = await Test.create({
      title,
      pattern,
      totalMarks,
      duration,
      testQuestions,
      testDateAndTime,
      validity,
      syllabus
    });
    console.log(test)
    res.status(200).json(new ApiResponse(200, test, "Test created successfully."));
  } catch (error) {
    throw new ApiError(500, "Error occurred while creating the test.");
  }
});

// READ: Get all tests or a specific test by ID
const getTests = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (id) {
    // Get a specific test by ID
    try {
      const test = await Test.findById(id).populate("testQuestions");
      if (!test) {
        throw new ApiError(404, "Test not found.");
      }

      
      res.status(200).json(new ApiResponse(200, test, "Test fetched successfully."));
    } catch (error) {
      throw new ApiError(500, "Error occurred while fetching the test.");
    }
  } else {
    // Get all tests
    try {
      const tests = await Test.find().populate("testQuestions");
      res.status(200).json(new ApiResponse(200, tests, "Tests fetched successfully."));
    } catch (error) {
      throw new ApiError(500, "Error occurred while fetching tests.");
    }
  }
});

// READ: Get a specific test with pipeline aggregation
const getTestWithDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid test ID.");
  }

  try {
    const pipeline = [
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "questions",
          localField: "testQuestions",
          foreignField: "_id",
          as: "testQuestions",
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          pattern: 1,
          time: { $concat: [{ $toString: "$duration" }, " minutes"] },
          totalMarks: 1,
          duration: 1,
          testQuestions: {
            questionId: "$testQuestions.questionId",
            subject: "$testQuestions.subject",
            questionText: "$testQuestions.questionText",
            option: "$testQuestions.option",
            correctAnswer: "$testQuestions.correctAnswer",
            questionType: "$testQuestions.questionType",
          },
          testDateAndTime: 1,
        },
      },
    ];

    const testDetails = await Test.aggregate(pipeline);
    if (!testDetails || testDetails.length === 0) {
      throw new ApiError(404, "Test not found.");
    }
    res.status(200).json(new ApiResponse(200, testDetails, "Test details fetched successfully."));
  } catch (error) {
    throw new ApiError(500, "Error occurred while fetching test details.");
  }
});

// UPDATE: Update a test by ID
const updateTest = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, pattern, totalMarks, duration, testQuestions, testDateAndTime , syllabus , validity } = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid test ID.");
  }

  const updateData = {};
  if (title) updateData.title = title;
  if (pattern) updateData.pattern = pattern;
  if (totalMarks) updateData.totalMarks = totalMarks;
  if (duration) updateData.duration = duration;
  if (testQuestions) updateData.testQuestions = testQuestions;
  if (testDateAndTime) updateData.testDateAndTime = testDateAndTime;
  if(validity) updateData.validity = validity;
  if(syllabus) updateData.syllabus = syllabus;

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "No valid fields provided for update.");
  }

  try {
    const updatedTest = await Test.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedTest) {
      throw new ApiError(404, "Test not found.");
    }
    res.status(200).json(new ApiResponse(200, updatedTest, "Test updated successfully."));
  } catch (error) {
    throw new ApiError(500, "Error occurred while updating the test.");
  }
});

// DELETE: Delete a test by ID
const deleteTest = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid test ID.");
  }

  try {
    const deletedTest = await Test.findByIdAndDelete(id);
    if (!deletedTest) {
      throw new ApiError(404, "Test not found.");
    }
    res.status(200).json(new ApiResponse(200, deletedTest, "Test deleted successfully."));
  } catch (error) {
    throw new ApiError(500, "Error occurred while deleting the test.");
  }
});

export { addTest, getTests, getTestWithDetails, updateTest, deleteTest };
