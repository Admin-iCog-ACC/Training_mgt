import { useState } from "react";

import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminHeader from "./components/AdminHeader";
import Projects from "./pages/admin/Projects";
import TrainerProjects from "./pages/trainer/TrainerProjects";
import Login from "./pages/admin/Login";
import Profile from "./pages/admin/Profile";
import Trainers from "./pages/admin/Trainers";
import ProjectDetail from "./pages/admin/ProjectDetail";
import TrainerDetail from "./pages/admin/TrainerDetail";
import ChangePassword from "./pages/admin/ChangePassword";
import ProjectLeads from "./pages/admin/ProjectLeads";
import ProjectLeadRegistration from "./pages/admin/ProjectLeadRegistration";
import Header from "./pages/trainer/Header";
import TrainerProjectDetail from "./pages/trainer/TrainerProjectDetail";
import TrainerProfile from "./pages/trainer/TrainerProfile";
import TrainerLogin from "./pages/trainer/TrainerLogin";
import TrainerRegistration from "./pages/trainer/TrainerRegistration";
// import ECommerce from "./pages/Dashboard/ECommerce";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="trainer_login" element={<TrainerLogin />} />
        <Route path="/" element={<Header />}>
          <Route path="projects" element={<TrainerProjects />} />
          <Route path="projects/:id" element={<TrainerProjectDetail />} />
          <Route path="profile" element={<TrainerProfile />} />
        </Route>
        <Route path="/admin" element={<AdminHeader />}>
          <Route path="projects" element={<Projects />} />
          <Route path="profile" element={<Profile />} />
          <Route path="trainers" element={<Trainers />} />
          <Route path="project/detail/:id" element={<ProjectDetail />} />
          <Route path="trainer/detail/:id" element={<TrainerDetail />} />
          <Route path="project_leads" element={<ProjectLeads />} />
          <Route
            path="project_leads/register"
            element={<ProjectLeadRegistration />}
          />
        </Route>
        <Route path="change/password" element={<ChangePassword />} />
        <Route path="trainer_registration" element={<TrainerRegistration />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
