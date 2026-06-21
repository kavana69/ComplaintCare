import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";
import Home from "./pages/user/home";
import Settings from "./pages/user/Settings";
import ComplaintForm from "./pages/user/ComplaintForm";
import AdminHome from "./pages/admin/AdminHome";
import AdminCharts from "./pages/admin/AdminCharts";
import AdminComplaints from "./pages/admin/AdminComplaints";
import ComplaintHistory from "./pages/user/ComplaintHistory";
import AdminSettings from "./pages/admin/AdminSettings";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CustomerSupport from "./pages/user/CustomerSupport";
import UserManagement from "./pages/admin/UserManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/user" element={<UserDashboard />} >
          <Route path="home" element={<Home />} />
          <Route path="settings" element={<Settings />} />
          <Route path="complaint" element={<ComplaintForm />} />
          <Route path="support" element={<CustomerSupport />} />
          <Route path="history" element={<ComplaintHistory />} />
        </Route>
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="home" element={<AdminHome />} />
          <Route path="charts" element={<AdminCharts />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;