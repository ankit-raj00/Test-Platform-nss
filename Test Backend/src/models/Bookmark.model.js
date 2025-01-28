import mongoose, { Schema } from "mongoose";

// Define the Bookmark schema
const bookmarkSchema = new Schema(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question", // Reference to a question in the Question model
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to a user in the User model
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Bookmark model
export const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
