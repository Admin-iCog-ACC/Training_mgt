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
/**
 * @swagger
 * /api/project:
 *   get:
 *     tags:
 *        - Project
 *     security:
 *       - bearerAuth: []
 *     description: Returns list of projects
 *     responses:
 *       200:
 *         description: A list of projects
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
 *               example: {msg: Can't proceed}
 *   post:
 *     tags:
 *        - Project
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
 *               title:
 *                 type: string
 *               imageURL:
 *                 type: string
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *               overview:
 *                 type: string
 *               startDate:
 *                 type: string
 *               endDate:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *               budget:
 *                 type: string
 *               span:
 *                 type: string
 *               days:
 *                 type: array
 *     responses:
 *       201:
 *         description: project successfully created
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
 *               example: {msg: Can't proceed}
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Failed to create project}
 * /api/project/{id}:
 *   get:
 *     tags:
 *        - Project
 *     security:
 *       - bearerAuth: []
 *     description: Returns a project
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *          type: string
 *
 *     responses:
 *       200:
 *         description: Returns a project
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Project not found}
 *       401:
 *         description: Unauthorized / Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Unauthorized}
 *   delete:
 *     tags:
 *        - Project
 *     security:
 *       - bearerAuth: []
 *     description: Deletes a project
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *          type: string
 *
 *     responses:
 *       401:
 *         description: Unauthorized / Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Unauthorized}
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Project not found}
 *       204:
 *         description: Project successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Failed to delete project}
 *   patch:
 *     tags:
 *        - Project
 *     security:
 *       - bearerAuth: []
 *     description: Updates a project
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *          type: string
 *
 *     responses:
 *       401:
 *         description: Unauthorized / Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Unauthorized}
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Project not found}
 *       200:
 *         description: Project successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Failed to update project}
 */
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
  .patch(canDeleteUpdateCreateProject, createProjectImageController); // not added on swagger docs
module.exports = router;
