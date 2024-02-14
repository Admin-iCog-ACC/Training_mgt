const express = require("express");
const TrainerModel = require("../models/TrainerModel");
const AdminModel = require("../models/AdminModel");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyRequest, generateCode } = require("../auth");
const { NewReleasesSharp } = require("@material-ui/icons");
const { sendRecoveryCode } = require("../Email");
const { verify } = require("../nodeMailer");

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
        msg: "Invalid credentials",
        type: "",
        path: "",
      });
    }

    if (await bcrypt.compare(password, trainer.password)) {
      const token = jwt.sign(
        {
          id: trainer.id,
          admin: false,
          email: trainer.email,
        },
        "1234"
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
    return res
      .status(500)
      .json({ msg: "Failed to login.", path: "", location: "", type: "" });
  }
});

router.route("/admin/login").post(async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await AdminModel.findOne({ where: { email } });

    if (!admin) {
      return res.status(400).json({
        location: "",
        msg: "Invalid credentials",
        type: "",
        path: "",
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
        "1234"
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
    return res
      .status(500)
      .json({ msg: "Failed to login.", path: "", location: "", type: "" });
  }
});

router.route("/verify").get(async (req, res) => {
  const { status, value, admin } = await verifyRequest(req, res);

  if (status == 401) {
    return res.status(401).json({ msg: "Please login" });
  }
  console.log(value);
  return res.status(200).json({ ...value, admin });
});

router.route("/send_password_code").post(async (req, res) => {
  const { email } = req.body;
  const trainer = await TrainerModel.findOne({ where: { email } });
  const time = new Date();
  const code = await generateCode();
  if (trainer) {
    const { id, email } = trainer;
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
    return res.status(404).json({ msg: "not found" });
  }
});

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
    return res.status(404).json({ msg: "Not found" });
  }
});

router.route("/change/password").post(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { status, value, admin } = await verifyRequest(req, res);

  if (status === 401) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  if (!(await bcrypt.compare(oldPassword, value.password))) {
    return res.status(401).json({ msg: "Invalid old password" });
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

router.route("/delete/account").delete(async (req, res) => {
  try {
    const { status, value, admin } = await verifyRequest(req, res);
    if (status === 401) {
      return res.status(404).json({
        msg: "Not found",
      });
    }

    if (admin) {
      await AdminModel.destroy({
        where: {
          id: value.id,
        },
      });
    }

    if (!admin) {
      await TrainerModel.destroy({
        where: {
          id: value.id,
        },
      });
    }
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ msg: "Failed to delete" });
  }
});

module.exports = router;