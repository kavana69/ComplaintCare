import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import "../styles/UserDashboard.css";
import NotificationBell from "../components/NotificationBell";


function UserDashboard() {
    const [showProfile, setShowProfile] = useState(false);
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
             <h1>Complaint Management System</h1>

             <div className="topbar-right">
                <NotificationBell />
                
                <div
            className="profile-icon"
            onClick={() => setShowProfile(!showProfile)}
        >
            👤
            </div>
    </div>
                    {showProfile && (
                        <div className="profile-dropdown">
                            <h3>User Details</h3>
                            <p><strong>Name:</strong> {name}</p>
                            <p><strong>Email:</strong> {email}</p>
                        </div>
                    )}
                    
                </div>
            <nav className="dashboard-nav">
                <Link to="home">🏠 Home</Link>
                <Link to="complaint">
                    📝 Register Complaint
                </Link>
                <Link to="history">
                    📋 Complaint History
                </Link>
                <Link to="/user/support">🤖 Customer Support</Link>
                <Link to="settings">
                    ⚙️ Settings
                </Link>
            </nav>

            <div className="dashboard-content">
                <Outlet />
            </div>

        </div>
    );
}

export default UserDashboard;