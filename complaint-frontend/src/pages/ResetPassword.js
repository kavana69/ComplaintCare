import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/Login.css";
import bg from "../assets/bg.jpg.avif";

function ResetPassword() {

  const location = useLocation();
  const navigate = useNavigate();

  const { email} = location.state;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async () => {

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      await API.put("/users/forgot-password/reset", {
        email,
        newPassword,
        confirmPassword
      });

      alert("Password updated successfully");

      navigate("/");

    } catch (err) {

      alert("Password reset failed");
    }
  };

  return (

    <div className="login-page">
        <div className="login-left">

                <img src={bg} alt="bg" className="left-bg-image" />

<div className="overlay-content">

    <h1>Reset Password</h1>

    <p>
        Create and confirm your new secure password
    </p>

</div>

            </div>

      <div className="login-right">

        <div className="login-card">

          <h2>Reset Password</h2>

          <input
            type="password"
            placeholder="New Password"
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button onClick={handleResetPassword}>
            Update Password
          </button>

        </div>

      </div>

    </div>
  );
}

export default ResetPassword;