const express = require("express");

const cors = require("cors");
const projectRouter = require("./routes/project");
const adminRouter = require("./routes/admin");
const trainersProjects = require("./models/TrainersProjects");
const trainerRouter = require("./routes/trainer");
const authRouter = require("./routes/auth");
const applicationRouter = require("./routes/application");
const ratingRouter = require("./routes/rating");
const { deleteFile } = require("./cloudinary");
const { sendEmail } = require("./Email");
const connectToDB = require("./DBconnection");
const Project = require("./models/ProjectModel");

require("dotenv").config();

const app = express();
app.use(express.json({ limit: "10000kb" }));
app.use(cors());
app.use("/api/project", projectRouter);
app.use("/api/admin", adminRouter);
app.use("/api/trainer", trainerRouter);
app.use("/api/auth", authRouter);
app.use("/api/application", applicationRouter);
app.use("/api/rating", ratingRouter);
app.delete("/api/deleteFile/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteFile(id);
    return res.status(204).json();
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ msg: "Failed to delete file" });
  }
});
app.get("/api/announceProject/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);

    if (!project) {
      return res
        .status(404)
        .json({ location: "", path: "", msg: "Project not found.", type: "" });
    }
    await sendEmail(project);
    return res.status(200).json({ msg: "Email sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to send an Email" });
  }
});

connectToDB();

app.listen(3000, () => console.log("App running on port 3000"));
