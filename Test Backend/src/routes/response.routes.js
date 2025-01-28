import express from "express";
import {
  addResponse,
  getResponses,
  updateResponse,
  deleteResponse,
} from "../controllers/response.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/",verifyJWT, addResponse); // Add new response
router.get("/:id?", getResponses); // Get all responses or by ID
router.put("/:id", updateResponse); // Update a specific response
router.delete("/:id", deleteResponse); // Delete a specific response

export default router;
