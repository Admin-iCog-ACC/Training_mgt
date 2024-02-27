const {
  getAllTrainersServices,
  getTrainerServices,
  updateTrainerServices,
  deleteTrainerServices,
  createTrainerServices,
  uploadTrainerImageService,
  uploadTrainerCvService,
  updateTrainerPasswordServices,
} = require("../services/trainer");

const getAllTrainersController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return getAllTrainersServices(req, res);
};
const getTrainerController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return getTrainerServices(req, res);
};

const updateTrainerController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return updateTrainerServices(req, res);
};
const deleteTrainerController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return deleteTrainerServices(req, res);
};
const createTrainerController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return createTrainerServices(req, res);
};

const createTrainerImageController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return uploadTrainerImageService(req, res);
};
const createTrainerCvController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return uploadTrainerCvService(req, res);
};
const updateTrainerPasswordController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return updateTrainerPasswordServices(req, res);
};

module.exports = {
  getAllTrainersController,
  getTrainerController,
  updateTrainerController,
  deleteTrainerController,
  createTrainerController,
  createTrainerImageController,
  createTrainerCvController,
  updateTrainerPasswordController,
};
