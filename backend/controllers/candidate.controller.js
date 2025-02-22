import Candidate from "../models/candidate.model.js";
import { errorHandler } from "../utils/error.js";

export const createCandidate = async (req, res, next) => {
  try {
    const {
      firstname,
      lastname,
      birth,
      email,
      contact,
      country,
      education,
      experience,
      coverletter,
      resumeScore,
      jobRef,
    } = req.body;

    // Ensure a resume is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    // Create a new candidate with resume stored in MongoDB
    const candidate = await Candidate.create({
      firstname,
      lastname,
      birth,
      email,
      contact,
      country,
      education,
      experience,
      coverletter,
      resume: {
        data: req.file.buffer, // Store file as binary data
        contentType: req.file.mimetype, // Store file type
      },
      resumeScore,
      jobRef,
    });

    return res.status(201).json(candidate);
  } catch (error) {
    next(error);
  }
};

export const deleteCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return next(errorHandler(404, "Candidate not found!"));
    }

    await Candidate.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Candidate has been deleted!" });
  } catch (error) {
    next(error);
  }
};

export const updateCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return next(errorHandler(404, "Candidate not found!"));
    }

    // Prepare updated data
    const updatedData = { ...req.body };

    // If a new resume is uploaded, update it in MongoDB
    if (req.file) {
      updatedData.resume = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

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
    const candidates = await Candidate.find();
    return res.status(200).json(candidates);
  } catch (error) {
    next(error);
  }
};

export const getCandidateResume = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate || !candidate.resume.data) {
      return next(errorHandler(404, "Resume not found!"));
    }

    res.set("Content-Type", candidate.resume.contentType);
    res.send(candidate.resume.data);
  } catch (error) {
    next(error);
  }
};

export const getCandidateStats = async (req, res, next) => {
  try {
    const { jobRef } = req.params;

    const totalCandidates = await Candidate.countDocuments({ jobRef });
    const shortlistedCandidates = await Candidate.countDocuments({
      jobRef,
      shortlist: true,
    });
    const hiredCandidates = await Candidate.countDocuments({
      jobRef,
      hired: true,
    });

    res.status(200).json({
      jobRef,
      totalCandidates,
      shortlistedCandidates,
      hiredCandidates,
    });
  } catch (error) {
    next(error);
  }
};
