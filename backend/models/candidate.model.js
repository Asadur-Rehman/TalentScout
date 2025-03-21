import { FileSpreadsheet } from "lucide-react";
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
      data: Buffer,
      contentType: String,
    },
    resumeText: { type: String, required: true },
    shortlist: { type: Boolean, default: false },
    hired: { type: Boolean, default: false },
    resumeScore: { type: Number, default: 0 },
    evaluationScore: { type: Number, default: 0 },
    evaluationReport: { type: String, default: "" },
    status: { type: String, default: "Pending" },
    jobRef: { type: String, required: true },
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate;
