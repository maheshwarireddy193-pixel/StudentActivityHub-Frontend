import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/student/Dashboard";
import SubmitActivity from "./pages/student/SubmitActivity";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import ResumeBuilder from "./pages/student/ResumeBuilder";
import Profile from "./pages/student/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Settings from "./pages/Settings";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Student pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/submit-certificate"
          element={<SubmitActivity />}
        />

        {/* Faculty page */}
        <Route
          path="/faculty-dashboard"
          element={<FacultyDashboard />}
        />
        <Route 
        path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;