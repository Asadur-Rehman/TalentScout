import Job from '../models/job.model.js';
import { errorHandler } from '../utils/error.js';

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
    return next(errorHandler(404, 'Job not found!'));
  }

  if (req.user.id !== job.userRef) {
    return next(errorHandler(401, 'You can only delete your own jobs!'));
  }

  try {
    await JOb.findByIdAndDelete(req.params.id);
    res.status(200).json('Job has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return next(errorHandler(404, 'Job not found!'));
  }
  if (req.user.id !== job.userRef) {
    return next(errorHandler(401, 'You can only update your own jobs!'));
  }

  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedJob);
  } catch (error) {
    next(error);
  }
};

export const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return next(errorHandler(404, 'Job not found!'));
    }
    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const jobs = await Job.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};