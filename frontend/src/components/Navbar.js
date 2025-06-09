import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaComments,
  FaChartLine,
  FaCog,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import "../css/Navbar.css";
import { useAuth } from "./AuthContext"; // adjust path if needed

export default function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">MindEase</div>
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            <FaHome className="icon" />
            Home
          </Link>
          <Link to="/therapy" className="nav-link">
            <FaComments className="icon" />
            Therapy
          </Link>
          <Link to="/insights" className="nav-link">
            <FaChartLine className="icon" />
            Insights
          </Link>
          <Link to="/settings" className="nav-link">
            <FaCog className="icon" />
            Settings
          </Link>

          {token ? (
            <button className="nav-link logout-button" onClick={handleLogout}>
              <FaSignOutAlt className="icon" />
              Sign Out
            </button>
          ) : (
            <Link to="/login" className="nav-link">
              <FaSignInAlt className="icon" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
