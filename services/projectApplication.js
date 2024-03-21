const trainersProjects = require("../models/TrainersProjects");
const projectModel = require("../models/ProjectModel");
const Project = require("../models/ProjectModel");
const trainerModel = require("../models/TrainerModel");
const { verifyRequest } = require("../auth");
require("dotenv").config();

const createApplicationService = async (req, res) => {
  try {
    const { status, value, admin } = await verifyRequest(req, res);
    if (status === 401 || admin) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    const { ProjectId, description } = req.body;

    const project = await projectModel.findByPk(ProjectId);
    if (!project) {
      return res.status(404).json({ msg: "Project Not found" });
    }

    const result = await trainersProjects.findOne({
      where: { TrainerId: value.id, ProjectId },
    });

    if (result) {
      return res.status(400).json({ msg: "You have already applied" });
    }

    const application = await trainersProjects.create({
      TrainerId: value.id,
      ProjectId,
      description,
    });

    return res.status(201).json({ application: application });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Failed to apply" });
  }
};

const manageApplicationService = async (req, res) => {
  try {
    const { TrainerId, ProjectId } = req.params;
    const { status, statusRationale } = req.body;
    const application = await trainersProjects.findOne({
      where: { TrainerId: TrainerId, ProjectId: ProjectId },
    });

    if (!application) {
      return res.status(404).json({
        msg: "application not found.",
      });
    }
    application.status = status;
    application.statusRationale = statusRationale;
    await application.save();

    return res.status(200).json({ msg: "status updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Operation Failed" });
  }
};

module.exports = { createApplicationService, manageApplicationService };