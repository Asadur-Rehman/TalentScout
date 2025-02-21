import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    birth: { type: Date, required: true },
    email: { type: String, required: true },
    contact: { type: Number, required: true },
    country: { type: String, required: true },
    education: { type: String, required: true },
    experience: { type: Number, required: true },
    coverletter: { type: String, required: true },
    resume: {
      data: Buffer, // Stores resume as binary
      contentType: String, // Stores file type (e.g., "application/pdf")
    },
    shortlist: { type: Boolean, default: false },
    resumeScore: { type: Number, required: false },
    jobRef: { type: String, required: true },
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate;
