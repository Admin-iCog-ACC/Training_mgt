const {
  sendGeneratedPassword,
  generatePassword,
  sendGeneratedLink,
} = require("../Email");
const { uploadFile } = require("../cloudinary");
const ProjectModel = require("../models/ProjectModel");
const TrainerModel = require("../models/TrainerModel");
const TrainersProjects = require("../models/TrainersProjects");
const bcrypt = require("bcrypt");
const TrainersRating = require("../models/TrainersRating");
const jwt = require("jsonwebtoken");
const { verifyRegistrationToken } = require("../auth");
const uploadTrainerImageService = async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  try {
    const trainer = await TrainerModel.findByPk(id);

    if (!trainer) {
      return res
        .status(404)
        .json({ location: "", path: "", msg: "trainer not found.", type: "" });
    }
    const { public_id, secure_url } = await uploadFile(data.profileImage);

    trainer.set({
      profileImage: secure_url,
      profileImageId: public_id,
    });
    await trainer.save();
    return res.status(201).json({ trainer: trainer });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to upload image." });
  }
};
const uploadTrainerCvService = async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  try {
    const trainer = await TrainerModel.findByPk(id);

    if (!trainer) {
      return res
        .status(404)
        .json({ location: "", path: "", msg: "trainer not found.", type: "" });
    }
    const { public_id, secure_url } = await uploadFile(data.CvURL);
    trainer.set({
      CvURL: secure_url,
      CVId: public_id,
    });
    await trainer.save();
    return res.status(201).json({ trainer: trainer });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to upload image." });
  }
};

const getAllTrainersServices = async (req, res) => {
  const trainers = await TrainerModel.findAll({
    include: { model: TrainersProjects, include: ProjectModel },
  });
  return res.status(200).json({ trainers: trainers });
};

const getTrainerServices = async (req, res) => {
  const { id } = req.params;
  const trainer = await TrainerModel.findOne({
    where: { id },
  });

  if (!trainer) {
    return res.status(404).json({ msg: "trainer not found." });
  }
  const numRating = await TrainersRating.count({
    where: { TrainerId: id },
  });
  const projects = await TrainersProjects.findAll({
    where: { TrainerId: id },
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: ProjectModel,

        include: [
          { model: TrainersRating, required: false, where: { TrainerId: id } },
        ],
      },
    ],
  });
  return res
    .status(200)
    .json({ trainer: { ...trainer.dataValues, numRating }, projects });
};

const createTrainerServices = async (req, res) => {
  const data = req.body;
  const admin = req.admin;
  const AdminId = req.admin.id;
  try {
    const newPassword = generatePassword();
    console.log(newPassword);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    const trainer = await TrainerModel.create({
      ...data,
      password: hashedPassword,
      AdminId,
    });

    const sent = await sendGeneratedPassword(
      trainer,
      newPassword,
      false,
      admin
    );

    return res.status(201).json({ trainer: trainer });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to create trainer" });
  }
};
const updateTrainerServices = async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  const trainer = await TrainerModel.findByPk(id);
  if (!trainer) {
    return res.status(404).json({ msg: "trainer not found." });
  }
  try {
    const updatedTrainer = await TrainerModel.update(data, {
      where: {
        id,
      },
      returning: true,
    });

    return res.status(200).json({ msg: "trainer updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to update trainer" });
  }
};

const deleteTrainerServices = async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  const trainer = await TrainerModel.findByPk(id);
  if (!trainer) {
    return res.status(404).json({ msg: "trainer not found." });
  }
  try {
    await TrainerModel.destroy({
      where: {
        id,
      },
    });

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ msg: "Failed to delete trainer" });
  }
};

const updateTrainerPasswordServices = async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;
    const trainer = await TrainerModel.findByPk(id);
    if (!trainer) {
      return res.status(404).json({ msg: "trainer not found." });
    }
    if (!(await bcrypt.compare(data.oldPassword, trainer.password))) {
      return res.status(400).json({ msg: "Incorrect old password" });
    }
    const salt = await bcrypt.genSalt(10);

    const newPassword = await bcrypt.hash(data.newPassword, salt);
    const updatedTrainer = await TrainerModel.update(
      { password: newPassword },
      {
        where: {
          id,
        },
        returning: true,
      }
    );
    return res.status(200).json({ trainer: updatedTrainer[1][0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to update password" });
  }
};

const sendTrainerRegistrationLinkService = async (req, res) => {
  const data = req.body;
  const admin = req.admin;
  const AdminId = req.admin.id;
  try {
    const checkTrainer = await TrainerModel.findOne({
      where: { email: data.email },
    });

    if (checkTrainer) {
      if (checkTrainer.active) {
        return res.status(400).json({ msg: "Trainer already registered." });
      } else {
        const token = jwt.sign(
          {
            id: checkTrainer.id,
            email: checkTrainer.email,
          },
          `${process.env.registration_secret}`,
          { expiresIn: 30 * 60 }
        );
        const link = `${process.env.frontend_url}?token=${token}`;
        const sent = await sendGeneratedLink(checkTrainer, link, admin);
        if (!sent) {
          return res
            .status(500)
            .json({ msg: "Failed to send registration link" });
        }
        return res.status(201).json({
          msg: "Registration link successfully sent",
          trainer: checkTrainer,
        });
      }
    }
    const trainer = await TrainerModel.create({
      ...data,
      AdminId,
      active: false,
    });
    const token = jwt.sign(
      {
        id: trainer.id,
        email: trainer.email,
      },
      `${process.env.registration_secret}`,
      { expiresIn: 30 * 60 }
    );
    const link = `${process.env.frontend_url}?token=${token}`;
    const sent = await sendGeneratedLink(trainer, link, admin);
    if (!sent) {
      return res.status(500).json({ msg: "Failed to send registration link" });
    }
    return res
      .status(201)
      .json({ msg: "Registration link successfully sent", trainer });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to send registration link" });
  }
};

const activateTrainerAccountService = async (req, res) => {
  try {
    const result = await verifyRegistrationToken(req);
    const { password } = req.body;
    if (!result) {
      return res.status(401).json({ msg: "Invalid token" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await TrainerModel.update(
      { password: hashedPassword, active: true },
      { where: { id: result.id } }
    );
    return res.status(200).json({ msg: "Account successfully activated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to activate account" });
  }
};
module.exports = {
  getTrainerServices,
  getAllTrainersServices,
  createTrainerServices,
  updateTrainerServices,
  deleteTrainerServices,
  uploadTrainerImageService,
  updateTrainerPasswordServices,
  uploadTrainerCvService,
  sendTrainerRegistrationLinkService,
  activateTrainerAccountService,
};
