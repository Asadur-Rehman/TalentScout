import express from "express";
import {
  createJob,
  deleteJob,
  updateJob,
  getJob,
  getJobs,
} from "../controllers/job.controller.js";
import { verifyToken } from "../utils/verifyRecruiter.js";

const router = express.Router();

router.post("/create", verifyToken, createJob);
router.delete("/delete/:id", verifyToken, deleteJob);
router.post("/update/:id", verifyToken, updateJob);
router.get("/get/:id", getJob);
router.get("/get", getJobs);

export default router;
