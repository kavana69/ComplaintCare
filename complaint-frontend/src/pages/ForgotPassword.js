import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/Login.css";
import bg from "../assets/bg.jpg.avif";

function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [otp, setOtp] = useState("");

  // SEND OTP
  const handleSendOtp = async () => {

    try {

      await API.post(`/users/forgot-password/send-otp?email=${email}`);

      alert("OTP sent successfully");

    } catch (err) {

      alert("Failed to send OTP");
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async () => {

    try {

      await API.post("/users/forgot-password/verify-otp", {
    email,
    otp,
});

      alert("OTP verified");

      navigate("/reset-password", {
    state: { email },
});

    } catch (err) {

      alert("Invalid OTP");
    }
  };

  return (

    <div className="login-page">
        <div className="login-left">

    <img src={bg} alt="bg" className="left-bg-image" />

<div className="overlay-content">

    <h1>Complaint Care</h1>

    <p>
        Secure password recovery with OTP verification
    </p>

</div>

</div>

      <div className="login-right">

        <div className="login-card">

          <h2>Forgot Password?</h2>

          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Old Password"
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <button onClick={handleSendOtp}>
            Send OTP
          </button>

          <input
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
          />

          <button onClick={handleVerifyOtp}>
            Verify OTP
          </button>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;