import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  strengths: [String],
  weaknesses: [String],
  suggestions: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Resume", resumeSchema);