import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    candidateRef: {
      type: String,
      required: true,
    },
    audioQuestions: {
      type: Array,
      required: false,
    },
    audioAnswers: {
      type: Array,
      required: false,
    },
    videoQuestions: {
      type: Array,
      required: true,
    },
    videoAnswers: {
      type: Array,
      required: true,
    },
    CodingQuestion: {
      type: String,
      required: false,
    },
    CodingAnswer: {
      type: String,
      required: false,
    },
    technicalResults: {
      type: Array,
      required: true,
    },
    evaluationScore: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
