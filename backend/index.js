import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import recruiterRouter from "./routes/recruiter.route.js";
import authRouter from "./routes/auth.route.js";
import jobRouter from "./routes/job.route.js";
import candidateRouter from "./routes/candidate.route.js";
import interviewRouter from "./routes/interview.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import textExtractRouter from "./routes/textExtract.route.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.log(err));

const __dirname = path.resolve();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

app.use("/api/recruiter", recruiterRouter);
app.use("/api/auth", authRouter);
app.use("/api/job", jobRouter);
app.use("/api/candidate", candidateRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/text-extract", textExtractRouter);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
