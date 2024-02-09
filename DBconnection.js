const { Sequelize } = require("sequelize");
const Trainer = require("./models/TrainerModel");
const TrainerProjects = require("./models/TrainersProjects");
const Admin = require("./models/AdminModel");
const Project = require("./models/ProjectModel");

const connectToDB = async () => {
  const sequelize = new Sequelize(
    `postgres://${process.env.DBuser}:${process.env.DBpassword}@${process.env.DBhost}:${process.env.DBport}/${process.env.DB}`
  );

  try {
    await sequelize.authenticate();
    // Many-Many
    Trainer.belongsToMany(Project, {
      through: { model: TrainerProjects },
      onDelete: "CASCADE",
    });
    Project.belongsToMany(Trainer, {
      through: TrainerProjects,
      onDelete: "CASCADE",
    });

    // One-Many
    Admin.hasMany(Project, {
      foreignKey: {
        allowNull: false,
      },
    });
    Project.belongsTo(Admin);

    // One-Many
    Admin.hasMany(Trainer, {
      foreignKey: {
        allowNull: false,
      },
    });
    Trainer.belongsTo(Admin);

    await TrainerProjects.sync({ alter: true });
    await Project.sync({ alter: true });
    await Admin.sync({ alter: true });
    await Trainer.sync({ alter: true });

    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = connectToDB;
