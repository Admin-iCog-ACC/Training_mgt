// const {
//     createApplicationService,
//     deleteApplicationService,
//   } = require("../services/projectApplication");

const {
  createRatingService,
  deleteRatingService,
  getRatingService,
  getTrainerOverallRatingService,
  updateRatingService,
} = require("../services/rating");

const createRatingController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);
  return createRatingService(req, res);
};

const deleteRatingController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);
  return deleteRatingService(req, res);
};

const getRatingController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);

  return getRatingService(req, res);
};
const getTrainerOverallRatingController = async (req, res) => {
  // const errors = validate(req);
  // if (errors.isEmpty()) return createBlogService(req, res);
  return getTrainerOverallRatingService(req, res);
};
const updateRatingController = async (req, res) => {
  return updateRatingService(req, res);
};

module.exports = {
  createRatingController,
  deleteRatingController,
  getRatingController,
  getTrainerOverallRatingController,
  updateRatingController,
};
