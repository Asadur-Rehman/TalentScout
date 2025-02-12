import express from "express";
import {
  createCandidate,
  deleteCandidate,
  updateCandidate,
  getCandidate,
  getCandidates,
} from "../controllers/candidate.controller.js";

const router = express.Router();

router.post("/create", createCandidate);
router.delete("/delete/:id", deleteCandidate);
router.post("/update/:id", updateCandidate);
router.get("/get/:id", getCandidate);
router.get("/get", getCandidates);

export default router;
