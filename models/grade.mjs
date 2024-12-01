import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Define the schema for score
const scoreSchema = new mongoose.Schema({

  type: {
    type: String,
    required: false,
  },
  score: {
    type: Number,
    required: false,
  },
});

// Define the schema for grade
const gradeSchema = new mongoose.Schema({

  scores: [scoreSchema],
  learner_id: {
    type: Number,
    required: true,
  },
  class_id: {
    type: Number,
    required: true,
  },
  stats: {
    type: Object,
    required: false,
    default: [],
  }
});


let Grade = mongoose.model("Grade", gradeSchema);
export default Grade;