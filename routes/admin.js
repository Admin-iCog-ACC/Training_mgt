const express = require("express");
const router = express.Router();
const { verifyRequest, canGetAllAdmins } = require("../auth");
const {
  getAdminController,
  getAllAdminController,
  createAdminController,
  updateAdminController,
  deleteAdminController,
  uploadAdminImageController,
  updateAdminPasswordController,
} = require("../controllers/admin");
const { canUpdateDeleteAdmin } = require("../auth");
router
  .route("/")
  .get(canGetAllAdmins, getAllAdminController)
  .post(createAdminController);
router
  .route("/:id")
  .get(getAdminController)
  .patch(canUpdateDeleteAdmin, updateAdminController)
  .delete(canUpdateDeleteAdmin, deleteAdminController);

router.route("/uploadImage/:id").patch(uploadAdminImageController);
router
  .route("/password/:id")
  .patch(canUpdateDeleteAdmin, updateAdminPasswordController);
module.exports = router;
