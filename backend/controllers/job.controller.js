import Job from "../models/job.model.js";
import { errorHandler } from "../utils/error.js";

export const createJob = async (req, res, next) => {
  try {
    const job = await Job.create(req.body);
    return res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(errorHandler(404, "Job not found!"));
  }

  // if (req.recruiter.id !== job.recruiterRef) {
  //   return next(errorHandler(401, "You can only delete your own jobs!"));
  // }

  try {
    await JOb.findByIdAndDelete(req.params.id);
    res.status(200).json("Job has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return next(errorHandler(404, "Job not found!"));
  }
  // if (req.recruiter.id !== job.recruiterRef) {
  //   return next(errorHandler(401, "You can only update your own jobs!"));
  // }

  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedJob);
  } catch (error) {
    next(error);
  }
};

export const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return next(errorHandler(404, "Job not found!"));
    }
    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

export const getJobs = async (req, res, next) => {
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

    const jobs = await Job.find();

    // console.log("Jobs Found:", jobs.length);

    return res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};
