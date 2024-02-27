const express = require("express");
const router = express.Router();
const {
  createRatingController,
  deleteRatingController,
  getRatingController,
  getTrainerOverallRatingController,
} = require("../controllers/rating");
const { canCreateRating, canGetRating } = require("../auth");

router.route("/").post(canCreateRating, createRatingController);
router
  .route("/project/:trainerId/:projectId")
  .delete(deleteRatingController)
  .get(canGetRating, getRatingController);

router.route("/overall/:trainerId").get(getTrainerOverallRatingController);
module.exports = router;
