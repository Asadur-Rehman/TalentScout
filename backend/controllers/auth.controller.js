import Recruiter from "../models/recruiter.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newRecruiter = new Recruiter({
    username,
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

export const google = async (req, res, next) => {
  try {
    const recruiter = await Recruiter.findOne({ email: req.body.email });
    if (recruiter) {
      const token = jwt.sign({ id: recruiter._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = recruiter._doc;
      res
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
          req.body.username.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
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
