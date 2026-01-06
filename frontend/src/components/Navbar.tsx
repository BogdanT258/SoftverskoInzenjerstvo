import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">📚</span>
          <span className="logo-text">Library System</span>
        </Link>

        {/* Navigation Links */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive("/")}`}>
            Home
          </Link>
          <Link to="/books" className={`nav-link ${isActive("/books")}`}>
            Books
          </Link>
          <Link to="/my-loans" className={`nav-link ${isActive("/my-loans")}`}>
            My Loans
          </Link>
          <Link to="/profile" className={`nav-link ${isActive("/profile")}`}>
            Profile
          </Link>
        </div>

        {/* Right side - User & Actions */}
        <div className="navbar-actions">
          <Link to="/books" className="browse-books-btn">
            Browse Books
          </Link>

          <div className="user-menu">
            <span className="user-greeting">
              Welcome, {user?.fullName?.split(" ")[0] || "User"}!
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
