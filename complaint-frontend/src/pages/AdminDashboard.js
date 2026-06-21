import { Link, Outlet } from "react-router-dom";
import React,{ useState } from "react";
import "../styles/AdminDashboard.css";
import NotificationBell from "../components/NotificationBell";

// ADMIN INFO
  const adminName = localStorage.getItem("username") || "Admin";
  const adminEmail =
    localStorage.getItem("email") || "admin@gmail.com";
function AdminDashboard() {
    const [showProfile, setShowProfile] = useState(false);
  return (
    <div className="admin-container">

      {/* SIDEBAR */}
      <div className="admin-sidebar">
        <h2>Admin Dashboard</h2>

        <Link to="home">📊 Dashboard</Link>
        <Link to="charts">📈 Analytics</Link>
        <Link to="complaints">🗂️ Complaints</Link>
        <Link to="users">👥 User Management</Link>
        <Link to="settings">⚙️ Settings</Link>
      </div>

      {/* MAIN CONTENT */}
      <div className="admin-main">
        {/* TOPBAR */}
        <div className="admin-topbar">
          <h1>Complaint Management System</h1>
          <div className="topbar-right">

                <NotificationBell />
          <div
          className="admin-profile"
          onClick={() => setShowProfile(!showProfile)}
        >
          👤 {adminName}

          {showProfile && (
            <div className="profile-dropdown">
              <p>
                <strong>Username:</strong> {adminName}
              </p>

              <p>
                <strong>Email:</strong> {adminEmail}
              </p>
            </div>
          )}
        </div>
        </div>   
        </div>

        {/* PAGE CONTENT */}
        <div className="admin-content">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;