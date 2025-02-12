import Candidate from "../models/candidate.model.js";
import { errorHandler } from "../utils/error.js";

export const createCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.create(req.body);
    return res.status(201).json(candidate);
  } catch (error) {
    next(error);
  }
};

export const deleteCandidate = async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.id);

  if (!candidate) {
    return next(errorHandler(404, "Candidate not found!"));
  }

  // if (req.recruiter.id !== job.recruiterRef) {
  //   return next(errorHandler(401, "You can only delete your own jobs!"));
  // }

  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.status(200).json("Candidate has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateCandidate = async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.id);
  if (!candidate) {
    return next(errorHandler(404, "Candidate not found!"));
  }
  // if (req.recruiter.id !== job.recruiterRef) {
  //   return next(errorHandler(401, "You can only update your own jobs!"));
  // }

  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedCandidate);
  } catch (error) {
    next(error);
  }
};

export const getCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return next(errorHandler(404, "Candidate not found!"));
    }
    res.status(200).json(candidate);
  } catch (error) {
    next(error);
  }
};

export const getCandidates = async (req, res, next) => {
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

    const candidates = await Candidate.find();

    // console.log("Jobs Found:", jobs.length);

    return res.status(200).json(candidates);
  } catch (error) {
    next(error);
  }
};
