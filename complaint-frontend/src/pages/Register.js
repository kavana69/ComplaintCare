import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import bg from "../assets/bg.jpg.avif";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const navigate = useNavigate();

    // SEND OTP
    const sendOtp = async () => {

        try {

            await API.post("/users/send-otp", {
                email
            });

            alert("OTP sent successfully");

            setOtpSent(true);

        } catch (err) {
            console.log(err);

            alert("Failed to send OTP");
        }
    };

    // REGISTER AFTER OTP VERIFY
    const handleRegister = async () => {

        try {

            await API.post("/users/verify-register", {

                name,
                email,
                password,
                otp

            });

            alert("Registration successful");

            navigate("/");

        } catch (err) {

            console.log(err);

            alert("Invalid OTP or registration failed");
        }
    };

    return (

        <div className="login-page">

            {/* LEFT SIDE IMAGE */}
            <div className="login-left">

                <img src={bg} alt="bg" />

                <div className="login-overlay">
                    <h1>Complaint Care</h1>
                    <p>Track and manage complaints easily</p>
                </div>

            </div>

            {/* RIGHT SIDE REGISTER FORM */}
            <div className="login-right">

                <div className="login-card">

                    <h2>Register</h2>

                    <input
                        placeholder="Name"
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        placeholder="Password"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* OTP INPUT */}
                    {
                        otpSent && (

                            <input
                                placeholder="Enter OTP"
                                onChange={(e) => setOtp(e.target.value)}
                            />

                        )
                    }

                    {/* SEND OTP BUTTON */}
                    <button onClick={sendOtp}>
                        Send OTP
                    </button>

                    {/* REGISTER BUTTON */}
                    <button onClick={handleRegister}>
                        Register
                    </button>

                    <p>
                        Already have an account?{" "}
                        <span
                            className="login-link"
                            onClick={() => navigate("/")}
                        >
                            Login
                        </span>
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Register;