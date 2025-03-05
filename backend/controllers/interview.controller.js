import Interview from "../models/interview.model.js";
import Candidate from "../models/candidate.model.js"; // Assuming you have this model
import sendEmail from "../utils/email.js";
import { errorHandler } from "../utils/error.js";

export const createInterview = async (req, res, next) => {
  try {
    const interview = await Interview.create(req.body);

    // Fetch candidate details
    const candidate = await Candidate.findById(req.body.candidateRef);
    if (!candidate) {
      return next(errorHandler(404, "Candidate not found!"));
    }

    // Send email
    const emailSubject = "Interview Scheduled";
    const emailBody = `Dear ${candidate.name},\n\nYour interview has been scheduled.\nInterview ID: ${interview._id}\nLogin using this id to https://talentscout.onrender.com/candidatelogin and attempt the interview.\n\nBest of luck!\nHR Team`;

    await sendEmail(candidate.email, emailSubject, emailBody);

    return res.status(201).json(interview);
  } catch (error) {
    next(error);
  }
};

export const deleteInterview = async (req, res, next) => {
  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    return next(errorHandler(404, "Interview not found!"));
  }

  // if (req.recruiter.id !== job.recruiterRef) {
  //   return next(errorHandler(401, "You can only delete your own jobs!"));
  // }

  try {
    await Interview.findByIdAndDelete(req.params.id);
    res.status(200).json("Interview has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateInterview = async (req, res, next) => {
  const interview = await Interview.findById(req.params.id);
  if (!interview) {
    return next(errorHandler(404, "Interview not found!"));
  }
  // if (req.recruiter.id !== job.recruiterRef) {
  //   return next(errorHandler(401, "You can only update your own jobs!"));
  // }

  try {
    const updatedInterview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updatedInterview);
  } catch (error) {
    next(error);
  }
};

export const getInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return next(errorHandler(404, "Interview not found!"));
    }
    res.status(200).json(interview);
  } catch (error) {
    next(error);
  }
};

export const getInterviews = async (req, res, next) => {
  try {
    // const filters = {
    //   title: { $regex: req.query.searchTerm || "", $options: "i" },
    //   location: { $regex: req.query.location || "", $options: "i" },
    //   type: req.query.type || undefined,
    //   active: req.query.active === "false" ? false : true,
    // };

    // if (req.query.minSalary) {
    //   filters.salary = { $gte: parseInt(req.query.minSalary) };
    // }

    // if (req.query.skills) {
    //   filters.skills = { $all: req.query.skills.split(",") };
    // }

    // console.log("Final Query Filters:", filters);

    // const jobs = await Job.find(filters)
    //   .sort({ createdAt: -1 })
    //   .limit(10)
    //   .skip(0);

    const interviews = await Interview.find();

    // console.log("Jobs Found:", jobs.length);

    return res.status(200).json(interviews);
  } catch (error) {
    next(error);
  }
};
