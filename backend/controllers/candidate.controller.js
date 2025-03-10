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
      resumeText,
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
      resumeText,
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
    ).select("-resume");

    res.status(200).json(updatedCandidate);
  } catch (error) {
    next(error);
  }
};

export const getCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id).select("-resume");
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

// export const getCandidateResume = async (req, res, next) => {
//   try {
//     const candidate = await Candidate.findById(req.params.id);
//     if (!candidate || !candidate.resume.data) {
//       return next(errorHandler(404, "Resume not found!"));
//     }

//     res.set("Content-Type", candidate.resume.contentType);
//     res.send(candidate.resume.data);
//   } catch (error) {
//     next(error);
//   }
// };

export const getCandidateResume = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate || !candidate.resume || !candidate.resume.data) {
      return next(errorHandler(404, "Resume not found!"));
    }

    // Set correct content type (e.g., PDF, DOCX, etc.)
    res.set("Content-Type", candidate.resume.contentType);

    // Convert the Buffer data properly
    res.send(Buffer.from(candidate.resume.data));
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

export const getCandidatesByJob = async (req, res, next) => {
  try {
    const { jobRef } = req.params;
    const candidates = await Candidate.find({ jobRef }).select("-resume");

    if (!candidates.length) {
      return next(errorHandler(404, "No candidates found for this job!"));
    }

    res.status(200).json(candidates);
  } catch (error) {
    next(error);
  }
};

export const getShortlistedCandidates = async (req, res, next) => {
  try {
    const { jobRef } = req.params;

    const shortlistedCandidates = await Candidate.find({
      jobRef,
      shortlist: true,
    }).select("-resume");

    if (!shortlistedCandidates.length) {
      return next(errorHandler(404, "No shortlisted candidates found!"));
    }

    res.status(200).json(shortlistedCandidates);
  } catch (error) {
    next(error);
  }
};

// export const getCandidateResume = async (req, res, next) => {
//   try {
//     const { candidateId } = req.params;

//     const candidate = await Candidate.findById(candidateId).select("resume");

//     if (!candidate || !candidate.resume) {
//       return next(errorHandler(404, "Resume not found!"));
//     }

//     res.set("Content-Type", candidate.resume.contentType);
//     res.send(Buffer.from(candidate.resume.data.data));
//   } catch (error) {
//     next(error);
//   }
// };
