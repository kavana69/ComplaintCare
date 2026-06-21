import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080",
});

API.interceptors.request.use((req) => {

    const token = localStorage.getItem("token");

    // Do NOT attach token for OTP/register APIs
    const publicUrls = [
        "/users/send-otp",
        "/users/verify-register",
        "/auth/login",
        "/auth/register",
        "/users/forgot-password/send-otp",
        "/users/forgot-password/verify-otp",
        "/users/forgot-password/reset",
        "/chatbot/message"
    ];

    const isPublic = publicUrls.some(url =>
        req.url.includes(url)
    );

    if (token && !isPublic) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});

export default API;