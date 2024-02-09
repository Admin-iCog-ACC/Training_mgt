const { sendEmail } = require("../Email");
const { deleteFile, uploadFile } = require("../cloudinary");
const ProjectModel = require("../models/ProjectModel");
const Trainer = require("../models/TrainerModel");
const Admin = require("../models/AdminModel");
require("dotenv").config();

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
  const projects = await ProjectModel.findAll({ include: Trainer });
  return res.status(200).json({ projects: projects });
};

const getProjectServices = async (req, res) => {
  const { id } = req.params;
  const project = await ProjectModel.findByPk(id, {
    include: [Trainer, Admin],
  });

  if (!project) {
    return res
      .status(404)
      .json({ location: "", path: "", msg: "Project not found.", type: "" });
  }

  return res.status(200).json({ project: project });
};

const createProjectServices = async (req, res) => {
  const data = req.body;
  try {
    console.log(data);
    const { public_id, secure_url } = await uploadFile(data.imageURL);
    console.log(secure_url);
    const project = await ProjectModel.create({
      ...data,
      imageURL: secure_url,
      imageID: public_id,
      AdminId: req.admin.id,
    });

    console.log(project);
    return res.status(200).json({ project: project });
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
    return res
      .status(404)
      .json({ location: "", path: "", msg: "Project not found.", type: "" });
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
    return res
      .status(404)
      .json({ location: "", path: "", msg: "project not found.", type: "" });
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
