const express = require("express");
const router = express.Router();
const {
  createRatingController,
  deleteRatingController,
  getRatingController,
  getTrainerOverallRatingController,
  updateRatingController,
} = require("../controllers/rating");
const { canCreateRating, canGetRating } = require("../auth");

/**
 * @swagger
 * /api/rating:
 *   post:
 *     tags:
 *        - Rating
 *     security:
 *       - bearerAuth: []
 *     description: This api allows to rate trainers on a project
 *     requestBody:
 *       description: Optional description in *Markdown*
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trainerId:
 *                 type: string
 *               projectId:
 *                 type: string
 *               ratingRationale:
 *                 type: string
 *               rating:
 *                 type: string
 *     responses:
 *       201:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Failed to rate}
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Trainer has not finished working on this project}
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Trainer not found }
 *       401:
 *         description: Unauthorized / Invalid Token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Unauthorized }
 * /api/rating/project/{trainerId}/{projectId}:
 *   delete:
 *     tags:
 *        - Rating
 *     security:
 *       - bearerAuth: []
 *     description: This api allows to rate trainers on a project
 *     parameters:
 *       - in: path
 *         name: trainerId
 *         schema:
 *          type: string
 *       - in: path
 *         name: projectId
 *         schema:
 *          type: string
 *
 *     responses:
 *       201:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Failed to rate}
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Trainer has not finished working on this project}
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Trainer not found }
 *       401:
 *         description: Unauthorized / Invalid Token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Unauthorized }
 *   get:
 *     tags:
 *        - Rating
 *     security:
 *       - bearerAuth: []
 *     description: This api allows to rate trainers on a project
 *     parameters:
 *       - in: path
 *         name: trainerId
 *         schema:
 *          type: string
 *       - in: path
 *         name: projectId
 *         schema:
 *          type: string
 *
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Trainer not found }
 *       401:
 *         description: Unauthorized / Invalid Token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Unauthorized }
 *   patch:
 *     tags:
 *        - Rating
 *     security:
 *       - bearerAuth: []
 *     description: This api allows to rate trainers on a project
 *     parameters:
 *       - in: path
 *         name: trainerId
 *         schema:
 *          type: string
 *       - in: path
 *         name: projectId
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
 *               rating:
 *                 type: string
 *               ratingRationale:
 *                 type: string
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Trainer not found }
 *       401:
 *         description: Unauthorized / Invalid Token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Unauthorized }
 *
 */
router.route("/").post(canCreateRating, createRatingController);
router
  .route("/project/:trainerId/:projectId")
  .delete(deleteRatingController)
  .get(canGetRating, getRatingController)
  .patch(updateRatingController);

router.route("/overall/:trainerId").get(getTrainerOverallRatingController); // not added on swagger docs
module.exports = router;
