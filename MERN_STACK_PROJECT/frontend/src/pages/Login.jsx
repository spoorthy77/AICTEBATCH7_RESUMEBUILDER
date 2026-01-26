import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import api from "../api/axios";
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate input
      if (!email || !password) {
        setError("⚠️ Both email and password are required!");
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("⚠️ Please enter a valid email address!");
        setLoading(false);
        return;
      }

      // Make API request
      const response = await api.post("/auth/login", { email, password });
      
      if (response.data && response.data.token) {
        // Login and redirect
        login(response.data.token);
      } else {
        setError("❌ Invalid response from server. Please try again.");
      }
    } catch (err) {
      // Handle different error types
      if (err.code === 'ERR_NETWORK') {
        setError("❌ Cannot connect to server. Please check if the backend is running.");
      } else if (err.response?.status === 401) {
        setError("❌ Invalid email or password. Please check your credentials.");
      } else if (err.response?.status === 400) {
        setError("⚠️ " + (err.response?.data?.message || "Bad request. Please check your input."));
      } else if (err.response?.status === 500) {
        setError("❌ Server error. Please try again later.");
      } else {
        setError("❌ " + (err.response?.data?.message || "Login failed. Please try again."));
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Admin Login</h2>
        <p className="subtitle">MERN Stack Application</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="info-box">
          <p><strong>Demo Credentials:</strong></p>
          <p>Email: demo@example.com</p>
          <p>Password: ********</p>
        </div>
      </div>
    </div>
  );
}
