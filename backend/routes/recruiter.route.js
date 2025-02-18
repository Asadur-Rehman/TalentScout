import express from "express";
//import { deleteRecruiter, test, updateRecruiter,  getRecruiterJobs, getRecruiter} from '../controllers/user.controller.js';
import { updateRecruiter } from "../controllers/recruiter.controller.js";
import { checkRecruiter } from "../controllers/recruiter.controller.js";
import { test } from "../controllers/recruiter.controller.js";
import { verifyToken } from "../utils/verifyRecruiter.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyToken, updateRecruiter);
router.post("/check/", checkRecruiter);
// router.delete('/delete/:id', verifyToken, deleteUser)
// router.get('/listings/:id', verifyToken, getUserListings)
// router.get("/:id", verifyToken, getRecruiter);

export default router;
