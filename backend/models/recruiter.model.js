import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    organizationname: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Recruiter = mongoose.model("Recruiter", recruiterSchema);

export default Recruiter;
