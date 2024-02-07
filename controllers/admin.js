const {
  getAdminServices,
  getAllAdminsServices,
  updateAdminServices,
  deleteAdminServices,
  createAdminServices,
  uploadAdminImageService,
  updateAdminPassword,
  updateAdminPasswordService,
} = require("../services/Admin");

const getAllAdminController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return getAllAdminsServices(req, res);
};
const getAdminController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return getAdminServices(req, res);
};
const updateAdminController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return updateAdminServices(req, res);
};
const updateAdminPasswordController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return updateAdminPasswordService(req, res);
};
const deleteAdminController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return deleteAdminServices(req, res);
};
const createAdminController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return createAdminServices(req, res);
};
const uploadAdminImageController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return uploadAdminImageService(req, res);
};

module.exports = {
  getAdminController,
  getAllAdminController,
  updateAdminController,
  deleteAdminController,
  createAdminController,
  uploadAdminImageController,
  updateAdminPasswordController,
};
