import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Auth.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Login Form */}
        <div className="auth-form-side">
          <h1 className="auth-title">Login</h1>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Username"
                className="auth-input"
              />
              <span className="input-icon">👤</span>
            </div>

            <div className="input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="auth-input"
              />
              <span className="input-icon">🔒</span>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          <p className="auth-link-text">
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Diagonal Line */}
        <div className="diagonal-line"></div>

        {/* Right Side - Welcome Text */}
        <div className="auth-welcome-side">
          <h2 className="welcome-title">
            WELCOME
            <br />
            BACK!
          </h2>
          <p className="welcome-text">
            Lorem ipsum, dolor sit
            <br />
            amet consectetur
            <br />
            adipisicing
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
