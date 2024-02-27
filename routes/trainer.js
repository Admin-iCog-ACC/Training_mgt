const express = require("express");
const router = express.Router();
const {
  getTrainerController,
  getAllTrainersController,
  createTrainerController,
  updateTrainerController,
  deleteTrainerController,
  createTrainerImageController,
  createTrainerCvController,
  updateTrainerPasswordController,
} = require("../controllers/trainer");

const {
  verifyRequestAccess,
  canGetSingleTrainer,
  canGetAllTrainers,
  canDeleteUpdateTrainer,
  canCreateTrainer,
  canUpdateTrainerPassword,
} = require("../auth");

router
  .route("/")
  .get(canGetAllTrainers, getAllTrainersController)
  .post(canCreateTrainer, createTrainerController);
router
  .route("/:id")
  .get(canGetSingleTrainer, getTrainerController)
  .patch(canDeleteUpdateTrainer, updateTrainerController)
  .delete(canDeleteUpdateTrainer, deleteTrainerController);
router
  .route("/uploadImage/:id")
  .patch(canDeleteUpdateTrainer, createTrainerImageController);
router
  .route("/uploadCV/:id")
  .patch(canDeleteUpdateTrainer, createTrainerCvController);
router
  .route("/password/:id")
  .patch(canUpdateTrainerPassword, updateTrainerPasswordController);
module.exports = router;
