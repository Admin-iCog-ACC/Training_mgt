const {
  getAllProjectsServices,
  getProjectServices,
  updateProjectServices,
  deleteProjectServices,
  createProjectServices,
  uploadProjectImageService,
} = require("../services/project");

const getAllProjectsController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return getAllProjectsServices(req, res);
};
const getProjectController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return getProjectServices(req, res);
};

const updateProjectController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return updateProjectServices(req, res);
};
const deleteProjectController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return deleteProjectServices(req, res);
};
const createProjectController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return createProjectServices(req, res);
};
const createProjectImageController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return uploadProjectImageService(req, res);
};
module.exports = {
  getAllProjectsController,
  getProjectController,
  updateProjectController,
  deleteProjectController,
  createProjectController,
  createProjectImageController,
};
