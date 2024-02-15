import { useState } from "react";

import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminHeader from "./components/AdminHeader";
import Projects from "./pages/admin/Projects";
import Login from "./pages/admin/Login";
import Profile from "./pages/admin/Profile";
import Trainers from "./pages/admin/Trainers";
import ProjectDetail from "./pages/admin/ProjectDetail";
import TrainerDetail from "./pages/admin/TrainerDetail";
import ChangePassword from "./pages/admin/ChangePassword";
import ProjectLeads from "./pages/admin/ProjectLeads";
import ProjectLeadRegistration from "./pages/admin/ProjectLeadRegistration";
// import ECommerce from "./pages/Dashboard/ECommerce";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
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

          {/* <Route path="*" element={<Error />} /> */}
        </Route>
        <Route path="change/password" element={<ChangePassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
