import React, { useEffect, useState } from "react";
import "../../styles/AdminSettings.css";

const AdminSettings = () => {

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "true");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const resetData = () => {
    alert("Application data reset successfully");
  };

  return (
    <div className="admin-settings-container">

      <h2>Settings</h2>

      <div className="settings-card">

        <div className="setting-item">
          <span>🌙 Dark Mode</span>

          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <span>🔔 Notifications</span>

          <label className="switch">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <span>🗑️ Reset App Data</span>

          <button className="reset-btn" onClick={resetData}>
            Reset
          </button>
        </div>

        <div className="setting-item">
          <span>🚪 Logout</span>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminSettings;