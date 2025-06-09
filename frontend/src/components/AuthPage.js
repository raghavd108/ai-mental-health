import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import API from "../api/axios"; // ✅ custom axios instance
import "../css/AuthPage.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isLogin ? "auth/login" : "auth/register";

    try {
      const res = await API.post(
        endpoint,
        { email, password },
        { withCredentials: true }
      );

      if (!isLogin) {
        // Auto login after successful signup
        const loginRes = await API.post(
          "auth/login",
          { email, password },
          { withCredentials: true }
        );
        login(loginRes.data.token);
        navigate("/");
      } else {
        login(res.data.token);
        navigate("/");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Server error. Please try again later.");
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login to MindEase" : "Create Your MindEase Account"}</h2>
      {error && <p className="error">{error}</p>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
      </form>

      <p className="toggle-text">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <span onClick={() => setIsLogin(!isLogin)} className="toggle-link">
          {isLogin ? "Sign up" : "Log in"}
        </span>
      </p>
    </div>
  );
}
