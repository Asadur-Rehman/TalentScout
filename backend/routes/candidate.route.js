import express from "express";
import {
  createCandidate,
  deleteCandidate,
  updateCandidate,
  getCandidate,
  getCandidates,
  getCandidateResume,
  getCandidateStats,
} from "../controllers/candidate.controller.js";
import upload from "../multerConfig.js"; // Import multer config

const router = express.Router();

router.post("/create", upload.single("resume"), createCandidate);
router.delete("/delete/:id", deleteCandidate);
router.post("/update/:id", upload.single("resume"), updateCandidate);
router.get("/get/:id", getCandidate);
router.get("/get", getCandidates);
router.get("/resume/:id", getCandidateResume); // <-- New Route for Resume Download
router.get("/stats/:jobRef", getCandidateStats);

export default router;
