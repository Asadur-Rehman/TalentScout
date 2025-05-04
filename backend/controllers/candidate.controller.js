import Candidate from "../models/candidate.model.js";
import Job from "../models/job.model.js";
import { errorHandler } from "../utils/error.js";
import sendEmail from "../utils/email.js";

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
      position,
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
      position,
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

export const getHiredCandidates = async (req, res, next) => {
  try {
    const { jobRef } = req.params;

    const shortlistedCandidates = await Candidate.find({
      jobRef,
      hired: true,
    }).select("-resume");

    if (!shortlistedCandidates.length) {
      return next(errorHandler(404, "No shortlisted candidates found!"));
    }

    res.status(200).json(shortlistedCandidates);
  } catch (error) {
    next(error);
  }
};

export const getCandidatesByRecruiter = async (req, res, next) => {
  try {
    const { recruiterRef } = req.params; // recruiterId should come from route params
    // Step 1: Get all jobs for this recruiter
    const jobs = await Job.find({ recruiterRef });
    const jobIds = jobs.map((job) => job._id.toString());

    if (!jobIds.length) {
      return next(errorHandler(404, "No jobs found for this recruiter!"));
    }

    // Step 2: Find candidates where jobRef is in jobIds
    const candidates = await Candidate.find({ jobRef: { $in: jobIds } }).select(
      "-resume"
    );

    if (!candidates.length) {
      return next(errorHandler(404, "No candidates found for this recruiter!"));
    }

    res.status(200).json(candidates);
  } catch (error) {
    next(error);
  }
};

export const getCandidateEvaluation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findById(id).select(
      "evaluationScore evaluationReport"
    );

    if (!candidate) {
      return next(errorHandler(404, "Candidate not found!"));
    }

    res.status(200).json({
      evaluationScore: candidate.evaluationScore,
      evaluationReport: candidate.evaluationReport,
    });
  } catch (error) {
    next(error);
  }
};

export const hireCandidate = async (req, res, next) => {
  try {
    // Fetch candidate details
    const candidate = await Candidate.findById(req.body.candidateRef).select(
      "-resume"
    );
    if (!candidate) {
      return next(errorHandler(404, "Candidate not found!"));
    }

    // Send email
    const emailSubject = `Hiring Update: ${candidate.position}`;

    const emailBody = `Dear ${candidate.firstname} ${candidate.lastname},\n\nCongratulations! We are pleased to inform you that you have been selected for the position of ${candidate.position}.\n\nWe were impressed with your performance and believe you will be a valuable addition to our team.\n\nOur HR team will contact you shortly with further onboarding details.\n\nWelcome aboard!\n\nBest regards,\nHR Team`;

    await sendEmail(candidate.email, emailSubject, emailBody);

    return res.status(201).json(emailSubject);
  } catch (error) {
    next(error);
  }
};

export const rejectCandidate = async (req, res, next) => {
  try {
    // Fetch candidate details
    const candidate = await Candidate.findById(req.body.candidateRef).select(
      "-resume"
    );
    if (!candidate) {
      return next(errorHandler(404, "Candidate not found!"));
    }

    // Send email
    const emailSubject = `Hiring Update: ${candidate.position}`;

    const emailBody = `Dear ${candidate.firstname} ${candidate.lastname},
    
    Thank you for taking the time to interview for the position of ${candidate.position}. We appreciate your interest in the role and the effort you put into the evaluation process.
    
    After careful consideration, we have decided to move forward with other candidates at this time. This decision was not easy, as we recognize the strengths and experience you bring to the table.
    
    Here is some detailed feedback based on your performance during the interview:
    
    ${req.body.candidateFeedback}
    
    We truly value the time you spent with us and wish you all the best in your future endeavors.
    
    Best regards,
    HR Team`;

    await sendEmail(candidate.email, emailSubject, emailBody);

    return res.status(201).json(emailSubject);
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
