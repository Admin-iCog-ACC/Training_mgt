const trainersProjects = require("../models/TrainersProjects");
const projectModel = require("../models/ProjectModel");
const Project = require("../models/ProjectModel");
const trainerModel = require("../models/TrainerModel");
require("dotenv").config();

const createApplicationService = async (req, res) => {
  try {
    const { TrainerId, ProjectId } = req.body;

    const d = await trainersProjects.findAll({
      where: { TrainerId, ProjectId },
    });
    console.log(d);
    const project = await projectModel.findByPk(ProjectId);
    if (!project) {
      return res.status(404).json({ msg: "Project Not found" });
    }

    const trainer = await trainerModel.findByPk(TrainerId);
    if (!trainer) {
      return res.status(404).json({ msg: "Trainer Not found" });
    }
    const result = await trainersProjects.findOne({
      where: { TrainerId, ProjectId },
    });

    if (result) {
      return res.status(400).json({ msg: "You have already applied" });
    }

    const application = await trainersProjects.create({ TrainerId, ProjectId });

    return res.status(201).json({ application: application });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Failed to apply" });
  }
};

const deleteApplicationService = async (req, res) => {
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

module.exports = { createApplicationService, deleteApplicationService };
