import Recruiter from "../models/recruiter.model.js";
import Candidate from "../models/candidate.model.js";
import Interview from "../models/interview.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { getInterview } from "./interview.controller.js";

export const signup = async (req, res, next) => {
  const { username, organizationname, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newRecruiter = new Recruiter({
    username,
    organizationname,
    email,
    password: hashedPassword,
  });
  try {
    await newRecruiter.save();
    res.status(201).json("Recruiter created successfully!");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validRecruiter = await Recruiter.findOne({ email });
    if (!validRecruiter) return next(errorHandler(404, "Recruiter not found!"));
    const validPassword = bcryptjs.compareSync(
      password,
      validRecruiter.password
    );
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));
    const token = jwt.sign({ id: validRecruiter._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validRecruiter._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

import mongoose from "mongoose";

export const candidatelogin = async (req, res, next) => {
  const { name, email, interviewId } = req.body;
  try {
    // const validCandidate = await Candidate.findOne({ email }).select("-resume");
    // if (!validCandidate) return next(errorHandler(404, "Candidate not found!"));

    // if (!validCandidate.shortlist) {
    //   return next(
    //     errorHandler(401, "Candidate not yet invited for the interview!")
    //   );
    // }

    // console.log("Candidate ID:", validCandidate._id.toString());
    // console.log("Received interviewId:", interviewId);

    const validInterview = await Interview.findById(interviewId);

    if (!validInterview) {
      return next(
        errorHandler(
          404,
          "Interview not found!"
        )
      );
    }

    const validCandidate = await Candidate.findById(
      validInterview.candidateRef
    ).select("-resume");

    if (!validCandidate) return next(errorHandler(404, "Candidate not found!"));

    if (validCandidate.email !== email) {
      return next(
        errorHandler(
          401,
          "Kindly enter the email you used to apply for the job!"
        )
      );
    }

    const token = jwt.sign(
      { id: validCandidate._id, interviewId: validInterview._id }, // Include interviewId in token
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Added expiry for security
    );

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ validCandidate, interviewId: validInterview._id }); // Return interviewId to frontend
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const { email, username, organizationname } = req.body; // Include organizationname

    let recruiter = await Recruiter.findOne({ email });

    if (recruiter) {
      const token = jwt.sign({ id: recruiter._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = recruiter._doc;
      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newRecruiter = new Recruiter({
        username:
          username.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email,
        password: hashedPassword,
        organizationname, // Store the organization name
      });

      await newRecruiter.save();

      const token = jwt.sign({ id: newRecruiter._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newRecruiter._doc;

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

// export const signOut = async (req, res, next) => {
//   try {
//     res.clearCookie("access_token");
//     res.status(200).json("User has been logged out!");
//   } catch (error) {
//     next(error);
//   }
// };
