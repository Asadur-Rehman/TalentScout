import express from "express";
//import { deleteRecruiter, test, updateRecruiter,  getRecruiterJobs, getRecruiter} from '../controllers/user.controller.js';
import { test } from "../controllers/recruiter.controller.js";
//import { verifyToken } from '../utils/verifyRecruiter.js';

const router = express.Router();

router.get("/test", test);
// router.post('/update/:id', verifyToken, updateUser)
// router.delete('/delete/:id', verifyToken, deleteUser)
// router.get('/listings/:id', verifyToken, getUserListings)
// router.get('/:id', verifyToken, getUser)

export default router;
