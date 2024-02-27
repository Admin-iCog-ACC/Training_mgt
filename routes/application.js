const express = require("express");
const router = express.Router();
const {
  createApplicationController,
  manageApplicationController,
} = require("../controllers/application");

router.route("/").post(createApplicationController);
router.route("/:TrainerId/:ProjectId").patch(manageApplicationController);

module.exports = router;
