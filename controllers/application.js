const {
  createApplicationService,
  manageApplicationService,
} = require("../services/projectApplication");

const createApplicationController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return createApplicationService(req, res);
};

const manageApplicationController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return manageApplicationService(req, res);
};

module.exports = { createApplicationController, manageApplicationController };
