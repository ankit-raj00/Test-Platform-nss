import mongoose, { Schema } from "mongoose";

const testSchema = new Schema({
    title: {
      type: String,
      required: true,
    },
    pattern: {
      type: String,
      required: true,
    },
    
    totalMarks: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    validity : {
      type : Number,
      required : false
    },
    testQuestions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question", // Reference to the Question model
      },
    ],

    syllabus : {
      type : String,
      required : false
    } ,
    testDateAndTime: {
      type: Date,
      required: true,
    },
  },{
    timestamps : true
  });

  export const Test = mongoose.model("Test", testSchema);