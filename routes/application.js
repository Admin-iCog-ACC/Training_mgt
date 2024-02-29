const express = require("express");
const router = express.Router();
const {
  createApplicationController,
  manageApplicationController,
} = require("../controllers/application");
/**
 * @swagger
 * /api/application:
 *   post:
 *     tags:
 *        - Application
 *     security:
 *       - bearerAuth: []
 *     description: This api allows trainers to apply for a project
 *     requestBody:
 *       description: Optional description in *Markdown*
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ProjectId:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Application successful
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
 *       404:
 *         description: Unauthorized / Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Project Not found}
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Operation Failed}
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: You have already applied}
 * /api/application/{TrainerId}/{ProjectId}:
 *    patch:
 *     tags:
 *        - Application
 *     security:
 *       - bearerAuth: []
 *     description: Updates the status of trainers application
 *     parameters:
 *       - in: path
 *         name: TrainerId
 *         schema:
 *          type: string
 *       - in: path
 *         name: ProjectId
 *         schema:
 *          type: string
 *     requestBody:
 *       description: Optional description in *Markdown*
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: trainer application updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {success: status updated}
 *       404:
 *         description: Trainer has not applied for this project
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: application not found.}
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { msg: Operation Failed }
 *
 *
 *
 */
router.route("/").post(createApplicationController);
router.route("/:TrainerId/:ProjectId").patch(manageApplicationController);

module.exports = router;
