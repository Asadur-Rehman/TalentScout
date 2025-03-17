import express from "express";
import { extractText } from "../controllers/textExtract.controller.js";
import upload from "../multerConfig.js";

const router = express.Router();
router.post("/extract", upload.single("resume"), extractText);

export default router;
