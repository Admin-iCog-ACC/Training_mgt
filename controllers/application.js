const {
  createApplicationService,
  deleteApplicationService,
} = require("../services/projectApplication");

const createApplicationController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return createApplicationService(req, res);
};

const deleteApplicationController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return deleteApplicationService(req, res);
};

module.exports = { createApplicationController, deleteApplicationController };
