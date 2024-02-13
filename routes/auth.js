const express = require("express");
const TrainerModel = require("../models/TrainerModel");
const AdminModel = require("../models/AdminModel");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyRequest, generateCode } = require("../auth");
const { NewReleasesSharp } = require("@material-ui/icons");
const { sendRecoveryCode } = require("../Email");

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

router.route("/send_password_code").get(async (req, res) => {
  const { status, value, admin } = await verifyRequest(req, res);
  if (status === 401) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  const { id } = value;
  const code = await generateCode();

  const time = new Date();
  if (admin) {
    await AdminModel.update(
      { recoveryDigits: code, time },
      {
        where: {
          id,
        },
        returning: true,
      }
    );

    await sendRecoveryCode(value.email, value, code);
  } else {
    await TrainerModel.update(
      { recoveryDigits: code, time },
      {
        where: {
          id,
        },
        returning: true,
      }
    );
    await sendRecoveryCode(value.email, value, code);
  }
  return res.status(201).json({ msg: "Code sent" });
});

router.route("/change/password").post(async (req, res) => {
  const { password, recoveryDigits } = req.body;
  const { status, value, admin } = await verifyRequest(req, res);
  console.log(status, value);
  if (status === 401) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  if (value.recoveryDigits !== recoveryDigits) {
    return res.status(401).json({ msg: "Invalid code" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const updatedAdmin = await AdminModel.update(
    { password: hashedPassword, recoveryDigits: null, time: null },
    {
      where: {
        id: value.id,
      },
    }
  );

  return res.status(201).json({ msg: "password successfully updated" });
});

module.exports = router;
