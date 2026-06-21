import { useState, useEffect } from "react";
import "./../../styles/Settings.css";
import { useNavigate } from "react-router-dom";

function Settings() {
    const navigate = useNavigate();
    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");

    navigate("/");
};
    const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
);
    useEffect(() => {
    if (darkMode) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "true");
    } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "false");
    }
}, [darkMode]);
    return (
        <div className="settings-container">
            <h2>Settings</h2>
            <div className="setting-card">
                {/* DARK MODE */}
                <div className="setting-row">
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

                {/* NOTIFICATIONS */}
                <div className="setting-row">
                    <span>🔔 Notifications</span>
                    <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                    </label>
                </div>
                {/* RESET */}
                <div className="setting-row">
                    <span>🔄 Reset App Data</span>
                    <button className="reset-btn">
                        Reset
                    </button>
                </div>
                {/* LOGOUT */}
                <div className="setting-row">
                    <span>🚪 Logout</span>
                    <button
                     className="logout-btn"
                     onClick={handleLogout}
                    >
                    Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
export default Settings;