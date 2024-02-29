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
/**
 * @swagger
 * /api/admin:
 *   get:
 *     tags:
 *        - Admin
 *     security:
 *       - bearerAuth: []
 *     description: Returns a list of admins
 *     responses:
 *       200:
 *         description: A list of admins
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized / Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Unauthorized}
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Operation Failed}
 *   post:
 *     tags:
 *        - Admin
 *     security:
 *       - bearerAuth: []
 *     description: Creates a project lead
 *     requestBody:
 *       description: Optional description in *Markdown*
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               gender:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: project lead successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {success: true}
 *       401:
 *         description: Unauthorized / Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Unauthorized}
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Email and/or phone number already used}
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { msg: Failed to create admin }
 * /api/admin/{id}:
 *   get:
 *     tags:
 *        - Admin
 *     security:
 *       - bearerAuth: []
 *     description: Returns an admin
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *          type: string
 *
 *     responses:
 *       200:
 *         description: Returns an admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { msg: Admin not found}
 *   patch:
 *     tags:
 *        - Admin
 *     security:
 *       - bearerAuth: []
 *     description: Updates an admin
 *     requestBody:
 *       description: Optional description in *Markdown*
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               gender:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *          type: string
 *     responses:
 *       200:
 *         description: project lead successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *       401:
 *         description: Unauthorized / Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Unauthorized}
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Duplicated email and/or phone number}
 *       404:
 *         description: Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: admin not found}
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { msg: Failed to update admin }
 *   delete:
 *     tags:
 *        - Admin
 *     security:
 *       - bearerAuth: []
 *     description: Deletes an admin
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *          type: string
 *     responses:
 *       204:
 *         description: Admin successfully deleted
 *
 *
 *       401:
 *         description: Unauthorized / Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Unauthorized}
 *       404:
 *         description: Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: admin not found}
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { msg: Failed to delete admin }
 *
 * /api/admin/password/{id}:
 *   patch:
 *     tags:
 *        - Admin
 *     security:
 *       - bearerAuth: []
 *     description: Returns an admin
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *          type: string
 *
 *     responses:
 *       200:
 *         description: Returns an admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized / Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Unauthorized}
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { msg: Failed to update password }
 *       404:
 *         description: Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { msg: Admin not found}
 *
 *
 *
 */

router
  .route("/")
  .get(canGetAllAdmins, getAllAdminController)
  .post(createAdminController);
router
  .route("/:id")
  .get(getAdminController)
  .patch(canUpdateDeleteAdmin, updateAdminController)
  .delete(canUpdateDeleteAdmin, deleteAdminController);

router.route("/uploadImage/:id").patch(uploadAdminImageController); // not added on swagger docs
router
  .route("/password/:id")
  .patch(canUpdateDeleteAdmin, updateAdminPasswordController);
module.exports = router;
