const express = require("express");
const router = express.Router();
const {
  getAllProjectsController,
  getProjectController,
  deleteProjectController,
  updateProjectController,
  createProjectController,
  createProjectImageController,
} = require("../controllers/project");
const {
  verifyRequestAccess,
  canDeleteUpdateCreateProject,
  canGetProjectDetail,
} = require("../auth");
router
  .route("/")
  .get(verifyRequestAccess, getAllProjectsController)
  .post(canDeleteUpdateCreateProject, createProjectController);
router
  .route("/:id")
  .get(canGetProjectDetail, getProjectController)
  .delete(canDeleteUpdateCreateProject, deleteProjectController)
  .patch(canDeleteUpdateCreateProject, updateProjectController);

router
  .route("/uploadImage/:id")
  .patch(canDeleteUpdateCreateProject, createProjectImageController);
module.exports = router;
