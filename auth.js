const jwt = require("jsonwebtoken");
const AdminModel = require("./models/AdminModel");
const TrainerModel = require("./models/TrainerModel");
const { INTEGER } = require("sequelize");
const Project = require("./models/ProjectModel");
const Trainer = require("./models/TrainerModel");
const TrainersProjects = require("./models/TrainersProjects");
const verifyRequest = async (req, res) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return { status: 401 };
    }
    const token = authorization.split(" ")[1];
    if (!token) {
      return { status: 401 };
    }
    const data = jwt.verify(token, `${process.env.jwt_secret}`);

    if (!data) {
      return { status: 401 };
    }
    const id = data.id;
    if (!data.admin) {
      const trainer = await TrainerModel.findByPk(id, {
        attributes: { exclude: ["password"] },
      });

      if (!trainer) {
        return { status: 401 };
      } else {
        return { status: 200, value: trainer.dataValues, admin: false };
      }
    } else {
      const admin = await AdminModel.findByPk(data.id, {
        attributes: { exclude: ["password"] },
      });
      if (!admin) {
        return { status: 401 };
      } else {
        return { status: 200, value: admin.dataValues, admin: true };
      }
    }
  } catch (err) {
    console.log(err);
    return { status: 401 };
  }
};

const verifyRequestAccess = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({ msg: "Can't proceed" });
    }
    const token = authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Can't proceed" });
    }
    const data = jwt.verify(token, `${process.env.jwt_secret}`);

    if (!data) {
      return res.status(401).json({ msg: "Can't proceed" });
    }
    const id = data.id;
    if (!data.admin) {
      const trainer = await TrainerModel.findByPk(id, {
        attributes: { exclude: ["password"] },
      });

      if (!trainer) {
        return res.status(401).json({ msg: "Can't proceed" });
      } else {
        req.role = "trainer";
        next();
      }
    } else {
      const admin = await AdminModel.findByPk(data.id, {
        attributes: ["email", "firstName", "lastName", "role", "id"],
      });

      if (!admin) {
        return res.status(401).json({ msg: "Can't proceed" });
      } else {
        admin.dataValues.role === "HR"
          ? (req.role = "HR")
          : (req.role = "Project Lead");
        req.adminId = admin.dataValues.id;
        next();
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({ msg: "Can't proceed" });
  }
};

const canDeleteUpdateCreateProject = async (req, res, next) => {
  const { status, value, admin } = await verifyRequest(req, res);
  console.log(status, admin);
  if (status == 401 || !admin) {
    return res.status(401).json({ msg: "Can't proceed" });
  }

  req.admin = value;
  next();
};
const canGetProjectDetail = async (req, res, next) => {
  const { status, value, admin } = await verifyRequest(req, res);
  const { id } = req.params;

  if (status === 401) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  const project = await Project.findByPk(id);
  if (!project) {
    return res.status(404).json({ msg: "Project not found" });
  }

  if (admin) {
    if (value.id !== project.AdminId) {
      if (value.role !== "HR") {
        return res.status(401).json({ msg: "Unauthorized" });
      }
    }
    req.requestedBy = "admin";
  } else {
    req.requestedBy = "trainer";
  }

  next();
};

const canDeleteUpdateTrainer = async (req, res, next) => {
  const { status, value, admin } = await verifyRequest(req, res);

  if (status == 401) {
    return res.status(401).json({ msg: "Can't proceed" });
  }

  const { id } = req.params;
  if (!admin && id != value.id && admin.role !== "HR") {
    return res.status(401).json({ msg: "Can't proceed" });
  }

  next();
};

const canUpdateTrainerPassword = async (req, res, next) => {
  const { status, value, admin } = await verifyRequest(req, res);

  if (status === 401 || admin) {
    return res.status(401).json({ msg: "Can't proceed" });
  }

  const { id } = req.params;
  if (id != value.id) {
    return res.status(401).json({ msg: "Can't proceed" });
  }

  next();
};

const canCreateTrainer = async (req, res, next) => {
  const { status, value, admin } = await verifyRequest(req, res);
  // console.log(value, admin, status);
  if (status == 401) {
    return res.status(401).json({ msg: "Can't proceed" });
  }

  if (!admin) {
    return res.status(401).json({ msg: "Can't proceed" });
  }
  req.admin = value;
  next();
};

const canGetSingleTrainer = async (req, res, next) => {
  const { status, value, admin } = await verifyRequest(req, res);

  if (status == 401) {
    return res.status(401).json({ msg: "Can't proceed" });
  }

  const { id } = req.params;
  if (!admin && value.id != id) {
    return res.status(401).json({ msg: "Can't proceed" });
  }

  next();
};

const canGetAllTrainers = async (req, res, next) => {
  const { status, value, admin } = await verifyRequest(req, res);

  if (status == 401) {
    return res.status(401).json({ msg: "Can't proceed" });
  }

  if (!admin) {
    return res.status(401).json({ msg: "Can't proceed" });
  }
  req.admin = value;
  next();
};

const canUpdateDeleteAdmin = async (req, res, next) => {
  const { status, value, admin } = await verifyRequest(req, res);
  const { id } = req.params;

  if (status === 401 || value.id.toString() !== id) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  next();
};

const generateCode = async () => {
  const length = 4;
  const charset = "0123456789";

  let code = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    code += charset.charAt(randomIndex);
  }

  return code;
};

const canGetAllAdmins = async (req, res, next) => {
  try {
    const { status, value, admin } = await verifyRequest(req, res);
    console.log(value);
    if (!admin || value.role !== "HR") {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    next(0);
  } catch (error) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
};

const canCreateRating = async (req, res, next) => {
  const { status, admin, value } = await verifyRequest(req, res);
  if (status === 401 || !admin) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  const { projectId, trainerId } = req.body;

  const project = await Project.findByPk(projectId);
  const trainer = await Trainer.findByPk(trainerId);
  const application = await TrainersProjects.findOne({
    where: { TrainerId: trainerId, ProjectId: projectId },
  });
  if (!project) {
    return res.status(404).json({ msg: "Project is not found" });
  }

  if (project.status !== "Completed") {
    return res.status(400).json({ msg: "Project is not completed" });
  }

  if (project.adminId !== value.id) {
    if (value.role !== "HR") {
      return res.status(401).json({ msg: "Unauthorized" });
    }
  }

  if (!trainer) {
    return res.status(404).json({ msg: "Trainer is not found" });
  }

  if (!application) {
    return res
      .status(404)
      .json({ msg: "Trainer did not apply for this project" });
  }

  req.admin = value;
  next();
};

const canGetRating = async (req, res, next) => {
  const { status, admin, value } = await verifyRequest(req, res);
  if (status === 401) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  const { projectId, trainerId } = req.params;

  const project = await Project.findByPk(projectId);
  const trainer = await Trainer.findByPk(trainerId);
  const application = await TrainersProjects.findOne({
    where: { TrainerId: trainerId, ProjectId: projectId },
  });
  if (!project) {
    return res.status(404).json({ msg: "Project is not found" });
  }

  if (!trainer) {
    return res.status(404).json({ msg: "Trainer is not found" });
  }

  if (!application) {
    return res
      .status(404)
      .json({ msg: "Trainer did not apply for this project" });
  }
  if (!admin) {
    if (value.id !== application.TrainerId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
  }

  if (value.id !== project.id) {
    if (value.role !== "HR") {
      return res.status(401).json({ msg: "Unauthorized" });
    }
  }

  req.admin = value;
  next();
};

const canUpdateRating = async (rea, res, next) => {
  const { status, admin, value } = await verifyRequest(req, res);
  if (status === 401 || !admin) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  const { projectId, trainerId } = req.params;

  const project = await Project.findByPk(projectId);
  const trainer = await Trainer.findByPk(trainerId);
  const application = await TrainersProjects.findOne({
    where: { TrainerId: trainerId, ProjectId: projectId },
  });
  if (!project) {
    return res.status(404).json({ msg: "Project is not found" });
  }

  if (!trainer) {
    return res.status(404).json({ msg: "Trainer is not found" });
  }

  if (!application) {
    return res
      .status(404)
      .json({ msg: "Trainer did not apply for this project" });
  }

  if (value.id !== project.id) {
    if (value.role !== "HR") {
      return res.status(401).json({ msg: "Unauthorized" });
    }
  }

  req.admin = value;
  next();
};

module.exports = {
  verifyRequest,
  canDeleteUpdateCreateProject,
  canDeleteUpdateTrainer,
  verifyRequestAccess,
  canGetSingleTrainer,
  canGetAllTrainers,
  canUpdateDeleteAdmin,
  canCreateTrainer,
  generateCode,
  canGetAllAdmins,
  canCreateRating,
  canUpdateTrainerPassword,
  canUpdateRating,
  canGetRating,
  canGetProjectDetail,
};
