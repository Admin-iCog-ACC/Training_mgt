const express = require("express");
const TrainerModel = require("../models/TrainerModel");
const AdminModel = require("../models/AdminModel");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyRequest, generateCode } = require("../auth");
const { NewReleasesSharp, RateReviewSharp } = require("@material-ui/icons");
const { sendRecoveryCode } = require("../Email");
const { verify } = require("../nodeMailer");

/**
 * @swagger
 * /api/auth/trainer/login:
 *   post:
 *     tags:
 *        - Authentication
 *     description: This api allows trainers to login
 *     requestBody:
 *       description: Optional description in *Markdown*
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
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
 *               example: {msg: Failed to login.}
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Incorrect username and/or password.}
 *
 */
router.route("/trainer/login").post(async (req, res) => {
  try {
    // const errors = validate(req);
    // if (!errors.isEmpty()) return res.status(400).json(errors);

    const { email, password } = req.body;
    // const user = await User.findOne({ username });
    const trainer = await TrainerModel.findOne({ where: { email } });

    if (!trainer) {
      return res.status(400).json({
        location: "",
        msg: "Incorrect username and/or password.",
        type: "",
        path: "",
      });
    }

    console.log(trainer.dataValues);
    if (await bcrypt.compare(password, trainer.dataValues.password)) {
      const token = jwt.sign(
        {
          id: trainer.dataValues.id,
          admin: false,
          email: trainer.dataValues.email,
        },
        `${process.env.jwt_secret}`
      );
      return res.status(200).json({ access_token: token });
    }

    return res.status(400).json({
      location: "",
      msg: "Incorrect username and/or password.",
      type: "",
      path: "",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to login." });
  }
});

/**
 * @swagger
 * /api/auth/admin/login:
 *   post:
 *     tags:
 *        - Authentication
 *     description: This api allows admins to login
 *     requestBody:
 *       description: Optional description in *Markdown*
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
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
 *               example: {msg: Failed to login.}
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Incorrect username and/or password.}
 *
 */
router.route("/admin/login").post(async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await AdminModel.findOne({ where: { email } });

    if (!admin) {
      return res.status(400).json({
        msg: "Invalid credentials",
      });
    }

    if (!admin.active) {
      return res.status(400).json({
        msg: "Invalid credentials",
      });
    }

    if (await bcrypt.compare(password, admin.password)) {
      const token = jwt.sign(
        {
          id: admin.id,
          admin: true,
          email: admin.email,
          role: admin.role,
        },
        `${process.env.jwt_secret}`
      );
      return res.status(200).json({ access_token: token });
    }
    return res.status(400).json({
      location: "",
      msg: "Incorrect username and/or password.",
      type: "",
      path: "",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to login." });
  }
});

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     tags:
 *        - Authentication
 *     security:
 *       - bearerAuth: []
 *     description: This api allows to verify a token
 *     requestBody:
 *       description: Optional description in *Markdown*
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Application successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Please login}
 *
 *
 */
router.route("/verify").get(async (req, res) => {
  const { status, value, admin } = await verifyRequest(req, res);

  if (status == 401) {
    return res.status(401).json({ msg: "Please login" });
  }
  console.log(value);
  return res.status(200).json({ ...value, admin });
});

/**
 * @swagger
 * /api/auth/send_password_code:
 *   post:
 *     tags:
 *        - Authentication
 *     description: This api allows users to send a code
 *     requestBody:
 *       description: Optional description in *Markdown*
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Code sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: code sent}
 *
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: user not found}
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Failed to send code}
 *
 */
router.route("/send_password_code").post(async (req, res) => {
  const { email } = req.body;
  const trainer = await TrainerModel.findOne({ where: { email } });
  const time = new Date();
  const code = await generateCode();

  if (trainer) {
    const { id, email } = trainer;
    if (!trainer.active) {
      return res.status(400).json({ msg: "Failed to send code" });
    }
    await TrainerModel.update(
      { recoveryDigits: code, time },
      {
        where: {
          id,
        },
        returning: true,
      }
    );
    await sendRecoveryCode(email, trainer, code);
    return res.status(201).json({ msg: "Code sent" });
  }

  const admin = await AdminModel.findOne({ where: { email } });
  if (admin) {
    const { id, email } = admin;
    if (!admin.active) {
      return res.status(400).json({ msg: "Failed to send code" });
    }
    await AdminModel.update(
      { recoveryDigits: code, time },
      {
        where: {
          id,
        },
        returning: true,
      }
    );

    await sendRecoveryCode(email, admin, code);
    return res.status(201).json({ msg: "Code sent" });
  } else {
    return res.status(404).json({ msg: "user not found" });
  }
});

/**
 * @swagger
 * /api/auth/update/password:
 *   post:
 *     tags:
 *        - Authentication
 *     description: This api allows users to forget their password
 *     requestBody:
 *       description: Optional description in *Markdown*
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recoveryDigits:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Code sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Password updated}
 *
 *       401:
 *         description: Invalid code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Invalid code}
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: user not found}
 *
 */
router.route("/update/password").post(async (req, res) => {
  const { password, recoveryDigits, email } = req.body;

  const trainer = await TrainerModel.findOne({ where: { email } });
  if (trainer) {
    if (trainer.recoveryDigits !== recoveryDigits) {
      return res.status(401).json({ msg: "Invalid code" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await TrainerModel.update(
      { password: hashedPassword, recoveryDigits: null, time: null },
      {
        where: {
          id: trainer.id,
        },
      }
    );
    return res.status(200).json({ msg: "Password updated" });
  }

  const admin = await AdminModel.findOne({ where: { email } });

  if (admin) {
    if (admin.recoveryDigits !== recoveryDigits) {
      return res.status(401).json({ msg: "Invalid code" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await AdminModel.update(
      { password: hashedPassword, recoveryDigits: null, time: null },
      {
        where: {
          id: admin.id,
        },
      }
    );

    return res.status(200).json({ msg: "Password updated" });
  } else {
    return res.status(404).json({ msg: "user not found" });
  }
});

/**
 * @swagger
 * /api/auth/change/password:
 *   post:
 *     tags:
 *        - Authentication
 *     security:
 *       - bearerAuth: []
 *     description: This api allows users to change their password
 *     requestBody:
 *       description: Optional description in *Markdown*
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: password updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: password successfully updated}
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
 *               example: {msg: Invalid old password}
 *
 */
router.route("/change/password").post(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { status, value, admin } = await verifyRequest(req, res);

  if (status === 401) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  if (!(await bcrypt.compare(oldPassword, value.password))) {
    return res.status(400).json({ msg: "Invalid old password" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  if (admin) {
    await AdminModel.update(
      { password: hashedPassword },
      {
        where: {
          id: value.id,
        },
      }
    );
  } else {
    await TrainerModel.update(
      { password: hashedPassword },
      {
        where: {
          id: value.id,
        },
      }
    );
  }
  return res.status(201).json({ msg: "password successfully updated" });
});

/**
 * @swagger
 * /api/auth/delete/account:
 *   delete:
 *     tags:
 *        - Authentication
 *     security:
 *       - bearerAuth: []
 *     description: This api allows to deactivate a user account
 *
 *
 *     responses:
 *       204:
 *         description: account deactivated
 *         content:
 *           application/json:
 *             schema:
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Failed to delete}
 *
 */
router.route("/delete/account").delete(async (req, res) => {
  try {
    const { status, value, admin } = await verifyRequest(req, res);
    if (status === 401) {
      return res.status(404).json({
        msg: "Not found",
      });
    }

    if (admin) {
      await AdminModel.update(
        { active: false },
        {
          where: {
            id: value.id,
          },
        }
      );
    }

    if (!admin) {
      await TrainerModel.update(
        { active: false },
        {
          where: {
            id: value.id,
          },
        }
      );
    }
    return res.status(204).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to delete" });
  }
});

/**
 * @swagger
 * /api/auth/deactivate/account/{id}:
 *   post:
 *     tags:
 *        - Authentication
 *     security:
 *       - bearerAuth: []
 *     description: This api allows to activate a user account
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *          type: string
 *
 *     requestBody:
 *       description: Optional description in *Markdown*
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               active:
 *                 type: boolean
 *     responses:
 *       204:
 *         description: account activated
 *         content:
 *           application/json:
 *             schema:
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Failed to deactivate}
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: User not found}
 *       401:
 *         description: Unauthorized / Invalid Token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {msg: Unauthorized }
 *
 */
router.route("/deactivate/account/:id").post(async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    const { status, value, admin } = await verifyRequest(req, res);

    if (status === 401 || !admin || value.role === "Project Lead") {
      return res.status(401).json({
        msg: "Unauthorized",
      });
    }

    const checkAdmin = await AdminModel.findByPk(id);
    if (checkAdmin) {
      await AdminModel.update(
        { active },
        {
          where: {
            id,
          },
        }
      );
      return res.status(204).json();
    }
    const checkTrainer = await TrainerModel.findByPk(id);

    if (checkTrainer) {
      await TrainerModel.update(
        { active },
        {
          where: {
            id,
          },
        }
      );
    } else {
      return res.status(404).json({ msg: "User not found" });
    }
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ msg: "Failed to activate" });
  }
});

module.exports = router;
