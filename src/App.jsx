import { useState } from "react";

import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminHeader from "./components/AdminHeader";
import Projects from "./pages/admin/Projects";
import Login from "./pages/admin/Login";
import Profile from "./pages/admin/Profile";
import Trainers from "./pages/admin/Trainers";
// import ECommerce from "./pages/Dashboard/ECommerce";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/" element={<AdminHeader />}>
          <Route path="projects" element={<Projects />} />
          <Route path="profile" element={<Profile />} />
          <Route path="trainers" element={<Trainers />} />

          {/* <Route path="*" element={<Error />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
