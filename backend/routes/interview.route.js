import express from "express";
import {
  createInterview,
  deleteInterview,
  updateInterview,
  getInterview,
  getInterviews,
} from "../controllers/interview.controller.js";

const router = express.Router();

router.post("/create", createInterview);
router.delete("/delete/:id", deleteInterview);
router.post("/update/:id", updateInterview);
router.get("/get/:id", getInterview);
router.get("/get", getInterviews);

export default router;
