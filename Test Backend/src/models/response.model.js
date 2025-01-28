import mongoose, { Schema } from "mongoose";

const responseSchema = new Schema({
  enroll: {
    type: String, // Enrollment number of the student
    required: true,
  },
  testId: {
    type: String, // Test identifier
    required: true,
  },
  responses: [
    {
      questionId: {
        type: Schema.Types.ObjectId,
        ref: "Question", // Reference to a question in the Question model
        required: true,
        
      },
      subject: {
        type: String, // Subject of the question
        required: true,
      },
      type: {
        type: String, // Question type (e.g., SCQ, MCQ, INT)
        required: true,
        enum: ["SCQ", "MCQ", "INT"], // Only allow valid types
      },
      inputAnswer: {
        type: String, // The exact input entered by the student (for INT or subjective questions)
        default: "",
      },
      selectedOption: {
        type: String, // Selected option for SCQ/MCQ
        default: "",
      },
      selectedOptions: {
        type: [String], // Array of options (for MCQs with multiple correct answers)
        default: [],
      },
      status: {
        type: Number, // Status of the response
        required: true,
        enum: [0, 1, 2, 3, 4], // Define valid statuses
        
      },
      time: {
        type: Number, // Time taken to answer the question (in seconds)
        required: true,
      },
      mark : {
        type : Number,
        default : 0,
        
      }
    },
  ],
},{
    timestamps : true
});

// Create and export the model
export const Response = mongoose.model("Response", responseSchema);
