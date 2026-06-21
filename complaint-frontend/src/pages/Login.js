import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import bg from "../assets/bg.jpg.avif";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      console.log(res.data);
      localStorage.setItem("name", res.data.data.name);
localStorage.setItem("email", res.data.data.email);
localStorage.setItem("userId", res.data.data.id);

      const token = res.data.data.token;
localStorage.setItem("token", token);

// decode JWT
const payload = JSON.parse(atob(token.split('.')[1]));
const role = payload.role;

console.log("ROLE:", role);

if (role === "ADMIN") {
    navigate("/admin");
} else {
    navigate("/user");
}

    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  return (
     <div className="login-page">

      {/* LEFT IMAGE */}
      <div className="login-left">
        <img src={bg} alt="bg" />
        <div className="login-overlay">
          <h1>Complaint Care</h1>
          <p>Track and manage complaints easily</p>
        </div>
      </div>
  <div className="login-right">
    <div className="login-card">
      <h2>Welcome Back 👋</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      <p>
        New user? <a href="/register">Register</a>
        <span
        style={{ color: "blue", cursor: "pointer" }}
        onClick={() => navigate("/register")}
      ></span>
      </p>
      <p
  className="login-link"
  onClick={() => navigate("/forgot-password")}
>
  Forgot Password?
</p>
    </div>
    </div>
  </div>
);
}

export default Login;