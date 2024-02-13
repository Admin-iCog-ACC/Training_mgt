const jwt = require("jsonwebtoken");
const AdminModel = require("./models/AdminModel");
const TrainerModel = require("./models/TrainerModel");
const { INTEGER } = require("sequelize");
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
    const data = jwt.verify(token, "1234");

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
    // console.log(err);
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
    const data = jwt.verify(token, "1234");

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
        next();
      }
    } else {
      const admin = await AdminModel.findByPk(data.id, {
        attributes: ["email", "firstName", "lastName"],
      });

      if (!admin) {
        return res.status(401).json({ msg: "Can't proceed" });
      } else {
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

  if (status == 401 || !admin) {
    return res.status(401).json({ msg: "Can't proceed" });
  }

  req.admin = value;
  next();
};

const canDeleteUpdateTrainer = async (req, res, next) => {
  const { status, value, admin } = await verifyRequest(req, res);

  if (status == 401) {
    return res.status(401).json({ msg: "Can't proceed" });
  }

  const { id } = req.params;
  if (!admin && id != value.id) {
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
};
