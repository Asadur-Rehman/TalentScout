import express from "express";
import {
  createCandidate,
  deleteCandidate,
  updateCandidate,
  getCandidate,
  getCandidates,
  getCandidateResume,
  getCandidateStats,
  getCandidatesByJob,
  getShortlistedCandidates,
} from "../controllers/candidate.controller.js";
import upload from "../multerConfig.js"; // Import multer config

const router = express.Router();

router.post("/create", upload.single("resume"), createCandidate);
router.delete("/delete/:id", deleteCandidate);
router.post("/update/:id", upload.single("resume"), updateCandidate);
router.get("/get/:id", getCandidate);
router.get("/get", getCandidates);
router.get("/resume/:id", getCandidateResume);
router.get("/stats/:jobRef", getCandidateStats);
router.get("/getbyjob/:jobRef", getCandidatesByJob);
router.get("/shortlisted/:jobRef", getShortlistedCandidates);

export default router;
