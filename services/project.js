const { sendEmail } = require("../Email");
const { deleteFile, uploadFile } = require("../cloudinary");
const ProjectModel = require("../models/ProjectModel");
const Trainer = require("../models/TrainerModel");
const Admin = require("../models/AdminModel");
const TrainersRating = require("../models/TrainersRating");
const TrainersProjects = require("../models/TrainersProjects");
const { Op } = require("sequelize");
const sequelize = require("sequelize");
require("dotenv").config();
const constructSearchQuery = (query, role) => {
  let searchQuery = {};
  if (query.status) {
    searchQuery = {
      ...searchQuery,
      status: role === "trainer" ? "In Progress" : query.status,
    };
  }

  if (query.location) {
    searchQuery = { ...searchQuery, location: query.location };
  }

  if (query.priority) {
    searchQuery = { ...searchQuery, priority: query.priority };
  }

  if (query.startDate) {
    searchQuery = { ...searchQuery, startDate: query.startDate };
  }

  if (query.endDate) {
    searchQuery = { ...searchQuery, endDate: query.endDate };
  }

  console.log(searchQuery);
  return searchQuery;
};
const uploadProjectImageService = async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  try {
    const project = await ProjectModel.findByPk(id);

    if (!project) {
      return res
        .status(404)
        .json({ location: "", path: "", msg: "Project not found.", type: "" });
    }
    const { public_id, secure_url } = await uploadFile(data.imageURL);

    project.set({
      imageURL: secure_url,
      imageID: public_id,
    });
    await project.save();
    return res.status(201).json({ project: project });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to upload image." });
  }
};
const getAllProjectsServices = async (req, res) => {
  const { applicationStatus, page, limit } = req.query;

  currentPage = page ? parseInt(page) : 0;
  currentLimit = limit ? parseInt(limit) : 16;
  if (req.role === "HR") {
    const projects = await ProjectModel.findAll({
      include: Trainer,
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ projects: projects });
  }
  if (req.role === "trainer") {
    const total = await ProjectModel.count({
      where: {
        status: "In Progress",
      },
    });
    const projects = await ProjectModel.findAndCountAll({
      offset: currentPage,
      limit: currentLimit,
      include: [
        {
          model: TrainersProjects,
          where: applicationStatus
            ? { TrainerId: req.trainerId, status: applicationStatus }
            : { TrainerId: req.trainerId },
          required: applicationStatus ? true : false,
        },
      ],
      order: [["createdAt", "DESC"]],
      where: req.query.title
        ? {
            ...constructSearchQuery(req.query, "trainer"),
            title: sequelize.where(
              sequelize.fn("LOWER", sequelize.col("title")),
              "LIKE",
              req.query.title.toLowerCase() + "%"
            ),
          }
        : constructSearchQuery(req.query, "trainer"),
    });
    const rejected = await TrainersProjects.count({
      where: { TrainerId: req.trainerId, status: "Rejected" },
    });
    const completed = await TrainersProjects.count({
      where: { TrainerId: req.trainerId, status: "Done" },
    });
    const inProgress = await TrainersProjects.count({
      where: { TrainerId: req.trainerId, status: "In Progress" },
    });

    return res.status(200).json({
      projects: projects.rows,
      stat: {
        rejected,
        completed,
        inProgress,
        total,
        all: projects.count,
        current: projects.rows.length,
      },
    });
  }
  const adminId = req.adminId;
  const projects = await ProjectModel.findAll({
    where: { AdminId: adminId },
    order: [["createdAt", "DESC"]],
  });
  return res.status(200).json({ projects: projects });
};

const getProjectServices = async (req, res) => {
  const { id } = req.params;
  const requestedBy = req.requestedBy;

  var project = await ProjectModel.findByPk(id, {
    include: [
      {
        model: TrainersProjects,
        include: {
          model: Trainer,
          include: [
            {
              model: TrainersRating,
              required: false,
              where: { ProjectId: id },
            },
            {
              model: TrainersProjects,
              required: false,
              where: { ProjectId: id },
            },
          ],
        },
      },
      Admin,
    ],
  });
  // var project = await TrainersProjects.findAll({
  //   where: { ProjectId: id },
  //   include: [{ model: ProjectModel, include: Admin }, Trainer],
  // });

  if (!project) {
    return res.status(404).json({ msg: "Project not found." });
  }
  if (req.requestedBy === "trainer") {
    console.log(req.trainerId);
    const project = await ProjectModel.findByPk(id, {
      include: [
        Admin,
        {
          model: TrainersProjects,
          include: {
            model: Trainer,

            where: {
              id: req.trainerId,
            },
            include: [
              {
                model: TrainersRating,
                required: false,
                where: { ProjectId: id, TrainerId: req.trainerId },
              },
            ],
          },
        },
      ],
    });

    return res.status(200).json({ project: project });
  }

  return res.status(200).json({ project: project });
};

const createProjectServices = async (req, res) => {
  const data = req.body;
  try {
    const { public_id, secure_url } = await uploadFile(data.imageURL);
    const project = await ProjectModel.create({
      ...data,
      imageURL: secure_url,
      imageID: public_id,
      AdminId: req.admin.id,
    });

    return res.status(201).json({ project: project });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to create project" });
  }
};
const updateProjectServices = async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  const project = await ProjectModel.findByPk(id);
  if (!project) {
    return res.status(404).json({ msg: "Project not found" });
  }
  try {
    const updatedProject = await ProjectModel.update(data, {
      where: {
        id,
      },
      returning: true,
    });

    return res.status(200).json({ project: updatedProject[1][0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to update project" });
  }
};

const deleteProjectServices = async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  const project = await ProjectModel.findByPk(id);
  if (!project) {
    return res.status(404).json({ msg: "project not found." });
  }
  try {
    await ProjectModel.destroy({
      where: {
        id,
      },
    });

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ msg: "Failed to delete project" });
  }
};

module.exports = {
  getAllProjectsServices,
  getProjectServices,
  createProjectServices,
  updateProjectServices,
  deleteProjectServices,
  uploadProjectImageService,
};
