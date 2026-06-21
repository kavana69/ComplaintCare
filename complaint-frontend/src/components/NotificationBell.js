import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import "../styles/NotificationBell.css";

function NotificationBell() {

    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);

    const email = localStorage.getItem("email");

    useEffect(() => {

        fetchNotifications();

        const interval = setInterval(() => {
            fetchNotifications();
        }, 5000);

        return () => clearInterval(interval);

    }, []);

    const fetchNotifications = async () => {

        try {

            const response = await axios.get(
                `http://localhost:8085/notifications/email/${email}`
            );

            setNotifications(response.data.reverse());

        } catch (error) {
            console.log(error);
        }
    };

    return (

        <div className="notification-wrapper">

            <div
                className="notification-icon"
                onClick={() => setOpen(!open)}
            >

                <FaBell className="notification-icon" />

                {notifications.length > 0 && (
                    <span className="notification-badge">
                        {notifications.length}
                    </span>
                )}

            </div>

            {open && (

                <div className="notification-panel">

                    <div className="notification-header">
                        Notifications
                    </div>

                    {notifications.length === 0 ? (

                        <p className="empty-msg">
                            No notifications
                        </p>

                    ) : (

                        notifications.map((n) => (

                            <div
                                className="notification-card"
                                key={n.id}
                            >

                                <p>{n.message}</p>

                                <small>
                                    {new Date(n.timestamp).toLocaleString()}
                                </small>

                            </div>

                        ))
                    )}

                </div>
            )}
        </div>
    );
}

export default NotificationBell;