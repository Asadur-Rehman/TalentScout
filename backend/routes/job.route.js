import express from "express";
import {
  createJob,
  deleteJob,
  updateJob,
  getJob,
  getJobs,
  getJobsByRecruiter,
  getTotalJobsByRecruiter,
} from "../controllers/job.controller.js";
import { verifyToken } from "../utils/verifyRecruiter.js";

const router = express.Router();

router.post("/create", verifyToken, createJob);
router.delete("/delete/:id", verifyToken, deleteJob);
router.post("/update/:id", updateJob);
router.get("/get/:id", getJob);
router.get("/get", getJobs);
router.get("/getbyrecruiter/:recruiterRef", verifyToken, getJobsByRecruiter);
router.get("/getjobsbyrecruiter/:recruiterRef", getTotalJobsByRecruiter);

export default router;
