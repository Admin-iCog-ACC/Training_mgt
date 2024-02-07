const AdminModel = require("../models/AdminModel");
const Trainer = require("../models/TrainerModel");
const ProjectModel = require("../models/ProjectModel");
const bcrypt = require("bcrypt");
const TrainersProjects = require("../models/TrainersProjects");
const { uploadFile } = require("../cloudinary");
const getAllAdminsServices = async (req, res) => {
  const admins = await AdminModel.findAll({ include: ProjectModel });
  return res.status(200).json({ admins: admins });
};

const getAdminServices = async (req, res) => {
  const { id } = req.params;
  const admin = await AdminModel.findByPk(id, { include: ProjectModel });

  if (!admin) {
    return res
      .status(404)
      .json({ location: "", path: "", msg: "Admin not found.", type: "" });
  }

  return res.status(200).json({ admin: admin });
};

const createAdminServices = async (req, res) => {
  const data = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const admin = await AdminModel.create({
      ...data,
      password: hashedPassword,
    });

    return res.status(201).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to create admin" });
  }
};

const updateAdminServices = async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  const admin = await AdminModel.findByPk(id);
  if (!admin) {
    return res
      .status(404)
      .json({ location: "", path: "", msg: "admin not found.", type: "" });
  }
  try {
    const updatedAdmin = await AdminModel.update(data, {
      where: {
        id,
      },
      returning: true,
    });

    return res.status(200).json({ admin: updatedAdmin[1][0] });
  } catch (error) {
    return res.status(500).json({ msg: "Failed to update admin" });
  }
};

const updateAdminPasswordService = async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;
    const admin = await AdminModel.findByPk(id);
    if (!admin) {
      return res
        .status(404)
        .json({ location: "", path: "", msg: "admin not found.", type: "" });
    }
    if (!(await bcrypt.compare(data.oldPassword, admin.password))) {
      return res.status(400).json({ msg: "Incorrect old password" });
    }
    const salt = await bcrypt.genSalt(10);

    const newPassword = await bcrypt.hash(data.newPassword, salt);
    const updatedAdmin = await AdminModel.update(
      { password: newPassword },
      {
        where: {
          id,
        },
        returning: true,
      }
    );
    return res.status(200).json({ admin: updatedAdmin[1][0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to update password" });
  }
};

const deleteAdminServices = async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  const admin = await AdminModel.findByPk(id);
  if (!admin) {
    return res
      .status(404)
      .json({ location: "", path: "", msg: "admin not found.", type: "" });
  }
  try {
    await AdminModel.destroy({
      where: {
        id,
      },
    });

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ msg: "Failed to delete admin" });
  }
};

const uploadAdminImageService = async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  try {
    const admin = await AdminModel.findByPk(id);

    if (!admin) {
      return res
        .status(404)
        .json({ location: "", path: "", msg: "admin not found.", type: "" });
    }
    const { public_id, secure_url } = await uploadFile(data.profileImage);

    admin.set({
      imageURL: secure_url,
      imageID: public_id,
    });
    await admin.save();
    return res.status(201).json({ admin: admin });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to upload image." });
  }
};
module.exports = {
  getAllAdminsServices,
  getAdminServices,
  createAdminServices,
  updateAdminServices,
  deleteAdminServices,
  uploadAdminImageService,
  updateAdminPasswordService,
};
