// Import the `useState` hook from React for local component state
import { useState } from "react";
// Import a pre-configured axios instance for API calls
import api from "../api/axios";
// Import component-scoped styles
import "../styles/components.css";

// Export the AddAgent component as the default export
export default function AddAgent() {
  // State: agent name input
  const [name, setName] = useState("");
  // State: agent email input
  const [email, setEmail] = useState("");
  // State: agent mobile input
  const [mobile, setMobile] = useState("");
  // State: agent password input
  const [password, setPassword] = useState("");
  // State: loading indicator for API request
  const [loading, setLoading] = useState(false);
  // State: error message to display to user
  const [error, setError] = useState("");
  // State: success message to display to user
  const [success, setSuccess] = useState("");

  // Form submit handler (async because it calls an API)
  const handleSubmit = async (e) => {
    // Prevent the browser from submitting the form normally
    e.preventDefault();
    // Turn on loading state
    setLoading(true);
    // Clear any previous messages
    setError("");
    setSuccess("");

    try {
      // Validate input: ensure all fields are filled
      if (!name || !email || !mobile || !password) {
        setError("⚠️ All fields are required!");
        setLoading(false);
        return;
      }

      // Validate email format with a simple regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("⚠️ Please enter a valid email address!");
        setLoading(false);
        return;
      }

      // Validate mobile format: simple length check
      if (mobile.length < 10) {
        setError("⚠️ Mobile number must be at least 10 digits!");
        setLoading(false);
        return;
      }

      // Make API request to create a new agent
      const response = await api.post("/agents", { 
        name, 
        email, 
        mobile, 
        password 
      });

      // On success, show a success message including the agent name
      setSuccess(`✅ Agent "${name}" added successfully!`);
      // Clear the form inputs
      setName("");
      setEmail("");
      setMobile("");
      setPassword("");

      // Clear success message after 3 seconds to keep UI clean
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      // Network-level error handling
      if (err.code === 'ERR_NETWORK') {
        setError("❌ Cannot connect to server. Please check your connection.");
      // Handle validation errors returned by the API
      } else if (err.response?.status === 400) {
        setError("⚠️ " + (err.response?.data?.message || "Invalid data. Please check all fields."));
      // Handle unauthorized responses
      } else if (err.response?.status === 401) {
        setError("❌ Unauthorized. Please login again.");
      // Fallback error message for other cases
      } else {
        setError("❌ " + (err.response?.data?.message || "Failed to add agent. Please try again."));
      }
    } finally {
      // Ensure loading state is turned off regardless of outcome
      setLoading(false);
    }
  };

  // Render the add-agent form UI
  return (
    <div className="component-box">
      {/* Section title */}
      <h2>Add New Agent</h2>
      {/* Show error message if present */}
      {error && <div className="error-message">{error}</div>}
      {/* Show success message if present */}
      {success && <div className="success-message">{success}</div>}
      {/* The form uses the handleSubmit function on submit */}
      <form onSubmit={handleSubmit} className="form" autoComplete="off">
        {/* Agent name input group */}
        <div className="form-group">
          <label>Agent Name:</label>
          <input
            // Text input for the agent's name
            type="text"
            // Controlled input value bound to `name` state
            value={name}
            // Update `name` state when user types
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter agent name"
            autoComplete="off"
            required
            // Disable input when submitting
            disabled={loading}
          />
        </div>

        {/* Agent email input group */}
        <div className="form-group">
          <label>Email:</label>
          <input
            // Email input type provides basic browser validation
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter agent email"
            autoComplete="new-email"
            name="agent-email"
            required
            disabled={loading}
          />
        </div>

        {/* Agent mobile input group */}
        <div className="form-group">
          <label>Mobile Number (with country code):</label>
          <input
            // Telephone input for mobile number
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="e.g., +1234567890"
            autoComplete="off"
            name="agent-mobile"
            required
            disabled={loading}
          />
        </div>

        {/* Agent password input group */}
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a secure password"
            autoComplete="new-password"
            name="agent-password"
            required
            disabled={loading}
          />
        </div>

        {/* Submit button - shows loading text while submitting */}
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Adding..." : "Add Agent"}
        </button>
      </form>
    </div>
  );
}
