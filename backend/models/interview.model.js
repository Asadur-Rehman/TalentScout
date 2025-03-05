import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    // date: {
    //   type: Date,
    //   required: true,
    // },
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
      required: false,
    },
    videoAnswers: {
      type: Array,
      required: false,
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
      required: false,
    },
    evaluationScore: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
