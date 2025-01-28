import express from "express";
import { 
  addTest, 
  getTests, 
  getTestWithDetails, 
  updateTest, 
  deleteTest 
} from "../controllers/test.controller.js";

const router = express.Router();

// Add a new test
router.post("/", addTest);

// Get all tests or a specific test by ID
router.get("/", getTests);          // Get all tests
router.get("/:id", getTests);       // Get a specific test by ID

// Get detailed test data using aggregation
router.get("/details/:id", getTestWithDetails);

// Update a test by ID
router.patch("/:id", updateTest);

// Delete a test by ID
router.delete("/:id", deleteTest);

export default router;
