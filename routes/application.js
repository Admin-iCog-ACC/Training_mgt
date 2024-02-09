const express = require("express");
const router = express.Router();
const {
  createApplicationController,
  deleteApplicationController,
} = require("../controllers/application");

router.route("/").post(createApplicationController);
router.route("/:TrainerId/:ProjectId").delete(deleteApplicationController);

module.exports = router;
