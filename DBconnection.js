const { Sequelize } = require("sequelize");
const Trainer = require("./models/TrainerModel");
const TrainerProjects = require("./models/TrainersProjects");
const Admin = require("./models/AdminModel");
const Project = require("./models/ProjectModel");
const TrainersRating = require("./models/TrainersRating");
require("dotenv").config();

const connectToDB = async () => {
  const sequelize = new Sequelize(
    // `postgres://${process.env.DBuser}:${process.env.DBpassword}@${process.env.DBhost}:${process.env.DBport}/${process.env.DB}`
    process.env.connection_string
  );

  try {
    await sequelize.authenticate();
    // Many - Many;
    Trainer.belongsToMany(Project, {
      through: { model: TrainerProjects },
      onDelete: "CASCADE",
    });
    Project.belongsToMany(Trainer, {
      through: TrainerProjects,
      onDelete: "CASCADE",
    });

    Trainer.hasMany(TrainerProjects);
    TrainerProjects.belongsTo(Trainer);
    Project.hasMany(TrainerProjects);
    TrainerProjects.belongsTo(Project);
    // Many - Many;
    Trainer.belongsToMany(Project, {
      through: { model: TrainersRating },
      onDelete: "CASCADE",
    });
    Project.belongsToMany(Trainer, {
      through: TrainersRating,
      onDelete: "CASCADE",
    });
    Trainer.hasMany(TrainersRating);
    TrainersRating.belongsTo(Trainer);
    Project.hasMany(TrainersRating);
    TrainersRating.belongsTo(Project);

    // One-Many
    Admin.hasMany(Project, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "RESTRICT",
    });
    Project.belongsTo(Admin, {
      foreignKey: {
        allowNull: false,
        // defaultValue: null,
      },
      onDelete: "CASCADE",
    });

    // One-Many
    Admin.hasMany(Trainer, {
      foreignKey: {
        allowNull: true,
        // defaultValue: null,
      },
      onDelete: "CASCADE",
    });
    Trainer.belongsTo(Admin);

    await TrainerProjects.sync({ alter: true });
    await TrainersRating.sync({ alter: true });
    await Project.sync({ alter: true });
    await Admin.sync({ alter: true });
    await Trainer.sync({ alter: true });

    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = connectToDB;
