const trainersProjects = require("../models/TrainersProjects");
const TrainersRating = require("../models/TrainersRating");
const projectModel = require("../models/ProjectModel");
const Project = require("../models/ProjectModel");
const trainerModel = require("../models/TrainerModel");
const { verifyRequest } = require("../auth");
const TrainersProjects = require("../models/TrainersProjects");
require("dotenv").config();

const createRatingService = async (req, res) => {
  try {
    const { trainerId, projectId, rating, ratingRationale } = req.body;

    const checkRating = await TrainersRating.findOne({
      where: { TrainerId: trainerId, ProjectId: projectId },
    });

    const application = await TrainersProjects.findOne({
      where: { TrainerId: trainerId, ProjectId: projectId },
    });

    if (application.status !== "Done") {
      return res
        .status(400)
        .json({ msg: "Trainer has not finished working on this project!" });
    }
    if (checkRating) {
      return res
        .status(400)
        .json({ msg: "Rating already done for this trainer on this project" });
    }

    const rate = await TrainersRating.create({
      TrainerId: trainerId,
      ProjectId: projectId,
      rating,
      ratingRationale,
    });

    const totalRating = await TrainersRating.sum("rating", {
      where: { TrainerId: trainerId },
    });
    const numRating = await TrainersRating.count({
      where: { TrainerId: trainerId },
    });

    await trainerModel.update(
      { rating: totalRating / (numRating * 5) },
      { where: { id: trainerId } }
    );
    return res
      .status(201)
      .json({ rating: rate, overallRating: totalRating / (numRating * 5) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Failed to rate" });
  }
};

const updateRatingService = async (req, res) => {
  try {
    const { trainerId, projectId } = req.params;
    const { rating, ratingRationale } = req.body;

    const checkRating = await TrainersRating.findOne({
      where: { TrainerId: trainerId, ProjectId: projectId },
    });

    const application = await TrainersProjects.findOne({
      where: { TrainerId: trainerId, ProjectId: projectId },
    });

    if (!checkRating) {
      return res.status(404).json({ msg: "Rating not found." });
    }

    if (application.status !== "Done") {
      return res
        .status(400)
        .json({ msg: "Trainer has not finished working on this project!" });
    }

    checkRating.rating = rating;
    checkRating.ratingRationale = ratingRationale;
    await checkRating.save();

    const totalRating = await TrainersRating.sum("rating", {
      where: { TrainerId: trainerId },
    });
    const numRating = await TrainersRating.count({
      where: { TrainerId: trainerId },
    });

    await trainerModel.update(
      { rating: totalRating / (numRating * 5) },
      { where: { id: trainerId } }
    );
    return res.status(201).json({
      rating: checkRating,
      overallRating: totalRating / (numRating * 5),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Failed to rate" });
  }
};

const deleteRatingService = async (req, res) => {
  try {
    const { TrainerId, ProjectId } = req.params;
    const application = await trainersProjects.findOne({
      where: { TrainerId: TrainerId, ProjectId: ProjectId },
    });

    if (!application) {
      return res.status(404).json({
        location: "",
        path: "",
        msg: "application not found.",
        type: "",
      });
    }
    await application.destroy();

    return res.status(204).json();
  } catch (error) {
    res.status(500).json({ msg: "Failed to delete application" });
  }
};

const getRatingService = async (req, res) => {
  const { trainerId, projectId } = req.params;

  const checkRating = await TrainersRating.findOne({
    where: { TrainerId: trainerId, ProjectId: projectId },
  });

  if (!checkRating) {
    return res.status(404).json({ msg: "Rating is not found" });
  }
  return res.status(200).json({ rating: checkRating });
};

const getTrainerOverallRatingService = async (req, res) => {
  try {
    const { status, admin, value } = await verifyRequest(req, res);

    if (status === 401) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    const { trainerId } = req.params;
    const trainer = await trainerModel.findByPk(trainerId);

    if (!trainer) {
      return res.status(404).json({ msg: "Trainer not found" });
    }
    if (!admin) {
      if (value.id !== trainerId) {
        return res.status(401).json({ msg: "Unauthorized" });
      }
    }
    const totalRating = await TrainersRating.sum("rating", {
      where: { TrainerId: trainerId },
    });
    const numRating = await TrainersRating.count({
      where: { TrainerId: trainerId },
    });

    return res.status(200).json({ rating: totalRating / (numRating * 5) });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createRatingService,
  deleteRatingService,
  getRatingService,
  getTrainerOverallRatingService,
  updateRatingService,
};
