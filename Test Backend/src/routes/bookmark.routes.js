import express from "express";
import {
  toggleBookmark,
  getUserBookmarks,
  getQuestionBookmarkUsers,
} from "../controllers/bookmark.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(verifyJWT);

router.post("/toggle/:questionId", toggleBookmark); // Toggle a bookmark (add/remove)
router.get("/user/", getUserBookmarks); // Get all bookmarks for a user
router.get("/question/:questionId", getQuestionBookmarkUsers); // Get all users for a specific question

export default router;
