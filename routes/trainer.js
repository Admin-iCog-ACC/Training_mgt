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
  sendRegistrationLinkController,
  activateTrainerAccountController,
} = require("../controllers/trainer");

const {
  verifyRequestAccess,
  canGetSingleTrainer,
  canGetAllTrainers,
  canDeleteUpdateTrainer,
  canCreateTrainer,
  canUpdateTrainerPassword,
} = require("../auth");
/**
 * @swagger
 * /api/trainer:
 *   get:
 *     tags:
 *        - Trainer
 *     security:
 *       - bearerAuth: []
 *     description: Returns list of trainers
 *     responses:
 *       200:
 *         description: A list of trainers
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
 *        - Trainer
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
 *               address:
 *                 type: string
 *               gender:
 *                 type: string
 *               AreaofExpertise:
 *                 type: string
 *               experienceLevel:
 *                 type: string
 *               bio:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: trainer successfully created
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
 *               example: {msg: Failed to create trainer}
 * /api/trainer/{id}:
 *   get:
 *     tags:
 *        - Trainer
 *     security:
 *       - bearerAuth: []
 *     description: Returns a trainer
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Returns a trainer
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
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Trainer not found}
 *   patch:
 *     tags:
 *        - Trainer
 *     security:
 *       - bearerAuth: []
 *     description: Updates a trainer
 *     parameters:
 *       - in: path
 *         name: id
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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               gender:
 *                 type: string
 *               AreaofExpertise:
 *                 type: string
 *               experienceLevel:
 *                 type: string
 *               bio:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: trainer successfully updated
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
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Trainer not found}
 *   delete:
 *     tags:
 *        - Trainer
 *     security:
 *       - bearerAuth: []
 *     description: Deletes a trainer
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *          type: string
 *
 *     responses:
 *       204:
 *         description: trainer successfully deleted
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
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Trainer not found}
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Failed to delete a trainer}
 * /api/trainer/password/{id}:
 *   patch:
 *     tags:
 *        - Trainer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               password:
 *                 type: string
 *               oldPassword:
 *                 type: string
 *
 *     description: Updates trainer's password
 *     responses:
 *       200:
 *         description: Password updated
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
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Incorrect old password}
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: trainer not found.}
 *
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Failed to update password}
 *
 *
 */
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
  .patch(canDeleteUpdateTrainer, createTrainerImageController); // not added on swagger docs
router
  .route("/uploadCV/:id")
  .patch(canDeleteUpdateTrainer, createTrainerCvController); // not added on swagger docs
router
  .route("/password/:id")
  .patch(canUpdateTrainerPassword, updateTrainerPasswordController);
router
  .route("/send_registration_link")
  .post(canCreateTrainer, sendRegistrationLinkController);
router
  .route("/activate_trainer_account")
  .post(activateTrainerAccountController);
module.exports = router;
