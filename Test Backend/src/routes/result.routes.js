import express from "express";
import {
    computeResult
} from "../controllers/result.controller.js";

const router = express.Router();


router.put("/:testId", computeResult); // Update a specific response


export default router;
